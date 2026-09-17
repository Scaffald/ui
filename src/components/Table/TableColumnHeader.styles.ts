/**
 * TableColumnHeader component styles
 * All styles mapped from Figma Forsured Design System
 */

import type { ViewStyle, TextStyle, DimensionValue } from 'react-native'
import { colors } from '../../tokens/colors'
import type { ResolvedThemeMode } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { borderWidth } from '../../tokens/borders'
import { typographyVariants } from '../../tokens/typography'
import type { TableColumnHeaderState, TableColumnHeaderAlign } from './TableColumnHeader.types'

/**
 * Column header dimensions from Figma
 * Height: 40px
 * Padding: 20px horizontal, 10px vertical
 */
const HEADER_HEIGHT = 40
const HEADER_PADDING_H = spacing[20]
const HEADER_PADDING_V = spacing[10]

/**
 * Header style configuration interface
 */
export interface TableColumnHeaderStyleConfig {
  container: ViewStyle
  text: TextStyle
  iconColor?: string
}

/**
 * Get table column header styles based on state, alignment, and theme
 */
export function getTableColumnHeaderStyles(
  state: TableColumnHeaderState = 'default',
  align: TableColumnHeaderAlign = 'left',
  theme: ResolvedThemeMode = 'light',
  width?: number | string
): TableColumnHeaderStyleConfig {
  // Base container styles
  const baseContainer: ViewStyle = {
    height: HEADER_HEIGHT,
    paddingHorizontal: HEADER_PADDING_H,
    paddingVertical: HEADER_PADDING_V,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border[theme].default,
    backgroundColor: colors.bg[theme].subtle || colors.gray[50],
    gap: spacing[4],
    ...(width && { width: resolveColumnWidth(width) }),
  }

  // Base text styles
  const baseText: TextStyle = {
    fontFamily: typographyVariants.paragraphSMedium.fontFamily,
    fontSize: typographyVariants.paragraphSMedium.fontSize,
    fontWeight: typographyVariants.paragraphSMedium.fontWeight,
    lineHeight: typographyVariants.paragraphSMedium.lineHeight,
    color: colors.text[theme].secondary,
    textAlign: align,
  }

  // Empty state - return container with empty text style
  if (state === 'empty') {
    return {
      container: {
        ...baseContainer,
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
      text: baseText,
    }
  }

  return {
    container: baseContainer,
    text: baseText,
    iconColor: colors.text[theme].secondary,
  }
}

/**
 * A column width of `'20%'` is a percentage, not 20px. `parseFloat` threw
 * the unit away, so every percentage column rendered a 20px-wide cell — on
 * web as well as native (#768). Percentages pass through (React Native
 * accepts them); other strings are treated as pixel numbers as before.
 */
export function resolveColumnWidth(width: number | string): DimensionValue | undefined {
  if (typeof width !== 'string') return width
  if (width.trim().endsWith('%')) return width.trim() as `${number}%`
  return Number.parseFloat(width) || undefined
}
