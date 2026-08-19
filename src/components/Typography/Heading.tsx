/**
 * Heading component
 *
 * Semantic heading component (H1-H6) with design system typography tokens.
 * Semantic headings H1–H6 with design system tokens.
 */

import { useMemo } from 'react'
import { Text, Platform, type TextStyle, type AccessibilityRole } from 'react-native'
import type {
  HeadingProps,
  HeadingLevel,
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  H5Props,
  H6Props,
  TextWeight,
} from './Typography.types'
import {
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight as fontWeightTokens,
} from '../../tokens/typography'
import { useThemeContext } from '../../theme'
import { getFontFamily, resolveTypographyColor } from './Typography.styles'

/**
 * Get typography values for a heading level
 */
const getHeadingStyle = (
  level: HeadingLevel,
  weight: TextWeight = 'bold',
  serif?: boolean
): TextStyle => {
  const sizes: Record<HeadingLevel, number> = {
    1: fontSize.h1,
    2: fontSize.h2,
    3: fontSize.h3,
    4: fontSize.h4,
    5: fontSize.h5,
    6: fontSize.h6,
  }

  const lineHeights: Record<HeadingLevel, number> = {
    1: lineHeight.h1,
    2: lineHeight.h2,
    3: lineHeight.h3,
    4: lineHeight.h4,
    5: lineHeight.h5,
    6: lineHeight.h6,
  }

  // Per-heading letter spacing from Apple iOS HIG
  const letterSpacings: Record<HeadingLevel, number> = {
    1: letterSpacing.largeTitle, // 0.4
    2: letterSpacing.title1, // 0.38
    3: letterSpacing.title2, // -0.26
    4: letterSpacing.title3, // -0.45
    5: letterSpacing.headline, // -0.43
    6: letterSpacing.subheadline, // -0.23
  }

  // Default weights per level (can be overridden)
  const defaultWeights: Record<HeadingLevel, TextWeight> = {
    1: 'bold',
    2: 'bold',
    3: 'semibold',
    4: 'semibold',
    5: 'semibold',
    6: 'medium',
  }

  const resolvedWeight = weight || defaultWeights[level]

  return {
    // `heading: true` — resolves to the display serif on web, Roboto on native.
    fontFamily: getFontFamily(resolvedWeight, serif, true),
    fontSize: sizes[level],
    fontWeight: fontWeightTokens[resolvedWeight],
    lineHeight: lineHeights[level],
    letterSpacing: letterSpacings[level],
  }
}

/**
 * Heading component
 *
 * @example
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2} weight="medium">Section</Heading>
 */
export function Heading({
  level,
  weight,
  serif,
  color,
  align,
  selectable = false,
  style,
  children,
  accessibilityRole,
  ...textProps
}: HeadingProps) {
  const { theme } = useThemeContext()
  const computedStyle = useMemo<TextStyle>(() => {
    const baseStyle = getHeadingStyle(level, weight, serif)

    return {
      ...baseStyle,
      color: resolveTypographyColor(color, theme),
      textAlign: align,
    }
  }, [level, weight, serif, color, align, theme])

  // On web, we use accessibilityRole to convey heading semantics
  // React Native Web will render this appropriately
  const role: AccessibilityRole = accessibilityRole || 'header'

  return (
    <Text
      style={[computedStyle, style]}
      selectable={selectable}
      accessibilityRole={role}
      // Web-specific: aria-level for heading hierarchy
      {...(Platform.OS === 'web' && { 'aria-level': level })}
      {...textProps}
    >
      {children}
    </Text>
  )
}

/**
 * H1 component - largest heading
 */
export function H1(props: H1Props) {
  return <Heading {...props} level={1} />
}

/**
 * H2 component
 */
export function H2(props: H2Props) {
  return <Heading {...props} level={2} />
}

/**
 * H3 component
 */
export function H3(props: H3Props) {
  return <Heading {...props} level={3} />
}

/**
 * H4 component
 */
export function H4(props: H4Props) {
  return <Heading {...props} level={4} />
}

/**
 * H5 component
 */
export function H5(props: H5Props) {
  return <Heading {...props} level={5} />
}

/**
 * H6 component - smallest heading
 */
export function H6(props: H6Props) {
  return <Heading {...props} level={6} />
}
