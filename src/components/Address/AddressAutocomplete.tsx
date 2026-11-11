/**
 * AddressAutocomplete – input with address suggestions dropdown.
 * Provider-agnostic: pass a GeocodingProvider (e.g. from your Mapbox adapter).
 * The suggestions are an AnchoredOverlay: on web they portal into document.body
 * and follow the input as the page scrolls, so they always stack on top.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { View, Pressable, Text } from 'react-native'
import { Input } from '../Input'
import { Spinner } from '../Spinner'
import { AnchoredOverlay, getMenuItemStyle, useListboxNavigation } from '../AnchoredOverlay'
import { useAddressAutocomplete } from './useAddressAutocomplete'
import type { AddressAutocompleteProps, AddressResult } from './Address.types'
import { useHoverState } from '../../platform/web/useHoverState'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { fontSize } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'

function ResultItem({
  address,
  onSelect,
  active,
  optionProps,
}: {
  address: AddressResult
  onSelect: () => void
  active: boolean
  optionProps: ReturnType<ReturnType<typeof useListboxNavigation>['getOptionProps']>
}) {
  const { theme } = useThemeContext()
  const { isHovered, hoverProps } = useHoverState()
  return (
    <Pressable
      onPress={onSelect}
      {...hoverProps}
      {...optionProps}
      style={({ pressed }) => getMenuItemStyle(theme, { active: active || isHovered, pressed })}
    >
      <Text style={{ fontSize: fontSize.md, color: colors.text[theme].primary }}>
        {address.formattedAddress}
      </Text>
    </Pressable>
  )
}

export function AddressAutocomplete({
  value: controlledValue,
  onAddressSelect,
  onChange,
  placeholder = 'Search addresses...',
  error,
  errorMessage,
  disabled = false,
  provider,
  searchOptions,
  debounceMs = 300,
  minLength = 2,
  maxResults = 5,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(controlledValue ?? '')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<View>(null)
  const listboxId = `address-results-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const {
    results,
    loading,
    error: searchError,
    search,
    clearResults,
  } = useAddressAutocomplete({
    provider: provider ?? null,
    searchOptions,
    debounceMs,
    minLength,
    maxResults,
  })

  const showList = open && (results.length > 0 || loading)

  useEffect(() => {
    if (controlledValue !== undefined) setInputValue(controlledValue)
  }, [controlledValue])

  const handleClose = useCallback(() => {
    setOpen(false)
    clearResults()
  }, [clearResults])

  const handleChange = useCallback(
    (text: string) => {
      setInputValue(text)
      onChange?.(text)
      if (text.trim().length >= minLength) search(text)
      else clearResults()
      setOpen(true)
    },
    [minLength, search, clearResults, onChange]
  )

  const handleSelect = useCallback(
    (address: AddressResult) => {
      setInputValue(address.formattedAddress)
      onChange?.(address.formattedAddress)
      onAddressSelect?.(address)
      clearResults()
      setOpen(false)
    },
    [onChange, onAddressSelect, clearResults]
  )

  const nav = useListboxNavigation({
    id: listboxId,
    itemCount: loading ? 0 : results.length,
    open: showList,
    onSelectIndex: (index) => {
      const address = results[index]
      if (address) handleSelect(address)
    },
    onClose: handleClose,
  })

  const displayError =
    typeof error === 'string' ? error : (errorMessage ?? searchError ?? undefined)

  return (
    <View
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 1,
        overflow: 'visible' as const,
      }}
    >
      <Input
        value={inputValue}
        onChangeText={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        error={Boolean(displayError)}
        errorMessage={displayError}
        disabled={disabled}
        {...nav.inputProps}
      />
      <AnchoredOverlay
        anchorRef={containerRef}
        open={showList}
        onRequestClose={handleClose}
        maxHeight={240}
        {...nav.listboxProps}
      >
        {loading ? (
          <View style={{ padding: spacing[16], alignItems: 'center' }}>
            <Spinner size="sm" />
          </View>
        ) : (
          results.map((addr, index) => (
            <ResultItem
              key={addr.id}
              address={addr}
              onSelect={() => handleSelect(addr)}
              active={nav.activeIndex === index}
              optionProps={nav.getOptionProps(index)}
            />
          ))
        )}
      </AnchoredOverlay>
    </View>
  )
}
