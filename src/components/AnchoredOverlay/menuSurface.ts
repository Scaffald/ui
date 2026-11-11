/**
 * The shared menu surface: the layer an autocomplete or select menu draws on.
 *
 * In light mode the surface is white like a card, so it is set apart by a
 * visible border and a lifted shadow rather than by fill. In dark mode the card
 * is `bg.dark.muted` and the menu sits on `bg.dark.default`, so fill and border
 * both separate it.
 */

import { Platform, type ViewStyle } from 'react-native'
import { colors, type ResolvedThemeMode } from '../../tokens/colors'
import { borderRadius, borderWidth } from '../../tokens/borders'
import { boxShadows, shadows } from '../../tokens/shadows'
import { spacing } from '../../tokens/spacing'

export function getMenuSurfaceStyle(theme: ResolvedThemeMode): ViewStyle {
  return {
    backgroundColor: colors.bg[theme].default,
    borderWidth: borderWidth.thin,
    borderColor: colors.border[theme].default,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    // On web use boxShadow only, as Card does, to avoid the shadow* deprecation warning.
    ...(Platform.OS === 'web'
      ? ({ boxShadow: boxShadows.l } as ViewStyle)
      : (shadows.l as ViewStyle)),
  }
}

export interface MenuItemState {
  /** Keyboard-highlighted (aria-activedescendant) or hovered. */
  active?: boolean
  /** The option is the current value. */
  selected?: boolean
  pressed?: boolean
  disabled?: boolean
}

/** Row style for a menu option, so every menu highlights the same way. */
export function getMenuItemStyle(
  theme: ResolvedThemeMode,
  { active, selected, pressed, disabled }: MenuItemState = {},
): ViewStyle {
  return {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[10],
    backgroundColor: selected
      ? colors.bg[theme].selected
      : active || pressed
        ? colors.bg[theme].muted
        : 'transparent',
    opacity: disabled ? 0.5 : 1,
    ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'default' : 'pointer' } as ViewStyle) : null),
  }
}
