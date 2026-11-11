/**
 * SearchSelect component
 * Searchable dropdown with filtering
 *
 * @example
 * ```tsx
 * import { SearchSelect } from '@scaffald/ui'
 *
 * const options = [
 *   { value: 'us', label: 'United States' },
 *   { value: 'uk', label: 'United Kingdom' },
 *   { value: 'ca', label: 'Canada' },
 * ]
 *
 * <SearchSelect
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Select country"
 *   searchable
 * />
 * ```
 */

import { useId, useMemo, useRef } from 'react'
import { View, TextInput, Pressable, StyleSheet, Text as RNText } from 'react-native'
import type { SearchSelectProps, SearchSelectOption } from './SearchSelect.types'
import { useThemeContext } from '../../theme'
import { useStyles } from '../../hooks'
import { useSearchSelect } from './useSearchSelect'
import { colors } from '../../tokens/colors'
import { borderRadius, borderWidth } from '../../tokens/borders'
import { spacing } from '../../tokens/spacing'
import { Text, Caption } from '../Typography'
import { Label } from '../Typography'
import { Spinner } from '../Spinner'
import { webStyle } from '../../utils/webStyles'
import { AnchoredOverlay, useListboxNavigation } from '../AnchoredOverlay'
import type { ListboxOptionProps } from '../AnchoredOverlay'

