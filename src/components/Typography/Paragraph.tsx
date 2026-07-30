/**
 * Paragraph component
 *
 * Body text component with size and weight variants.
 * Body text with size and weight variants.
 */

import { useMemo } from 'react'
import { Text, type TextStyle } from 'react-native'
import type { ParagraphProps, TextSize, TextWeight } from './Typography.types'
import {
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight as fontWeightTokens,
} from '../../tokens/typography'
import { useThemeContext } from '../../theme'
import { getFontFamily, resolveTypographyColor } from './Typography.styles'

/**
 * Get typography values for paragraph size
 */
const getParagraphStyle = (
  size: TextSize = 'md',
  weight: TextWeight = 'regular',
  serif?: boolean
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

  return {
    fontFamily: getFontFamily(weight, serif),
    fontSize: sizes[size],
    fontWeight: fontWeightTokens[weight],
    lineHeight: lineHeights[size],
    letterSpacing: letterSpacings[size],
  }
}

/**
 * Paragraph component
 *
 * @example
 * // Default paragraph (md size, regular weight)
 * <Paragraph>This is body text content.</Paragraph>
 *
 * // Large paragraph with medium weight
 * <Paragraph size="lg" weight="medium">Important information.</Paragraph>
 *
 * // Small muted paragraph
 * <Paragraph size="sm" color="secondary">Helper text here.</Paragraph>
 */
export function Paragraph({
  size = 'md',
  weight = 'regular',
  serif,
  color,
  align,
  selectable = true,
  style,
  children,
  ...textProps
}: ParagraphProps) {
  const { theme } = useThemeContext()
  const computedStyle = useMemo<TextStyle>(() => {
    const baseStyle = getParagraphStyle(size, weight, serif)

    return {
      ...baseStyle,
      color: resolveTypographyColor(color, theme),
      textAlign: align,
    }
  }, [size, weight, serif, color, align, theme])

  return (
    <Text style={[computedStyle, style]} selectable={selectable} {...textProps}>
      {children}
    </Text>
  )
}
