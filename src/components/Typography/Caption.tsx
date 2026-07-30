/**
 * Caption component
 *
 * Small helper/caption text for labels, timestamps, etc.
 */

import { useMemo } from 'react'
import { Text, type TextStyle } from 'react-native'
import type { CaptionProps, } from './Typography.types'
import {
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight as fontWeightTokens,
} from '../../tokens/typography'
import { useThemeContext } from '../../theme'
import { getFontFamily, resolveTypographyColor } from './Typography.styles'

/**
 * Caption component
 *
 * @example
 * // Default caption (secondary color)
 * <Caption>Last updated 2 hours ago</Caption>
 *
 * // Primary color caption
 * <Caption color="primary">Important note</Caption>
 *
 * // Bold caption
 * <Caption weight="bold">Section label</Caption>
 */
export function Caption({
  weight = 'regular',
  color,
  align,
  selectable = false,
  style,
  children,
  ...textProps
}: CaptionProps) {
  const { theme } = useThemeContext()
  const computedStyle = useMemo<TextStyle>(() => {
    return {
      fontFamily: getFontFamily(weight),
      fontSize: fontSize.xs, // 12px
      fontWeight: fontWeightTokens[weight],
      lineHeight: lineHeight.xs, // 16px
      letterSpacing: letterSpacing.normal,
      color: resolveTypographyColor(color, theme, 'secondary'),
      textAlign: align,
    }
  }, [weight, color, align, theme])

  return (
    <Text style={[computedStyle, style]} selectable={selectable} {...textProps}>
      {children}
    </Text>
  )
}
