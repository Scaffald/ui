/**
 * MetricBlock / MetricRow — one way to present a figure, everywhere.
 *
 * Label above, figure below, delta beneath. The prototype's audit found the
 * same number reading as a different kind of thing depending on the screen —
 * "Scaffald score" above the figure on Home, "Score" beneath it in search
 * results, under it again in Admin stat cells. Our dashboard widgets and ATS
 * metrics drifted the same way. This is the one block.
 *
 * MetricRow lays blocks out with hairline dividers and wraps whole columns
 * rather than orphaning the last one.
 *
 * @example
 * ```tsx
 * <MetricRow bordered>
 *   <MetricBlock label="Search appearances" value="342" delta="▲ 8%" tone="positive" />
 *   <MetricBlock label="Over SLA" value="5" emphasis delta="2 due today" tone="attention" />
 * </MetricRow>
 * ```
 */

import { Children, isValidElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { useThemeContext } from '../../theme'
import { useResponsive } from '../../hooks/useResponsive'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'
import { Text } from '../Typography/Text'
import type { MetricBlockProps, MetricRowProps, MetricTone } from './Metric.types'

function toneColor(tone: MetricTone, theme: 'light' | 'dark') {
  if (tone === 'positive') return colors.fg[theme].success
  if (tone === 'attention') return colors.text[theme].attention
  return colors.text[theme].tertiary
}

export function MetricBlock({
  label,
  value,
  delta,
  tone = 'neutral',
  emphasis = false,
  style,
  testID,
}: MetricBlockProps) {
  const { theme } = useThemeContext()

  return (
    <View style={[styles.block, style]} testID={testID}>
      <Text
        style={{
          fontSize: fontSize.h6,
          lineHeight: lineHeight.h6,
          fontWeight: fontWeight.medium,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: colors.text[theme].tertiary,
        }}
        numberOfLines={2}
      >
        {label}
      </Text>

      {typeof value === 'string' || typeof value === 'number' ? (
        <Text
          style={{
            fontSize: fontSize.h2,
            lineHeight: lineHeight.h2,
            fontWeight: fontWeight.semibold,
            fontVariant: ['tabular-nums'],
            color: emphasis ? colors.text[theme].attention : colors.text[theme].primary,
          }}
        >
          {value}
        </Text>
      ) : (
        value
      )}

      {delta != null ? (
        typeof delta === 'string' || typeof delta === 'number' ? (
          <Text style={{ fontSize: fontSize.sm, lineHeight: lineHeight.sm, color: toneColor(tone, theme) }}>
            {delta}
          </Text>
        ) : (
          delta
        )
      ) : null}
    </View>
  )
}

export function MetricRow({
  children,
  minColumnWidth = 140,
  bordered = false,
  style,
  testID,
}: MetricRowProps) {
  const { theme } = useThemeContext()
  const { width } = useResponsive()
  const hairline = colors.border[theme].default
  const items = Children.toArray(children).filter(isValidElement)

  // Vertical rules only survive while the row is genuinely one row. Once the
  // cells wrap, a left border on the first cell of the second line reads as a
  // stray divider hanging off the edge — the exact orphan the prototype's
  // audit flagged on the admin stat row. Below the wrap threshold the cells
  // stack and separate horizontally instead, which is what the prototype's
  // own mobile layout does.
  const stacked = width > 0 && width < 640

  return (
    <View
      testID={testID}
      style={[
        styles.row,
        bordered && {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: hairline,
        },
        style,
      ]}
    >
      {items.map((child, i) => (
        <View
          // A static, ordered list of stats with no id to key on and no
          // reordering — the index is a stable identity here.
          key={i}
          style={[
            styles.cell,
            stacked ? styles.cellStacked : { minWidth: minColumnWidth },
            i > 0 &&
              (stacked
                ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: hairline }
                : { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: hairline }),
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    gap: spacing[4],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  cell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[20],
  },
  cellStacked: {
    flexBasis: '100%',
    paddingHorizontal: 0,
    paddingVertical: spacing[12],
  },
})
