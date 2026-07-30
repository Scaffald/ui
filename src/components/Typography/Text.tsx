/**
 * Text component
 *
 * Flexible text component with size and weight variants.
 * Flexible text with size and weight variants.
 */

import { useMemo } from 'react'
import { Text as RNText, type TextStyle } from 'react-native'
import type { TextProps, TextSize, TextWeight } from './Typography.types'
import {
  fontSize,
  lineHeight,
  letterSpacing,
  fontFamily,
  fontWeight as fontWeightTokens,
} from '../../tokens/typography'
import { useThemeContext } from '../../theme'
import { getFontFamily, resolveTypographyColor } from './Typography.styles'

/**
 * Get typography values for text size
 */
const getTextStyle = (
  size: TextSize = 'md',
  weight: TextWeight = 'regular',
  serif?: boolean,
  mono?: boolean
): TextStyle => {
  const sizes: Record<TextSize, number> = {
    xxs: fontSize.xxs,
    xs: fontSize.xs,
    sm: fontSize.sm,
    md: fontSize.md,
    lg: fontSize.lg,
    xl: fontSize.xl,
    '2xl': fontSize['2xl'],
  }

  const lineHeights: Record<TextSize, number> = {
    xxs: lineHeight.xxs,
    xs: lineHeight.xs,
    sm: lineHeight.sm,
    md: lineHeight.md,
    lg: lineHeight.lg,
    xl: lineHeight.xl,
    '2xl': lineHeight.h3, // Title 2 line height (28)
  }

  const letterSpacings: Record<TextSize, number> = {
    xxs: letterSpacing.caption2,
    xs: letterSpacing.caption1,
    sm: letterSpacing.footnote,
    md: letterSpacing.callout,
    lg: letterSpacing.body,
    xl: letterSpacing.title3,
    '2xl': letterSpacing.title2,
  }

  // For mono, fall back to the token directly (not loaded as a custom font yet)
  const fontFamilyValue = mono ? fontFamily.mono : getFontFamily(weight, serif)

  return {
    fontFamily: fontFamilyValue,
    fontSize: sizes[size],
    fontWeight: fontWeightTokens[weight],
    lineHeight: lineHeights[size],
    letterSpacing: letterSpacings[size],
  }
}

/**
 * Text component (SizableText replacement)
 *
 * @example
 * // Default text (md size, regular weight)
 * <Text>Regular body text</Text>
 *
 * // Small secondary text
 * <Text size="sm" color="secondary">Helper text</Text>
 *
 * // Large bold text
 * <Text size="lg" weight="bold">Important text</Text>
 *
 * // Monospace code text
 * <Text mono size="sm">const x = 42</Text>
 */
export function Text({
  size = 'md',
  weight = 'regular',
  serif,
  mono,
  color,
  align,
  selectable = false,
  style,
  children,
  ...textProps
}: TextProps) {
  const { theme } = useThemeContext()

  const computedStyle = useMemo<TextStyle>(() => {
    const baseStyle = getTextStyle(size, weight, serif, mono)

    return {
      ...baseStyle,
      color: resolveTypographyColor(color, theme),
      textAlign: align,
    }
  }, [size, weight, serif, mono, color, align, theme])

  return (
    <RNText style={[computedStyle, style]} selectable={selectable} {...textProps}>
      {children}
    </RNText>
  )
}
