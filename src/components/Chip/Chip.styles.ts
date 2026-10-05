import type { ViewStyle, TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import { typography } from '../../tokens/typography'
import type { ResolvedThemeMode } from '../../tokens/colors'
import type { ChipSize, ChipTone } from './Chip.types'

export const staticStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Near-square, like the prototype's `.tag` — the pill went with #861's
    // quiet surfaces; a tag is a label, not a button.
    borderRadius: borderRadius.xxs,
    borderWidth: 1,
  },
  focusRing: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  text: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
    textAlign: 'center',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing[2],
    padding: spacing[2],
  },
  closeIconContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeIconLine: {
    position: 'absolute',
    width: 10,
    height: 1.5,
    borderRadius: 0.75,
  },
  closeIconLine1: {
    transform: [{ rotate: '45deg' }],
  },
  closeIconLine2: {
    transform: [{ rotate: '-45deg' }],
  },
})

const sizeConfigs = {
  sm: {
    height: 24,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    iconSize: 16,
    gap: spacing[4],
  },
  md: {
    height: 28,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    fontSize: typography.small.fontSize,
    lineHeight: typography.small.lineHeight,
    iconSize: 18,
    gap: spacing[4],
  },
  lg: {
    height: 32,
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[4],
    fontSize: typography.small.fontSize,
    lineHeight: typography.small.lineHeight,
    iconSize: 20,
    gap: spacing[4],
  },
}

export function getChipStyles(
  size: ChipSize,
  theme: ResolvedThemeMode,
  selected: boolean,
  isHovered: boolean,
  isFocused: boolean,
  disabled: boolean,
  tone: ChipTone = 'neutral'
): ViewStyle[] {
  const sizeConfig = sizeConfigs[size]
  const isLight = theme === 'light'
  const resolvedTheme = theme
  const baseStyles: ViewStyle[] = [
    staticStyles.chip,
    {
      height: sizeConfig.height,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      paddingVertical: sizeConfig.paddingVertical,
      gap: sizeConfig.gap,
    },
  ]

  // Fill and border: a selected chip is always the accent tag; an unselected
  // one takes its tone. Hover lifts a neutral chip to the subtle ground and
  // leaves tinted tags as they are.
  const borderDefault = colors.border[theme].default
  const toneStyle: ViewStyle = (() => {
    if (selected || tone === 'accent') {
      return isLight
        ? { backgroundColor: colors.primary[50], borderColor: colors.primary[300] }
        : { backgroundColor: colors.primary[900], borderColor: colors.primary[700] }
    }
    if (tone === 'attention') {
      return isLight
        ? { backgroundColor: colors.warning[100], borderColor: colors.warning[300] }
        : { backgroundColor: colors.warning[900], borderColor: colors.warning[700] }
    }
    if (tone === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderColor: isLight ? colors.primary[600] : colors.primary[300],
      }
    }
    const hovered = isHovered && !disabled
    return {
      backgroundColor: hovered ? colors.bg[theme].subtle : colors.bg[theme].default,
      borderColor: borderDefault,
    }
  })()
  baseStyles.push({ ...toneStyle, borderWidth: 1 })

  // Focus state
  if (isFocused && !disabled) {
    baseStyles.push({
      ...staticStyles.focusRing,
      shadowColor: colors.icon[resolvedTheme].muted,
    })
  }

  // Disabled state
  if (disabled) {
    baseStyles.push({
      opacity: 0.4,
    })
  }

  return baseStyles
}

export function getChipTextStyles(
  size: ChipSize,
  theme: ResolvedThemeMode,
  selected: boolean,
  disabled: boolean,
  tone: ChipTone = 'neutral'
): TextStyle[] {
  const sizeConfig = sizeConfigs[size]
  const isLight = theme === 'light'
  
  const baseTextStyles: TextStyle[] = [
    staticStyles.text,
    {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
    },
  ]

  const accentText = isLight ? colors.primary[700] : colors.primary[200]
  const color =
    selected || tone === 'accent' || tone === 'outline'
      ? accentText
      : tone === 'attention'
        ? isLight
          ? colors.warning[800]
          : colors.warning[300]
        : colors.text[theme].primary
  baseTextStyles.push({ color })

  if (disabled) {
    baseTextStyles.push({
      color: isLight ? colors.text.light.disabled : colors.text.dark.disabled,
    })
  }

  return baseTextStyles
}

export function getChipSizeConfig(size: ChipSize) {
  return sizeConfigs[size]
}
