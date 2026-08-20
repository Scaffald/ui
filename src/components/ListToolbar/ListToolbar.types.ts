import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

export interface ListToolbarFilterChip {
  id: string
  label: string
  /** Selected value, shown as "Label: value". */
  value?: string
  onPress: () => void
  active?: boolean
  /** Renders an × that clears just this chip. */
  onClear?: () => void
}

export interface ListToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** Replace the built-in search field entirely. */
  renderSearch?: () => ReactNode

  /**
   * Contents of the "Filters & sort" flyout. One flyout per screen — the
   * prototype's audit found two competing idioms (a flyout on some screens,
   * loose inline chips on others) and standardised on this.
   */
  filterContent?: ReactNode
  /** Count shown on the flyout trigger, e.g. "Filters & sort · 5". */
  activeFilterCount?: number
  filtersOpen?: boolean
  onFiltersOpenChange?: (open: boolean) => void

  /**
   * The active-filter chip strip. Reserved for filters the user has already
   * applied, so they are removable without reopening the flyout — NOT a second
   * place to set them.
   */
  chips?: ListToolbarFilterChip[]
  onClearAll?: () => void

  /**
   * Result count. Rendered as "{n} {noun}" — one template everywhere, because
   * the audit found this slot phrased four different ways.
   */
  resultCount?: number
  /** Singular noun; pluralised with a trailing "s" unless `resultNounPlural`. */
  resultNoun?: string
  resultNounPlural?: string

  /** Trailing controls — view switches, a primary action. */
  actions?: ReactNode

  style?: ViewStyle
  testID?: string
}
