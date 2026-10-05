/**
 * BottomToolbar styles
 * iOS 26 glassmorphic bottom toolbar
 */

import type { ViewStyle } from 'react-native'
import { quietStrip } from '../../tokens/surfaces'
import type { ResolvedThemeMode } from '../../tokens/colors'

export interface BottomToolbarStyleConfig {
  /** Outer wrapper with safe-area padding */
  wrapper: ViewStyle
  /** Glass pill container */
  pill: ViewStyle
  /** Content row inside pill */
  contentRow: ViewStyle
  /** Search variant: full-width row */
  searchRow: ViewStyle
  /** Page control variant: row with leading + dots + trailing */
  pageControlRow: ViewStyle
  /** Button group in page control layout */
  pageControlButtons: ViewStyle
}

export function getBottomToolbarStyles(
  theme: ResolvedThemeMode,
): BottomToolbarStyleConfig {
  const wrapper: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
  }

  // The prototype pins its toolbars to the edge as a strip — full width, a
  // hairline on top, opaque — not a floating glass pill. The key is still
  // `pill` because the components reach for it by that name.
  const pill: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...quietStrip(theme, 'bottom'),
  }

  const contentRow: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  }

  const searchRow: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
    gap: 4,
  }

  const pageControlRow: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  }

  const pageControlButtons: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  return {
    wrapper,
    pill,
    contentRow,
    searchRow,
    pageControlRow,
    pageControlButtons,
  }
}
