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

import { Fragment } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useThemeContext } from '../../theme'
import { useResponsive } from '../../hooks/useResponsive'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'
import { Text } from '../Typography/Text'
import type { LaneGroupProps, LaneProps } from './Lane.types'

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
    <View style={[styles.group, style]} testID={testID}>
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
          <View style={styles.age}>
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

      {columns && columns.length > 0 ? (
        <View style={[styles.columns, stacked && styles.columnsStacked]}>
          {columns.map((col, i) => (
            // Columns are a fixed, ordered set defined by the calling screen —
            // never reordered, so the index is a stable identity here.
            <Fragment key={i}>
              <View style={[styles.column, stacked && styles.columnStacked]}>{col}</View>
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
    paddingVertical: spacing[24],
    paddingHorizontal: spacing[16],
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
