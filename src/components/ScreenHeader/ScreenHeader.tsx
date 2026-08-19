/**
 * ScreenHeader — the one header every screen uses.
 *
 * Kicker → title (+ optional collapse caret) → tip (+ optional pager), with
 * room for actions on the title row and a full-width slot beneath.
 *
 * The SCF prototype runs this same block on all 29 of its screens; its design
 * audit called the four-way drift between them an inconsistency worth fixing.
 * Our app had no title header at all — screens rendered `<H2>Applications</H2>`
 * ad hoc — so this is the missing piece rather than a reconciliation.
 *
 * Every part except `title` is optional. A screen that only needs a title
 * renders one and nothing else moves.
 *
 * @example
 * ```tsx
 * <ScreenHeader
 *   kicker="Employer view — applicant workflow"
 *   title="Applications"
 *   tip="Move candidates between stages with the arrows — the worker sees each move as honest progress, not silence."
 *   pager={{ index: 1, total: 5, onNext: nextTip }}
 *   actions={<Button>Post a job</Button>}
 * />
 * ```
 */

import { Pressable, StyleSheet, View } from 'react-native'
import { ArrowRight, ChevronUp } from 'lucide-react-native'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'
import { Text } from '../Typography/Text'
import { H2 } from '../Typography/Heading'
import type { ScreenHeaderProps } from './ScreenHeader.types'

export function ScreenHeader({
  kicker,
  title,
  tip,
  collapsed = false,
  onToggleCollapsed,
  pager,
  actions,
  children,
  style,
  testID,
}: ScreenHeaderProps) {
  const { theme } = useThemeContext()
  const showTip = tip != null && !collapsed

  return (
    <View style={[styles.root, style]} testID={testID}>
      {kicker ? (
        <Text
          style={{
            fontSize: fontSize.h6,
            lineHeight: lineHeight.h6,
            fontWeight: fontWeight.medium,
            // ~0.13em at 11px. The letterSpacing tokens top out at 0.4 for
            // body-scale tracking; an uppercase kicker needs several times that.
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: colors.text[theme].attention,
          }}
        >
          {kicker}
        </Text>
      ) : null}

      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          <H2 style={{ color: colors.text[theme].primary }}>{title}</H2>
          {onToggleCollapsed && tip != null ? (
            <Pressable
              onPress={onToggleCollapsed}
              accessibilityRole="button"
              accessibilityLabel={collapsed ? 'Show description' : 'Hide description'}
              accessibilityState={{ expanded: !collapsed }}
              hitSlop={8}
              style={styles.caret}
            >
              <ChevronUp
                size={18}
                color={colors.text[theme].tertiary}
                style={{ transform: [{ rotate: collapsed ? '180deg' : '0deg' }] }}
              />
            </Pressable>
          ) : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>

      {showTip ? (
        <View style={styles.tipRow}>
          <View style={styles.tipText}>
            {typeof tip === 'string' ? (
              <Text
                style={{
                  fontSize: fontSize.lg,
                  lineHeight: lineHeight.lg,
                  color: colors.text[theme].secondary,
                }}
              >
                {tip}
              </Text>
            ) : (
              tip
            )}
          </View>

          {pager && pager.total > 1 ? (
            <Pressable
              onPress={pager.onNext}
              accessibilityRole="button"
              accessibilityLabel={pager.accessibilityLabel ?? 'Next tip'}
              hitSlop={8}
              style={styles.pager}
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.text[theme].tertiary,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {pager.index} / {pager.total}
              </Text>
              {/* The arrow is reserved for navigation controls like this one.
                  The prototype's audit found it doing double duty as decoration
                  on link labels, which made it impossible to tell which arrows
                  were live — so it never appears in a label here. */}
              <ArrowRight size={16} color={colors.text[theme].attention} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {children ? <View style={styles.slot}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: spacing[8],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[16],
    flexWrap: 'wrap',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flexShrink: 1,
  },
  caret: {
    padding: spacing[2],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[16],
  },
  tipText: {
    flexShrink: 1,
    maxWidth: 620,
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    paddingTop: spacing[2],
  },
  slot: {
    width: '100%',
    marginTop: spacing[8],
  },
})
