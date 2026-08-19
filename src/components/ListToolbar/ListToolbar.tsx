/**
 * ListToolbar — search + one filter flyout + a removable chip strip + a count.
 *
 * Every list screen gets this same trio, in this order. The prototype's audit
 * called out two competing idioms — Find talent used a "Filters & sort · 5"
 * flyout beside a search field, while the recruiter pipeline and NationSearch
 * queue exposed loose inline chips with no flyout — so a user who learned one
 * screen could not predict the next. Our app has the same split between the
 * discover screens' MapFilterBar/SortDropdown pair and the ATS's
 * ApplicationsFilters.
 *
 * The chip strip is for filters ALREADY applied, so they can be removed
 * without reopening the flyout. It is not a second place to set them.
 *
 * @example
 * ```tsx
 * <ListToolbar
 *   searchValue={q}
 *   onSearchChange={setQ}
 *   searchPlaceholder="Search candidates..."
 *   activeFilterCount={2}
 *   filterContent={<MyFilters />}
 *   chips={[{ id: 'job', label: 'Job', value: 'Site Electrical Lead', onPress: open, onClear: clearJob }]}
 *   resultCount={14}
 *   resultNoun="case"
 * />
 * ```
 */

import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Filter, Search, X } from 'lucide-react-native'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/borders'
import { Text } from '../Typography/Text'
import { Input } from '../Input'
import { Popover, PopoverContent } from '../Popover'
import type { ListToolbarProps } from './ListToolbar.types'

export function ListToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  renderSearch,
  filterContent,
  activeFilterCount = 0,
  filtersOpen,
  onFiltersOpenChange,
  chips,
  onClearAll,
  resultCount,
  resultNoun = 'result',
  resultNounPlural,
  actions,
  style,
  testID,
}: ListToolbarProps) {
  const { theme } = useThemeContext()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const isControlled = filtersOpen != null
  const open = isControlled ? filtersOpen : uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onFiltersOpenChange?.(next)
  }

  const hasSearch = (searchValue ?? '').length > 0
  const showSearch = onSearchChange != null || renderSearch != null

  // One template: "{n} {noun}". Never "3 matches" here and "All jobs · 14"
  // there — that inconsistency is the whole reason this lives in one place.
  const countLabel =
    resultCount == null
      ? null
      : `${resultCount} ${resultCount === 1 ? resultNoun : (resultNounPlural ?? `${resultNoun}s`)}`

  const trigger = (
    <Pressable
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={
        activeFilterCount > 0
          ? `Filters and sort, ${activeFilterCount} active`
          : 'Filters and sort'
      }
      style={[
        styles.filterTrigger,
        {
          borderColor: open || activeFilterCount > 0
            ? colors.border[theme].active
            : colors.border[theme].default,
          backgroundColor: colors.bg[theme].default,
        },
      ]}
    >
      <Filter size={16} color={colors.text[theme].secondary} />
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: fontWeight.medium,
          color: colors.text[theme].primary,
        }}
      >
        Filters &amp; sort
      </Text>
      {activeFilterCount > 0 ? (
        <Text
          style={{
            fontSize: fontSize.md,
            fontVariant: ['tabular-nums'],
            color: colors.text[theme].attention,
          }}
        >
          · {activeFilterCount}
        </Text>
      ) : null}
    </Pressable>
  )

  return (
    <View style={[styles.root, style]} testID={testID}>
      <View style={styles.primaryRow}>
        {showSearch ? (
          <View style={styles.searchCell}>
            {renderSearch ? (
              renderSearch()
            ) : (
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChangeText={onSearchChange}
                iconStart={Search}
                iconEnd={hasSearch ? X : undefined}
                iconEndOnPress={hasSearch ? () => onSearchChange?.('') : undefined}
                iconEndAccessibilityLabel={hasSearch ? 'Clear search' : undefined}
              />
            )}
          </View>
        ) : null}

        {filterContent ? (
          <Popover
            placement="bottom"
            trigger="manual"
            open={open}
            onOpenChange={setOpen}
            offset={6}
            content={<PopoverContent>{filterContent}</PopoverContent>}
          >
            {trigger}
          </Popover>
        ) : null}

        <View style={styles.spacer} />

        {countLabel ? (
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.text[theme].tertiary,
              fontVariant: ['tabular-nums'],
            }}
            numberOfLines={1}
          >
            {countLabel}
          </Text>
        ) : null}

        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>

      {chips && chips.length > 0 ? (
        <View style={styles.chipStrip}>
          {chips.map((chip) => (
            <View
              key={chip.id}
              style={[
                styles.chip,
                {
                  borderColor: chip.active
                    ? colors.border[theme].attention
                    : colors.border[theme].default,
                  backgroundColor: chip.active
                    ? colors.bg[theme].attention
                    : colors.bg[theme].default,
                },
              ]}
            >
              <Pressable onPress={chip.onPress} accessibilityRole="button">
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    lineHeight: lineHeight.sm,
                    color: colors.text[theme].primary,
                  }}
                >
                  {chip.value ? `${chip.label}: ${chip.value}` : chip.label}
                </Text>
              </Pressable>
              {chip.onClear ? (
                <Pressable
                  onPress={chip.onClear}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${chip.label} filter`}
                  hitSlop={8}
                >
                  <X size={12} color={colors.text[theme].tertiary} />
                </Pressable>
              ) : null}
            </View>
          ))}

          {onClearAll ? (
            <Pressable
              onPress={onClearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.text[theme].emphasis,
                  textDecorationLine: 'underline',
                }}
              >
                Clear all
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: spacing[8],
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flexWrap: 'wrap',
  },
  searchCell: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 200,
    maxWidth: 380,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[12],
    borderWidth: 1,
    borderRadius: radius.md,
  },
  spacer: {
    flexGrow: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  chipStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[8],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderWidth: 1,
    borderRadius: radius.md,
  },
})
