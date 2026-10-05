/**
 * TextLink — the one text link.
 *
 * The SCF prototype has a single idiom for "go somewhere from here" in prose
 * and section headers: accent text with a trailing "→", underlined on hover.
 * The app had five hand-rolled versions at three sizes and two colours
 * (Scaffald/SaaS#981); this is the one they collapse into.
 *
 * @example
 * ```tsx
 * <TextLink onPress={() => router.push(ROUTES.JOBS.path)}>See all</TextLink>
 * ```
 */

import { ArrowRight } from 'lucide-react-native'
import { Pressable, StyleSheet, type PressableStateCallbackType } from 'react-native'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight, lineHeight, typography } from '../../tokens/typography'
import { Text } from '../Typography/Text'
import type { TextLinkProps } from './TextLink.types'

export function TextLink({
  children,
  arrow = true,
  size = 'sm',
  tone = 'accent',
  style,
  textStyle,
  accessibilityLabel,
  ...pressableProps
}: TextLinkProps) {
  const { theme } = useThemeContext()
  const color =
    tone === 'muted'
      ? colors.text[theme].secondary
      : theme === 'dark'
        ? colors.primary[300]
        : colors.primary[600]
  const iconSize = size === 'md' ? 16 : 14

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      hitSlop={6}
      style={({ pressed }) => [styles.root, { opacity: pressed ? 0.6 : 1 }, style]}
      {...pressableProps}
    >
      {({ hovered }: PressableStateCallbackType & { hovered?: boolean }) => (
        <>
          <Text
            style={StyleSheet.flatten([
              styles.text,
              size === 'md' && styles.textMd,
              { color, textDecorationLine: hovered ? 'underline' : 'none' },
              textStyle,
            ])}
          >
            {children}
          </Text>
          {arrow ? <ArrowRight size={iconSize} color={color} /> : null}
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  text: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.semibold,
  },
  textMd: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
})
