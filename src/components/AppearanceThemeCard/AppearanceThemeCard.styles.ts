/**
 * AppearanceThemeCard styles
 */

import type { ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../tokens/colors'
import { borderRadius } from '../../tokens/borders'
import { typography } from '../../tokens/typography'
import type { AppearanceThemeCardStyleConfig, AppearanceThemeCardVariant } from './AppearanceThemeCard.types'
import type { ResolvedThemeMode } from '../../tokens/colors'

export function getAppearanceThemeCardStyles(
  theme: ResolvedThemeMode,
  _variant: AppearanceThemeCardVariant,
  selected: boolean
): AppearanceThemeCardStyleConfig {
  const isLight = theme === 'light'

  // Height follows the content (preview + padded label) and the preview fills
  // the card's width, so a caller can narrow the card — three across on a
  // phone — without the preview overflowing it (Scaffald/SaaS#1090).
  const container: ViewStyle = {
    width: 160,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    backgroundColor: isLight ? colors.bg.light.default : colors.bg.dark.default,
    borderWidth: selected ? 2 : 1,
    borderColor: selected
      ? isLight
        ? colors.gray[900]
        : colors.gray[100]
      : isLight
        ? colors.border.light.default
        : colors.border.dark.default,
  }

  const preview: ViewStyle = {
    width: '100%',
    height: 100,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
  }

  const previewLight: ViewStyle = {
    backgroundColor: colors.gray[50],
  }

  const previewDark: ViewStyle = {
    backgroundColor: colors.gray[900],
  }

  const previewSystem: ViewStyle = {
    // System shows split between light and dark
    flexDirection: 'row',
  }

  const label: TextStyle = {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: 14,
    fontWeight: typography.bodyMedium.fontWeight,
    lineHeight: 20,
    // The label sat flush against the card's left and bottom edges (#1090).
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: isLight ? colors.text.light.primary : colors.text.dark.primary,
  }

  return {
    container,
    preview,
    previewLight,
    previewDark,
    previewSystem,
    label,
  }
}
