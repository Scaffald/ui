/**
 * Label component
 *
 * Form field label with accessibility support.
 * Provides proper semantics for form fields.
 */

import { useMemo } from 'react'
import { Text, Platform, type TextStyle } from 'react-native'
import type { LabelProps, TextWeight } from './Typography.types'
import {
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight as fontWeightTokens,
} from '../../tokens/typography'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'
import { getFontFamily, resolveTypographyColor } from './Typography.styles'

/**
 * Get typography values for label size
 */
const getLabelStyle = (
  size: 'sm' | 'md' | 'lg' = 'md',
  weight: TextWeight = 'medium'
): TextStyle => {
  const sizes = {
    sm: fontSize.xs,
    md: fontSize.sm,
    lg: fontSize.md,
  }

  const lineHeights = {
    sm: lineHeight.xs,
    md: lineHeight.sm,
    lg: lineHeight.md,
  }

  return {
    fontFamily: getFontFamily(weight),
    fontSize: sizes[size],
    fontWeight: fontWeightTokens[weight],
    lineHeight: lineHeights[size],
    letterSpacing: letterSpacing.normal,
  }
}

/**
 * Label component
 *
 * @example
 * // Basic form label
 * <Label htmlFor="email">Email Address</Label>
 *
 * // Required field label
 * <Label htmlFor="name" required>Full Name</Label>
 *
 * // Disabled label
 * <Label htmlFor="disabled-field" disabled>Unavailable Field</Label>
 */
export function Label({
  htmlFor,
  size = 'md',
  weight = 'medium',
  required,
  disabled,
  color,
  align,
  style,
  children,
  ...textProps
}: LabelProps) {
  const { theme } = useThemeContext()
  const computedStyle = useMemo<TextStyle>(() => {
    const baseStyle = getLabelStyle(size, weight)

    return {
      ...baseStyle,
      color: resolveTypographyColor(disabled ? 'disabled' : color, theme),
      textAlign: align,
    }
  }, [size, weight, color, disabled, align, theme])

  // On web, we add nativeID to associate with form elements
  const webProps =
    Platform.OS === 'web'
      ? {
          nativeID: htmlFor,
          // Add accessibilityRole for screen readers
          accessibilityRole: 'text' as const,
        }
      : {}

  return (
    <Text style={[computedStyle, style]} {...webProps} {...textProps}>
      {children}
      {required && (
        <Text style={{ color: colors.error[500] }}> *</Text>
      )}
    </Text>
  )
}
