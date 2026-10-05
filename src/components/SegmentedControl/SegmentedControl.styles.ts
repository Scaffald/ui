/**
 * SegmentedControl styles — the SCF prototype's `.seg`.
 *
 * A bordered box with a hairline between options. The selected option is an
 * inset accent ring and accent text; nothing slides and nothing fills. The
 * iOS thumb this replaces (a white pill gliding over a grey track) was the
 * one control in the account menu that did not look like the rest of it.
 */

import type { ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../tokens/colors'
import type { ResolvedThemeMode } from '../../tokens/colors'
import { borderRadius } from '../../tokens/borders'
import { fontSize, fontWeight, lineHeight, typography } from '../../tokens/typography'

export interface SegmentedControlStyleConfig {
  container: ViewStyle
  segment: ViewStyle
  /** Added to every segment after the first. */
  segmentDivider: ViewStyle
  segmentHovered: ViewStyle
  /** The inset ring drawn inside the selected segment. */
  ring: ViewStyle
  label: TextStyle
  selectedLabel: TextStyle
}

export function getSegmentedControlStyles(theme: ResolvedThemeMode): SegmentedControlStyleConfig {
  const accent = theme === 'dark' ? colors.primary[300] : colors.primary[600]
  const hairline = colors.border[theme].default

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
  }

  const segment: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    position: 'relative',
  }

  const segmentDivider: ViewStyle = {
    borderLeftWidth: 1,
    borderLeftColor: hairline,
  }

  const segmentHovered: ViewStyle = {
    backgroundColor: colors.bg[theme].subtle,
  }

  const ring: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: accent,
  }

  const label: TextStyle = {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    color: colors.text[theme].primary,
  }

  const selectedLabel: TextStyle = {
    ...label,
    fontWeight: fontWeight.semibold,
    color: accent,
  }

  return { container, segment, segmentDivider, segmentHovered, ring, label, selectedLabel }
}