// ============================================================================
// SearchSelect Component
// ============================================================================

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  multiple = false,
  searchable = true,
  clearable = true,
  disabled = false,
  error = false,
  size = 'md',
  label,
  helperText,
  errorMessage,
  noResultsText = 'No results found',
  loadingText = 'Loading...',
  loading = false,
  maxDropdownHeight = 300,
  filterFunction,
  renderOption,
  style,
  testID,
}: SearchSelectProps) {
  const { theme } = useThemeContext()

  const select = useSearchSelect({
    options,
    value,
    onChange,
    multiple,
    searchable,
    disabled,
    filterFunction,
  })

  const hasError = error || !!errorMessage
  const styles = useStyles(getStyles, [theme, size, disabled, hasError, select.isOpen] as const)
  const triggerRef = useRef<View>(null)
  const listboxId = `search-select-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  // Options in the order they are drawn, for arrow-key navigation.
  const flatOptions = useMemo(
    () => [
      ...select.groupedOptions.ungrouped,
      ...Object.values(select.groupedOptions.groups).flat(),
    ],
    [select.groupedOptions]
  )
  const showOptions = !loading && flatOptions.length > 0
  const nav = useListboxNavigation({
    id: listboxId,
    itemCount: showOptions ? flatOptions.length : 0,
    open: select.isOpen,
    onSelectIndex: (index) => {
      const option = flatOptions[index]
      if (option && !option.disabled) select.handleSelect(option.value)
    },
    onClose: select.handleClose,
  })
  const optionIndex = (option: SearchSelectOption) => flatOptions.indexOf(option)

  return (
    <View style={[styles.container, style]} testID={testID}>
      {label && (
        <Label disabled={disabled} style={styles.label}>
          {label}
        </Label>
      )}

      {/* Trigger */}
      <Pressable
        ref={triggerRef}
        style={styles.trigger}
        onPress={select.handleToggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: select.isOpen, disabled }}
      >
        {select.isOpen && searchable ? (
          <TextInput
            ref={select.inputRef}
            style={styles.searchInput}
            value={select.searchQuery}
            onChangeText={select.setSearchQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.text[theme].tertiary}
            autoFocus
            {...nav.inputProps}
          />
        ) : (
          <RNText
            style={
              select.displayText ? styles.displayText : [styles.displayText, styles.placeholder]
            }
            numberOfLines={1}
          >
            {select.displayText || placeholder}
          </RNText>
        )}

        <View style={styles.icons}>
          {clearable && select.selectedValues.length > 0 && !disabled && (
            <Pressable onPress={select.handleClear} hitSlop={8}>
              <Text style={styles.clearIcon}>×</Text>
            </Pressable>
          )}
          <Text style={styles.chevron}>{select.isOpen ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {/* Dropdown — portalled above the page on web (AnchoredOverlay) */}
      <AnchoredOverlay
        anchorRef={triggerRef}
        open={select.isOpen}
        onRequestClose={select.handleClose}
        maxHeight={maxDropdownHeight}
        {...nav.listboxProps}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="sm" />
            <Text size="sm" color="secondary">
              {loadingText}
            </Text>
          </View>
        ) : select.filteredOptions.length === 0 ? (
          <View style={styles.noResults}>
            <Text size="sm" color="secondary">
              {noResultsText}
            </Text>
          </View>
        ) : (
          <>
            {/* Ungrouped options */}
            {select.groupedOptions.ungrouped.map((option) => (
              <OptionItem
                key={option.value}
                option={option}
                isSelected={select.selectedValues.includes(option.value)}
                isActive={nav.activeIndex === optionIndex(option)}
                optionProps={nav.getOptionProps(
                  optionIndex(option),
                  select.selectedValues.includes(option.value)
                )}
                onSelect={select.handleSelect}
                theme={theme}
                multiple={multiple}
                renderOption={renderOption}
              />
            ))}

            {/* Grouped options */}
            {Object.entries(select.groupedOptions.groups).map(([group, groupOptions]) => (
              <View key={group}>
                <View style={styles.groupHeader}>
                  <Text size="xs" weight="medium" color="secondary">
                    {group}
                  </Text>
                </View>
                {groupOptions.map((option) => (
                  <OptionItem
                    key={option.value}
                    option={option}
                    isSelected={select.selectedValues.includes(option.value)}
                    isActive={nav.activeIndex === optionIndex(option)}
                    optionProps={nav.getOptionProps(
                      optionIndex(option),
                      select.selectedValues.includes(option.value)
                    )}
                    onSelect={select.handleSelect}
                    theme={theme}
                    multiple={multiple}
                    renderOption={renderOption}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </AnchoredOverlay>

      {/* Helper/Error text */}
      {(errorMessage || helperText) && (
        <Caption color={hasError ? 'error' : 'secondary'} style={styles.helperText}>
          {errorMessage || helperText}
        </Caption>
      )}
    </View>
  )
}

// ============================================================================
// OptionItem Component
// ============================================================================

interface OptionItemProps {
  option: SearchSelectOption
  isSelected: boolean
  /** Highlighted by the keyboard. */
  isActive?: boolean
  optionProps?: ListboxOptionProps
  onSelect: (value: string) => void
  theme: 'light' | 'dark'
  multiple: boolean
  renderOption?: (option: SearchSelectOption, isSelected: boolean) => React.ReactNode
}

function OptionItem({
  option,
  isSelected,
  isActive = false,
  optionProps,
  onSelect,
  theme,
  multiple,
  renderOption,
}: OptionItemProps) {
  const styles = useStyles(getOptionStyles, [theme, isSelected, option.disabled] as const)
  const rowStyle = [styles.option, isActive && !isSelected && styles.optionActive]

  if (renderOption) {
    return (
      <Pressable
        {...optionProps}
        style={rowStyle}
        onPress={() => !option.disabled && onSelect(option.value)}
        disabled={option.disabled}
      >
        {renderOption(option, isSelected)}
      </Pressable>
    )
  }

  return (
    <Pressable
      {...optionProps}
      style={rowStyle}
      onPress={() => !option.disabled && onSelect(option.value)}
      disabled={option.disabled}
    >
      <View style={styles.optionContent}>
        {option.icon && <View style={styles.optionIcon}>{option.icon}</View>}
        <View style={styles.optionText}>
          <Text style={option.disabled ? styles.optionLabelDisabled : undefined}>
            {option.label}
          </Text>
          {option.description && (
            <Text size="xs" color="secondary">
              {option.description}
            </Text>
          )}
        </View>
      </View>
      {isSelected && <Text style={styles.checkmark}>{multiple ? '☑' : '✓'}</Text>}
    </Pressable>
  )
}

// ============================================================================
// Styles
// ============================================================================

function getStyles(
  theme: 'light' | 'dark',
  size: 'sm' | 'md' | 'lg',
  disabled: boolean,
  hasError: boolean,
  isOpen: boolean
) {
  const sizeConfig = {
    sm: { height: 32, paddingHorizontal: 8, fontSize: 14 },
    md: { height: 40, paddingHorizontal: 12, fontSize: 16 },
    lg: { height: 48, paddingHorizontal: 16, fontSize: 18 },
  }

  const config = sizeConfig[size]

  return StyleSheet.create({
    container: {
      position: 'relative',
    },
    label: {
      marginBottom: spacing[4],
    },
    trigger: {
      height: config.height,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: config.paddingHorizontal,
      backgroundColor: disabled ? colors.bg[theme].muted : colors.bg[theme].default,
      borderWidth: borderWidth.thin,
      borderColor: hasError
        ? colors.error[500]
        : isOpen
          ? colors.primary[500]
          : colors.border[theme].default,
      borderRadius: borderRadius.s,
      opacity: disabled ? 0.6 : 1,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      fontSize: config.fontSize,
      color: colors.text[theme].primary,
      ...webStyle({ outlineStyle: 'none' }),
    },
    displayText: {
      flex: 1,
      fontSize: config.fontSize,
      color: colors.text[theme].primary,
    },
    placeholder: {
      color: colors.text[theme].tertiary,
    },
    icons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[8],
    },
    clearIcon: {
      fontSize: 18,
      color: colors.text[theme].secondary,
    },
    chevron: {
      fontSize: 10,
      color: colors.text[theme].secondary,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[8],
      padding: spacing[16],
    },
    noResults: {
      padding: spacing[16],
      alignItems: 'center',
    },
    groupHeader: {
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[8],
      backgroundColor: colors.bg[theme].subtle,
    },
    helperText: {
      marginTop: spacing[4],
    },
  })
}

function getOptionStyles(theme: 'light' | 'dark', isSelected: boolean, disabled?: boolean) {
  return StyleSheet.create({
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[10],
      backgroundColor: isSelected ? colors.bg[theme].subtle : colors.bg[theme].default,
      opacity: disabled ? 0.5 : 1,
    },
    optionActive: {
      backgroundColor: colors.bg[theme].muted,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIcon: {
      marginRight: spacing[8],
    },
    optionText: {
      flex: 1,
    },
    optionLabelDisabled: {
      color: colors.text[theme].tertiary,
    },
    checkmark: {
      color: colors.primary[500],
      marginLeft: spacing[8],
    },
  })
}
