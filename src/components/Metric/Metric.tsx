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
          <Text
            style={{
              fontSize: fontSize.sm,
              lineHeight: lineHeight.sm,
              color: toneColor(tone, theme),
            }}
          >
            {delta}
          </Text>
        ) : (
          delta
        )
      ) : null}
    </View>
  )
}

/** Where one cell of a MetricRow sits, and which hairlines it draws. */
export interface MetricCellPlacement {
  /** `row` = desktop flex column, `half` = phone pair, `full` = a whole phone row. */
  span: 'row' | 'half' | 'full'
  side: 'left' | 'right' | null
  ruleLeft: boolean
  ruleTop: boolean
}

/**
 * The phone grid, as a pure rule so it can be tested without a layout engine.
 * Desktop: one row, a rule before every cell but the first. Phone: pairs, a
 * rule inside each pair and above every pair but the first, an odd last cell
 * on its own full row. Very narrow: one per row.
 */
export function metricCellPlacement(
  index: number,
  count: number,
  width: number
): MetricCellPlacement {
  const phone = width > 0 && width < 640
  if (!phone) return { span: 'row', side: null, ruleLeft: index > 0, ruleTop: false }
  if (width < 300) return { span: 'full', side: null, ruleLeft: false, ruleTop: index > 0 }
  const lone = index === count - 1 && count % 2 === 1
  if (lone) return { span: 'full', side: null, ruleLeft: false, ruleTop: index > 0 }
  const right = index % 2 === 1
  return { span: 'half', side: right ? 'right' : 'left', ruleLeft: right, ruleTop: index >= 2 }
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

  // Vertical rules only survive while the row is genuinely one row. Once
  // cells wrap freely, a left border on the first cell of the second line
  // reads as a stray divider hanging off the edge — the orphan the
  // prototype's audit flagged on the admin stat row.
  //
  // So below the wrap threshold the layout is explicit rather than wrapped:
  // the prototype's phone layout is a two-column grid (`statCols:
  // s.mobile ? '1fr 1fr'`), with a vertical hairline inside each pair and a
  // horizontal one between pairs. An odd last figure takes the full row, so
  // there is never a half row with a rule beside nothing. Only on a very
  // narrow screen does it fall back to one figure per row (#1164 — this used
  // to be one per row at every phone width, and claimed to match the
  // prototype while doing so).
  const count = items.length

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
      {items.map((child, i) => {
        const at = metricCellPlacement(i, count, width)
        const cellStyle = [
          styles.cell,
          at.span === 'row' && { minWidth: minColumnWidth },
          at.span === 'half' && styles.cellHalf,
          at.span === 'full' && styles.cellFull,
          at.side === 'left' && styles.cellLeft,
          at.side === 'right' && styles.cellRight,
          at.ruleLeft && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: hairline },
          at.ruleTop && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: hairline },
        ]
        return (
          <View
            // A static, ordered list of stats with no id to key on and no
            // reordering — the index is a stable identity here.
            key={i}
            style={cellStyle}
          >
            {child}
          </View>
        )
      })}
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
  // Phone cells: half the row each, or the whole row for an odd last figure.
  // The left cell sits on the gutter like a full-width one; padding goes only
  // inside the pair, keeping each figure off the rule between them.
  cellHalf: {
    flexBasis: '50%',
    flexGrow: 0,
    paddingHorizontal: 0,
    paddingVertical: spacing[12],
  },
  cellLeft: { paddingRight: spacing[12] },
  cellRight: { paddingLeft: spacing[12] },
  cellFull: {
    flexBasis: '100%',
    paddingHorizontal: 0,
    paddingVertical: spacing[12],
  },
})
