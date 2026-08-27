/**
 * Table component styles
 * All styles mapped from Figma Forsured Design System
 */

import type { ViewStyle } from 'react-native'
import { colors } from '../../tokens/colors'
import type { ResolvedThemeMode } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { borderWidth } from '../../tokens/borders'
import { borderRadius } from '../../tokens/borders'

/**
 * Table style configuration interface
 */
export interface TableStyleConfig {
  container: ViewStyle
  header: ViewStyle
  headerContent: ViewStyle
  headerActions: ViewStyle
  body: ViewStyle
  /** One row rendered as a card, below `stackBelow`. */
  stackedCard: ViewStyle
  /** A single label/value line inside that card. */
  stackedLine: ViewStyle
  /** The label half of a stacked line. */
  stackedLabel: ViewStyle
  /** The value half of a stacked line. */
  stackedValue: ViewStyle
  footer: ViewStyle
}

/**
 * Get table styles based on theme
 */
export function getTableStyles(theme: ResolvedThemeMode = 'light'): TableStyleConfig {
  return {
    container: {
      flex: 1,
      backgroundColor: colors.bg[theme].default,
      borderRadius: borderRadius.m,
      overflow: 'hidden',
    },
    header: {
      padding: spacing[32],
      borderBottomWidth: borderWidth.thin,
      borderBottomColor: colors.border[theme].default,
      backgroundColor: colors.bg[theme].default,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[20],
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[16],
    },
    body: {
      flex: 1,
    },
    stackedCard: {
      paddingHorizontal: spacing[16],
      paddingVertical: spacing[12],
      gap: spacing[4],
      borderBottomWidth: borderWidth.thin,
    },
    stackedLine: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: spacing[12],
    },
    // The label holds its width; the value is the half that gives.
    // Without this a long value (an email, a package name) pushed its own
    // label off the left edge and still overflowed the card by ~39px.
    stackedLabel: {
      flexShrink: 0,
    },
    // The value takes the right edge and is allowed to shrink; a long
    // organisation name should wrap rather than push its own label off-screen,
    // which is the overflow this whole mode exists to remove.
    stackedValue: {
      flexShrink: 1,
      // minWidth 0 is what actually lets a flex child wrap rather than
      // overflow — flexShrink alone does not, because the child's intrinsic
      // width is its floor until the minimum is lifted.
      minWidth: 0,
      alignItems: 'flex-end',
    },
    footer: {
      padding: spacing[32],
      borderTopWidth: borderWidth.thin,
      borderTopColor: colors.border[theme].default,
      backgroundColor: colors.bg[theme].default,
    },
  }
}
