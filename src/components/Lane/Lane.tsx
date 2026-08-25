/**
 * Lane / LaneGroup — stage-grouped rows.
 *
 * The alternative to a kanban board when the board does not fit. Seven stages
 * already overflow a laptop; the recruiter flow has eleven and NationSearch
 * twelve. Rather than scrolling sideways through columns, stages stack as
 * full-width groups and each item is a row — so every row can carry the
 * columns a card cannot (score, source, assignee, days in stage) and the
 * whole thing reads top to bottom on any width.
 *
 * This sits BESIDE the existing Kanban rather than replacing it. Lanes is the
 * default view in the prototype; Board stays available.
 *
 * Rows lead with days-in-stage, not days-since-applied — the staleness signal
 * is the one number that says "act on this", and the current board does not
 * show it at all.
 *
 * @example
 * ```tsx
 * <LaneGroup title="New" count={7} hint="untouched — the first-response clock is running">
 *   <Lane age="8d" overdue title="Alice Chen" subtitle="Site Electrical Lead"
 *         columns={[<Text>score 88</Text>, <Text>Scaffald</Text>]}
 *         note="Overdue — screening decision" />
 * </LaneGroup>
 * ```
 */

import { Fragment, isValidElement } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useThemeContext } from '../../theme'
import { useResponsive } from '../../hooks/useResponsive'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'
import { Text } from '../Typography/Text'
import type { LaneColumn, LaneGroupProps, LaneProps } from './Lane.types'

/** Distinguishes a labelled cell from a bare ReactNode. */
function isLaneColumn(col: unknown): col is LaneColumn {
  return (
    typeof col === 'object' &&
    col !== null &&
    !isValidElement(col) &&
    typeof (col as LaneColumn).label === 'string'
  )
}

