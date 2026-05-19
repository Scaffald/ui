/**
 * AddressForm – address input with autocomplete and optional manual fields.
 * Provider-agnostic: pass a GeocodingProvider to AddressAutocomplete.
 */

import { useCallback, useEffect, useState } from 'react'
import { Pressable, Text } from 'react-native'
import { Stack } from '../Layout'
import { Input } from '../Input'
import { ResponsiveSelect } from '../ResponsiveSelect'
import { AddressAutocomplete } from './AddressAutocomplete'
import type { AddressFormProps, AddressResult } from './Address.types'

export function AddressForm({
  value,
  onAddressSelect,
  onAddressChange,
  onChange,
  addressValue,
  mode = 'autocomplete-only',
  placeholder = 'Search addresses...',
  provider,
  manualFieldsVariant = 'always',
  expandLabel = 'Edit address manually',
  collapseLabel = 'Hide',
  lockedCountry,
  stateOptions,
  fieldErrors,
  ...autocompleteProps
}: AddressFormProps) {
  const [manualExpanded, setManualExpanded] = useState(false)

  const handleSelect = useCallback(
    (address: AddressResult) => {
      onAddressSelect?.(address)
      onAddressChange?.({
        formattedAddress: address.formattedAddress,
        streetAddress: address.streetAddress,
        locality: address.locality,
        administrativeAreaLevel1: address.administrativeAreaLevel1,
        stateAbbreviation: address.stateAbbreviation,
        postalCode: address.postalCode,
        country: lockedCountry ?? address.country,
        countryCode: address.countryCode,
        coordinates: address.coordinates,
      })
    },
    [onAddressSelect, onAddressChange, lockedCountry]
  )

  const hasManualFields = mode === 'full' || mode === 'hybrid'
  const useExpandVariant = hasManualFields && manualFieldsVariant === 'expand'
  const showManualFields =
    hasManualFields && (!useExpandVariant || manualExpanded)
  const addr = addressValue ?? {}

  // When the country is locked but the form was initialised with a different
  // (or empty) value, sync it once so downstream forms see the locked value.
  useEffect(() => {
    if (lockedCountry && addr.country !== lockedCountry) {
      onAddressChange?.({ ...addr, country: lockedCountry })
    }
    // Only react to lockedCountry changing — onAddressChange is intentionally
    // omitted to avoid loops when the parent re-creates the callback.
    // biome-ignore lint/correctness/useExhaustiveDependencies: see comment
  }, [lockedCountry])

  return (
    <Stack gap={16}>
      <AddressAutocomplete
        value={value}
        onAddressSelect={handleSelect}
        onChange={onChange}
        placeholder={placeholder}
        provider={provider}
        {...autocompleteProps}
      />
      {useExpandVariant && !manualExpanded && (
        <Pressable
          onPress={() => setManualExpanded(true)}
          accessibilityRole="button"
          accessibilityLabel={expandLabel}
          style={({ pressed }) => ({
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 0,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 14, color: '#2563eb' }}>{expandLabel}</Text>
        </Pressable>
      )}
      {showManualFields && (
        <Stack gap={12}>
          {useExpandVariant && (
            <Pressable
              onPress={() => setManualExpanded(false)}
              accessibilityRole="button"
              accessibilityLabel={collapseLabel}
              style={({ pressed }) => ({
                alignSelf: 'flex-start',
                paddingVertical: 4,
                paddingHorizontal: 0,
                marginBottom: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 13, color: '#6b7280' }}>{collapseLabel}</Text>
            </Pressable>
          )}
          <Input
            label="Street"
            value={addr.streetAddress ?? ''}
            onChangeText={(t) => onAddressChange?.({ ...addr, streetAddress: t })}
            placeholder="Street address"
            error={!!fieldErrors?.street}
            errorMessage={fieldErrors?.street}
          />
          <Stack gap={12} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Input
              label="City"
              value={addr.locality ?? ''}
              onChangeText={(t) => onAddressChange?.({ ...addr, locality: t })}
              placeholder="City"
              style={{ flex: 1, minWidth: 120 }}
              error={!!fieldErrors?.city}
              errorMessage={fieldErrors?.city}
            />
            {stateOptions ? (
              <Stack style={{ width: 120 }} gap={4}>
                <Text style={{ fontSize: 13, color: '#374151' }}>State</Text>
                <ResponsiveSelect
                  value={addr.stateAbbreviation ?? addr.administrativeAreaLevel1 ?? ''}
                  onValueChange={(v) =>
                    onAddressChange?.({
                      ...addr,
                      stateAbbreviation: v,
                      administrativeAreaLevel1: v,
                    })
                  }
                  options={stateOptions}
                  placeholder="State"
                  sheetTitle="Select state"
                  error={fieldErrors?.state}
                />
              </Stack>
            ) : (
              <Input
                label="State"
                value={addr.stateAbbreviation ?? addr.administrativeAreaLevel1 ?? ''}
                onChangeText={(t) =>
                  onAddressChange?.({ ...addr, stateAbbreviation: t, administrativeAreaLevel1: t })
                }
                placeholder="State"
                style={{ width: 80 }}
                error={!!fieldErrors?.state}
                errorMessage={fieldErrors?.state}
              />
            )}
            <Input
              label="ZIP"
              value={addr.postalCode ?? ''}
              onChangeText={(t) => onAddressChange?.({ ...addr, postalCode: t })}
              placeholder="ZIP"
              style={{ width: 100 }}
              keyboardType="number-pad"
              maxLength={5}
              error={!!fieldErrors?.zip}
              errorMessage={fieldErrors?.zip}
            />
          </Stack>
          <Input
            label="Country"
            value={lockedCountry ?? addr.country ?? ''}
            onChangeText={
              lockedCountry
                ? undefined
                : (t) => onAddressChange?.({ ...addr, country: t })
            }
            placeholder="Country"
            disabled={!!lockedCountry}
          />
        </Stack>
      )}
    </Stack>
  )
}
