/**
 * BottomBar styles — glass pill container with fixed positioning
 */

import type { ViewStyle } from 'react-native'
import { Platform } from 'react-native'
import { quietStrip } from '../../tokens/surfaces'
import type { ResolvedThemeMode } from '../../tokens/colors'
import type { BottomBarLevel } from './BottomBar.types'

const Z_INDEX: Record<BottomBarLevel, number> = {
  global: 9999,
  page: 10000,
}

export interface BottomBarStyleConfig {
  wrapper: ViewStyle
  pill: ViewStyle
  contentRow: ViewStyle
}

export function getBottomBarStyles(
  theme: ResolvedThemeMode,
  level: BottomBarLevel,
  bottomInset: number,
): BottomBarStyleConfig {
  const wrapper: ViewStyle = {
    position: Platform.OS === 'web' ? ('fixed' as never) : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: Z_INDEX[level],
    alignItems: 'stretch',
    paddingBottom: bottomInset,
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

  return { wrapper, pill: pill as ViewStyle, contentRow }
}
