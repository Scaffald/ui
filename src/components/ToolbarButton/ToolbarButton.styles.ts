/**
 * ToolbarButton styles
 * iOS 26 toolbar button styling
 */

import type { ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../tokens/colors'
import { borderRadius } from '../../tokens/borders'
import { fontSize, lineHeight } from '../../tokens/typography'
import type { ResolvedThemeMode } from '../../tokens/colors'

export interface ToolbarButtonStyleConfig {
  /** Icon button touch target */
  iconButton: ViewStyle
  /** Text button container */
  textButton: ViewStyle
  /** Filled button container */
  filledButton: ViewStyle
  /** Back button container */
  backButton: ViewStyle
  /** Text label style */
  textLabel: TextStyle
  /** Filled button label */
  filledLabel: TextStyle
  /** Back button label */
  backLabel: TextStyle
  /** Back chevron text */
  backChevron: TextStyle
  /** Default tint color */
  tintColor: string
  /** Default icon color */
  iconColor: string
}

export function getToolbarButtonStyles(
  theme: ResolvedThemeMode,
): ToolbarButtonStyleConfig {
  // Teal, the interactive accent (Scaffald/SaaS#983) — not iOS system blue.
  const tintColor = theme === 'dark' ? colors.primary[300] : colors.primary[600]
  const iconColor = colors.icon[theme].default

  const iconButton: ViewStyle = {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xs,
  }

  const textButton: ViewStyle = {
    height: 44,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xs,
  }

  const filledButton: ViewStyle = {
    height: 30,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xs,
    backgroundColor: tintColor,
  }

  const backButton: ViewStyle = {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingRight: 8,
  }

  const textLabel: TextStyle = {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: '500',
    color: tintColor,
  }

  const filledLabel: TextStyle = {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: '600',
    color: colors.white,
  }

  const backLabel: TextStyle = {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: '500',
    color: tintColor,
  }

  const backChevron: TextStyle = {
    fontSize: 22,
    fontWeight: '300',
    color: tintColor,
    marginTop: -1,
  }

  return {
    iconButton,
    textButton,
    filledButton,
    backButton,
    textLabel,
    filledLabel,
    backLabel,
    backChevron,
    tintColor,
    iconColor,
  }
}
