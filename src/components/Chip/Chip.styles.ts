import type { ViewStyle, TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import { typography } from '../../tokens/typography'
import type { ResolvedThemeMode } from '../../tokens/colors'
import type { ChipSize } from './Chip.types'

export const staticStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.max, // Fully rounded (pill shape)
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
  disabled: boolean
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

  // Background and border based on state
  const borderDefault = isLight ? colors.border.light.default : colors.border.dark.default
  if (isLight) {
    if (selected) {
      // A selected chip is a tinted tag from the primary ramp — light step
      // fill, mid step border — not an inverted black pill.
      baseStyles.push({
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[300],
        borderWidth: 1,
      })
    } else if (isHovered && !disabled) {
      baseStyles.push({
        backgroundColor: colors.bg.light.subtle,
        borderColor: borderDefault,
        borderWidth: 1,
      })
    } else {
      baseStyles.push({
        backgroundColor: colors.bg.light.default,
        borderColor: borderDefault,
        borderWidth: 1,
      })
    }
  } else {
    if (selected) {
      baseStyles.push({
        backgroundColor: colors.primary[900],
        borderColor: colors.primary[700],
        borderWidth: 1,
      })
    } else if (isHovered && !disabled) {
      baseStyles.push({
        backgroundColor: colors.bg.dark.subtle,
        borderColor: borderDefault,
        borderWidth: 1,
      })
    } else {
      baseStyles.push({
        backgroundColor: colors.bg.dark.default,
        borderColor: borderDefault,
        borderWidth: 1,
      })
    }
  }

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
  disabled: boolean
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

  if (isLight) {
    baseTextStyles.push({
      color: selected ? colors.primary[700] : colors.text.light.primary,
    })
  } else {
    baseTextStyles.push({
      color: selected ? colors.primary[200] : colors.text.dark.primary,
    })
  }

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
