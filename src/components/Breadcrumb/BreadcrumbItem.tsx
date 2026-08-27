/**
 * BreadcrumbItem component
 * Individual breadcrumb link with states (default, hover, active)
 *
 * @example
 * ```tsx
 * import { BreadcrumbItem } from '@scaffald/ui'
 *
 * <BreadcrumbItem
 *   label="Home"
 *   icon={<HomeIcon />}
 *   state="default"
 *   interactive
 *   onPress={() => navigate('/')}
 * />
 * ```
 */

import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import type { BreadcrumbItemProps } from './Breadcrumb.types'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'

/**
 * BreadcrumbItem component
 */
export function BreadcrumbItem({
  label,
  icon,
  state,
  interactive = true,
  disabled = false,
  onPress,
  style,
  labelStyle,
}: BreadcrumbItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useThemeContext()
  const isLight = theme === 'light'

  // Determine if item is active
  const isActive = state === 'active'

  // Get text color based on state
  const getTextColor = () => {
    if (disabled) {
      return isLight ? colors.text.light.disabled : colors.text.dark.disabled
    }
    if (isActive) {
      return isLight ? colors.text.light.primary : colors.text.dark.primary
    }
    if (isHovered) {
      return isLight ? colors.text.light.secondary : colors.text.dark.secondary
    }
    return isLight ? colors.text.light.tertiary : colors.text.dark.tertiary
  }

  // Get font weight based on state
  const getFontWeight = () => {
    return isActive ? typography.smallBold.fontWeight : typography.small.fontWeight
  }

  // Get icon color (same as text color)
  const _iconColor = getTextColor()

  // Handle press
  const handlePress = () => {
    if (disabled || !interactive || isActive) return
    onPress?.()
  }

  // Determine if item should be interactive
  const shouldBeInteractive = interactive && !disabled && !isActive

  const content = (
    <View style={[styles.container, style]}>
      {/* Icon */}
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      {/* Label */}
      <Text
        // A long final crumb — "Review Background Checks" — is wider than a
        // 390px screen on its own, so the trail's `flexWrap` had nothing to
        // wrap and the text was cut mid-word at the viewport edge. Truncating
        // keeps the crumb inside the screen and says it was shortened.
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.label,
          { flexShrink: 1 },
          {
            color: getTextColor(),
            fontWeight: getFontWeight(),
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  )

  // If not interactive, render as plain View
  if (!shouldBeInteractive) {
    return (
      <View
        style={styles.wrapper}
        role="link"
        aria-current={isActive ? 'page' : undefined}
        accessibilityRole="link"
        accessibilityLabel={label}
        accessibilityState={{
          disabled: true,
        }}
      >
        {content}
      </View>
    )
  }

  // Interactive breadcrumb item
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || !interactive || isActive}
      style={({ pressed }) => [styles.wrapper, pressed && shouldBeInteractive && { opacity: 0.8 }]}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        style: ({ pressed }: { pressed: boolean }) => [
          styles.wrapper,
          pressed && shouldBeInteractive && { opacity: 0.8 },
          shouldBeInteractive && { cursor: 'pointer' },
        ],
      })}
      role="link"
      aria-current={isActive ? 'page' : undefined}
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: !shouldBeInteractive,
      }}
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    // Shrinkable for the same reason as `container` below: this is the direct
    // child of the trail row, so it is the one the row asks to give way first.
    flexShrink: 1,
    minWidth: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6], // 6px between icon and text
    // The label truncates rather than overflowing, which needs the row to be
    // shrinkable and its minimum lifted — flexShrink on the Text alone does
    // nothing while its parent's intrinsic width is the floor.
    flexShrink: 1,
    minWidth: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.small.fontFamily,
    fontSize: typography.small.fontSize,
    lineHeight: typography.small.lineHeight,
  },
})
