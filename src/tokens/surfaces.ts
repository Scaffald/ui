/**
 * The quiet surfaces — the SCF prototype's two ways of floating something.
 *
 * A *panel* floats over content: a popover, an action sheet, a menu. Hairline
 * border, the medium shadow, near-square corners, the page's own ground
 * colour — never blur. A *strip* is pinned to an edge: a toolbar, a tab bar.
 * Full width, one hairline on the edge it faces the content with, no radius,
 * no shadow. Both are opaque, which is what the glass layers were working
 * three effects to approximate while staying legible over scrolled content.
 */

import type { ViewStyle } from 'react-native'
import { Platform } from 'react-native'
import { borderRadius } from './borders'
import { colors, type ResolvedThemeMode } from './colors'
import { boxShadows, shadows } from './shadows'

/** A floating panel: popover, menu, sheet body. */
export function quietPanel(theme: ResolvedThemeMode): ViewStyle {
  const shadow = shadows.m
  return {
    backgroundColor: colors.bg[theme].default,
    borderWidth: 1,
    borderColor: colors.border[theme].default,
    borderRadius: borderRadius.l,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: boxShadows.m } as ViewStyle)
      : {
          shadowColor: shadow.shadowColor,
          shadowOffset: shadow.shadowOffset,
          shadowOpacity: shadow.shadowOpacity,
          shadowRadius: shadow.shadowRadius,
          elevation: shadow.elevation,
        }),
  }
}

/** An edge-pinned strip: a bar at the top or bottom of the screen. */
export function quietStrip(theme: ResolvedThemeMode, edge: 'top' | 'bottom'): ViewStyle {
  const hairline = colors.border[theme].subtle
  return {
    backgroundColor: colors.bg[theme].default,
    ...(edge === 'bottom'
      ? { borderTopWidth: 1, borderTopColor: hairline }
      : { borderBottomWidth: 1, borderBottomColor: hairline }),
  }
}