export function LaneGroup({
  title,
  count,
  hint,
  tone = 'neutral',
  action,
  children,
  emptyState,
  style,
  testID,
}: LaneGroupProps) {
  const { theme } = useThemeContext()

  const dot =
    tone === 'attention'
      ? colors.text[theme].attention
      : tone === 'active'
        ? colors.fg[theme].active
        : colors.text[theme].tertiary

  const isEmpty = count === 0

  return (
    // An empty stage is a single quiet line, not a full-height section. Seven
    // stages at the populated spacing turned an empty pipeline into ~2,200px
    // of scroll on a phone before the user reached anything at all — and an
    // empty board is exactly when they most need to see the whole shape.
    <View style={[styles.group, isEmpty && styles.groupEmpty, style]} testID={testID}>
      <View style={styles.groupHeader}>
        <View style={styles.groupHeaderLeft}>
          <View style={[styles.dot, { backgroundColor: dot }]} />
          <Text
            style={{
              fontSize: fontSize.lg,
              lineHeight: lineHeight.lg,
              fontWeight: fontWeight.semibold,
              color: colors.text[theme].primary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.text[theme].tertiary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {count}
          </Text>
          {hint ? (
            <Text
              style={{ fontSize: fontSize.sm, color: colors.text[theme].tertiary, flexShrink: 1 }}
              numberOfLines={1}
            >
              {hint}
            </Text>
          ) : null}
        </View>
        {action ? <View>{action}</View> : null}
      </View>

      {isEmpty && emptyState ? <View style={styles.empty}>{emptyState}</View> : children}
    </View>
  )
}

export function Lane({
  age,
  overdue = false,
  title,
  subtitle,
  columns,
  actions,
  note,
  onPress,
  stackBelow = 768,
  selected = false,
  style,
  testID,
}: LaneProps) {
  const { theme } = useThemeContext()
  const { width } = useResponsive()
  const stacked = width > 0 && width < stackBelow

  // Empty labelled cells are dropped when stacked, and kept when wide: a table
  // column has to hold its place across every row or the grid stops lining up,
  // but a stacked list has no grid to preserve and a line reading "Union  —"
  // costs a phone screen the same as a line that says something.
  const visibleColumns = (columns ?? []).filter(
    (col) => !(stacked && isLaneColumn(col) && col.empty)
  )

  const body = (
    <View
      style={[
        styles.row,
        stacked && styles.rowStacked,
        {
          borderBottomColor: colors.border[theme].default,
          backgroundColor: selected ? colors.bg[theme].selected : 'transparent',
        },
        style,
      ]}
    >
      <View style={[styles.identity, stacked && styles.identityStacked]}>
        {age ? (
          <View style={[styles.age, stacked && styles.ageStacked]}>
            <Text
              style={{
                fontSize: fontSize.lg,
                lineHeight: lineHeight.lg,
                fontWeight: fontWeight.semibold,
                fontVariant: ['tabular-nums'],
                color: overdue ? colors.text[theme].attention : colors.text[theme].primary,
              }}
            >
              {age}
            </Text>
            <Text
              style={{
                fontSize: fontSize.h6,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: colors.text[theme].tertiary,
              }}
            >
              in stage
            </Text>
          </View>
        ) : null}

        <View style={styles.titleCell}>
          {typeof title === 'string' ? (
            <Text
              style={{
                fontSize: fontSize.lg,
                lineHeight: lineHeight.lg,
                fontWeight: fontWeight.semibold,
                color: colors.text[theme].primary,
              }}
            >
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle != null ? (
            typeof subtitle === 'string' ? (
              <Text style={{ fontSize: fontSize.md, color: colors.text[theme].secondary }}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            )
          ) : null}
        </View>
      </View>

      {visibleColumns.length > 0 ? (
        <View style={[styles.columns, stacked && styles.columnsStacked]}>
          {visibleColumns.map((col, i) => (
            // Columns are a fixed, ordered set defined by the calling screen —
            // never reordered, so the index is a stable identity here.
            <Fragment key={i}>
              <View
                style={[
                  styles.column,
                  isLaneColumn(col) && styles.columnLabelled,
                  stacked && styles.columnStacked,
                  stacked && isLaneColumn(col) && styles.columnStackedLabelled,
                ]}
              >
                {isLaneColumn(col) ? (
                  <>
                    {/* The label shows at every width, because a Lane row has
                        no column headings to imply it. Wide, the cells read
                        "Score 0  Source Scaffald"; a bare "0  Scaffald  —
                        Unassigned" is a row of values with nothing saying what
                        any of them are — the original caller worked around
                        exactly this by writing "score" into the cell itself.
                        Only the arrangement changes: inline when wide, label
                        left and value right when stacked.

                        An `empty` cell is the exception. Stacked it is gone
                        already; wide it stays as a spacer holding the grid,
                        and labelling a spacer prints a heading with nothing
                        after it — "Outcome" followed by blank, which is worse
                        than the bare placeholder it replaced. */}
                    {col.empty ? null : (
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          color: colors.text[theme].tertiary,
                        }}
                      >
                        {col.label}
                      </Text>
                    )}
                    {typeof col.value === 'string' ? (
                      <Text style={{ fontSize: fontSize.md, color: colors.text[theme].secondary }}>
                        {col.value}
                      </Text>
                    ) : (
                      col.value
                    )}
                  </>
                ) : (
                  col
                )}
              </View>
            </Fragment>
          ))}
        </View>
      ) : null}

      {note != null ? (
        <View style={[styles.note, stacked && styles.noteStacked]}>
          {typeof note === 'string' ? (
            <Text
              style={{
                fontSize: fontSize.md,
                fontStyle: 'italic',
                color: overdue ? colors.text[theme].attention : colors.text[theme].tertiary,
              }}
            >
              {note}
            </Text>
          ) : (
            note
          )}
        </View>
      ) : null}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  )

  if (!onPress) return <View testID={testID}>{body}</View>

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {body}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: spacing[4],
    marginBottom: spacing[24],
  },
  groupEmpty: {
    gap: 0,
    marginBottom: spacing[8],
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[12],
    paddingVertical: spacing[8],
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  empty: {
    // Indented to sit under the stage title, not under its dot.
    paddingVertical: spacing[4],
    paddingLeft: spacing[16],
    paddingBottom: spacing[12],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing[8],
    paddingVertical: spacing[16],
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
    flexShrink: 1,
    minWidth: 200,
  },
  identityStacked: {
    justifyContent: 'space-between',
    // Name first, age to its right.
    //
    // The wide row leads with age on purpose — it is the "act on this" number
    // and it wants the left edge. Stacked, that same order put a bare "17d /
    // IN STAGE" block on the left and pushed the candidate's name to the right
    // edge, ragged and second. On a phone the row IS the candidate, so the
    // name takes the left and the age keeps its prominence on the right.
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  ageStacked: {
    alignItems: 'flex-end',
    minWidth: 0,
    flexShrink: 0,
  },
  age: {
    alignItems: 'flex-start',
    minWidth: 64,
  },
  titleCell: {
    flexShrink: 1,
    gap: spacing[2],
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
    flexGrow: 1,
    flexShrink: 1,
  },
  columnsStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing[4],
  },
  column: {
    flexShrink: 1,
  },
  columnStacked: {
    width: '100%',
  },
  /** Wide: "Score 0" reads as one phrase. */
  columnLabelled: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[4],
  },
  /** Stacked: label left, value right, so the values form a readable edge. */
  columnStackedLabelled: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing[8],
  },
  note: {
    flexShrink: 1,
    maxWidth: 260,
  },
  noteStacked: {
    maxWidth: undefined,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
})
