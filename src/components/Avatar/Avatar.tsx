/**
 * Avatar component
 * Displays user avatars with various types, sizes, and indicators
 */

import { useState, useMemo, useCallback } from 'react'
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native'
import type { AvatarColor, AvatarProps } from './Avatar.types'
import { colors } from '../../tokens/colors'
import { fontFamily, fontWeight } from '../../tokens/typography'
import { useThemeContext } from '../../theme'

// Avatar size to dimensions mapping
const SIZE_DIMENSIONS = {
  16: { size: 16, fontSize: 6, ringWidth: 1.5, statusSize: 4, badgeSize: 6 },
  20: { size: 20, fontSize: 7, ringWidth: 2, statusSize: 5, badgeSize: 8 },
  24: { size: 24, fontSize: 9, ringWidth: 2, statusSize: 6, badgeSize: 10 },
  32: { size: 32, fontSize: 12, ringWidth: 2, statusSize: 8, badgeSize: 12 },
  36: { size: 36, fontSize: 14, ringWidth: 2, statusSize: 9, badgeSize: 14 },
  40: { size: 40, fontSize: 16, ringWidth: 2, statusSize: 10, badgeSize: 16 },
  48: { size: 48, fontSize: 18, ringWidth: 2.5, statusSize: 12, badgeSize: 18 },
  56: { size: 56, fontSize: 22, ringWidth: 3, statusSize: 14, badgeSize: 20 },
  64: { size: 64, fontSize: 24, ringWidth: 3, statusSize: 16, badgeSize: 24 },
  72: { size: 72, fontSize: 28, ringWidth: 3, statusSize: 18, badgeSize: 26 },
  80: { size: 80, fontSize: 32, ringWidth: 4, statusSize: 20, badgeSize: 28 },
}

// Status colors
const STATUS_COLORS = {
  online: colors.green[500],
  offline: colors.gray[400],
  busy: colors.error[500],
  away: colors.warning[500],
}

// Fill, initials and ring per colour, per theme. The fills were the light
// ramp's 100 step in both themes, so every initials disc was the brightest
// object on a dark screen (Scaffald/SaaS#1088). In dark the tint inverts: the
// ramp's 900 step under its 300 step, as Chip does. The neutral disc reads the
// semantic tokens, which resolve to the same gray[100]/gray[700] in light.
export function getAvatarColors(color: AvatarColor, t: 'light' | 'dark') {
  const ramp =
    color === 'primary'
      ? colors.primary
      : color === 'info'
        ? colors.blue
        : color === 'success'
          ? colors.green
          : color === 'warning'
            ? colors.warning
            : color === 'error'
              ? colors.error
              : null
  if (!ramp) {
    return {
      backgroundColor: colors.bg[t].muted,
      textColor: colors.text[t].secondary,
      ringColor: colors.border[t].muted,
    }
  }
  const isDark = t === 'dark'
  return {
    backgroundColor: isDark ? ramp[900] : ramp[100],
    textColor: isDark ? ramp[300] : ramp[700],
    ringColor: isDark ? ramp[400] : ramp[600],
  }
}

export function Avatar({
  size = 40,
  color = 'gray',
  src,
  initials,
  icon,
  alt,
  showRing = false,
  status,
  badge,
  verified = false,
  star = false,
  badgeCount,
  badgeMax = 99,
  containerStyle,
  avatarStyle,
  onPress,
  onError,
}: AvatarProps) {
  const { theme } = useThemeContext()
  const [imageError, setImageError] = useState(false)

  // Enhanced image error handler
  const handleImageError = useCallback(() => {
    setImageError(true)
    if (__DEV__) {
      console.warn('[Avatar] Image load failed:', src)
    }
    if (onError) {
      onError(new Error('Failed to load avatar image'))
    }
  }, [src, onError])

  const dimensions = SIZE_DIMENSIONS[size]
  const isClickable = !!onPress

  // Accessibility label
  const getAccessibilityLabel = () => {
    let label = alt || 'Avatar'
    if (status) {
      label += `, status: ${status}`
    }
    if (verified) {
      label += ', verified'
    }
    if (star) {
      label += ', starred'
    }
    return label
  }

  // Accessibility hint for status
  const getAccessibilityHint = () => {
    if (status) {
      return `User status: ${status}`
    }
    return undefined
  }

  // Determine avatar type. Coerce to booleans: `src`/`initials` can be empty
  // strings, and `"" && x` evaluates to `""`, which React renders as a stray
  // text node inside the avatar <View> ("text node cannot be a child of View").
  const hasImage = !!src && !imageError
  const hasInitials = !!initials && initials.length > 0
  const hasIcon = !!icon

  const { backgroundColor, textColor, ringColor } = useMemo(
    () => getAvatarColors(color, theme === 'dark' ? 'dark' : 'light'),
    [color, theme],
  )

  const avatarContent = (
    <View
      style={[
        styles.container,
        {
          width: dimensions.size,
          height: dimensions.size,
          borderRadius: dimensions.size / 2,
        },
        containerStyle,
      ]}
      accessible={true}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityRole="image"
      {...(status && { accessibilityLiveRegion: 'polite' as const })}
    >
      {/* Ring border */}
      {showRing && (
        <View
          style={[
            styles.ring,
            {
              width: dimensions.size,
              height: dimensions.size,
              borderRadius: dimensions.size / 2,
              borderWidth: dimensions.ringWidth,
              borderColor: ringColor,
            },
          ]}
        />
      )}

      {/* Avatar content */}
      <View
        style={[
          styles.avatar,
          {
            width: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
            height: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
            borderRadius: (dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0)) / 2,
            backgroundColor: hasImage ? 'transparent' : backgroundColor,
          },
          avatarStyle,
        ]}
      >
        {/* Photo */}
        {hasImage && typeof src === 'string' && (
          <Image
            source={{ uri: src }}
            style={[
              styles.image,
              {
                width: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
                height: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
                borderRadius: (dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0)) / 2,
              },
            ]}
            onError={handleImageError}
          />
        )}
        {hasImage && typeof src !== 'string' && (
          <Image
            source={src}
            style={[
              styles.image,
              {
                width: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
                height: dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0),
                borderRadius: (dimensions.size - (showRing ? dimensions.ringWidth * 2 : 0)) / 2,
              },
            ]}
            onError={handleImageError}
          />
        )}

        {/* Initials */}
        {!hasImage && hasInitials && (
          <Text
            style={[
              styles.initials,
              {
                fontSize: dimensions.fontSize,
                color: textColor,
                fontFamily: fontFamily.body,
                fontWeight: fontWeight.medium,
              },
            ]}
          >
            {initials.toUpperCase().slice(0, 2)}
          </Text>
        )}

        {/* Icon/Logo */}
        {!hasImage && !hasInitials && hasIcon && (
          <View style={styles.iconContainer}>
            {typeof icon === 'string' || typeof icon === 'number' ? (
              <Text style={[styles.initials, { color: textColor }]}>{String(icon)}</Text>
            ) : (
              icon
            )}
          </View>
        )}
      </View>

      {/* Status indicator */}
      {status && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: dimensions.statusSize,
              height: dimensions.statusSize,
              borderRadius: dimensions.statusSize / 2,
              backgroundColor: STATUS_COLORS[status],
              borderWidth: dimensions.statusSize > 10 ? 2 : 1.5,
              borderColor: colors.bg[theme].default,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}

      {/* Verified badge */}
      {verified && (
        <View
          style={[
            styles.badge,
            {
              width: dimensions.badgeSize,
              height: dimensions.badgeSize,
              borderRadius: dimensions.badgeSize / 2,
              backgroundColor: colors.blue[500],
              borderWidth: dimensions.badgeSize > 12 ? 2 : 1.5,
              borderColor: colors.bg[theme].default,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Text style={[styles.badgeText, { fontSize: dimensions.badgeSize * 0.6 }]}>✓</Text>
        </View>
      )}

      {/* Star badge */}
      {star && !verified && (
        <View
          style={[
            styles.badge,
            {
              width: dimensions.badgeSize,
              height: dimensions.badgeSize,
              borderRadius: dimensions.badgeSize / 2,
              backgroundColor: colors.warning[500],
              borderWidth: dimensions.badgeSize > 12 ? 2 : 1.5,
              borderColor: colors.bg[theme].default,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Text style={[styles.badgeText, { fontSize: dimensions.badgeSize * 0.6 }]}>★</Text>
        </View>
      )}

      {/* Notification count badge (top-right) */}
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <View
          style={[
            styles.countBadge,
            {
              minWidth: Math.max(dimensions.badgeSize, 16),
              height: Math.max(dimensions.badgeSize, 16),
              borderRadius: Math.max(dimensions.badgeSize, 16) / 2,
              backgroundColor: colors.error[500],
              borderWidth: dimensions.badgeSize > 12 ? 2 : 1.5,
              borderColor: colors.bg[theme].default,
              paddingHorizontal: 4,
            },
          ]}
          accessibilityLabel={`${badgeCount} unread`}
        >
          <Text
            style={[
              styles.badgeText,
              {
                fontSize: Math.max(dimensions.badgeSize * 0.55, 9),
                lineHeight: Math.max(dimensions.badgeSize * 0.7, 11),
                fontWeight: '700',
              },
            ]}
          >
            {badgeCount > badgeMax ? `${badgeMax}+` : badgeCount}
          </Text>
        </View>
      )}

      {/* Custom badge */}
      {badge && !verified && !star && (
        <View
          style={[
            styles.badge,
            {
              bottom: 0,
              right: 0,
            },
          ]}
        >
          {typeof badge === 'string' || typeof badge === 'number' ? (
            <Text style={[styles.badgeText, { fontSize: dimensions.badgeSize * 0.6 }]}>{String(badge)}</Text>
          ) : (
            badge
          )}
        </View>
      )}
    </View>
  )

  if (isClickable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && Platform.OS !== 'web' && { opacity: 0.8 }]}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint="Double tap to open profile"
      >
        {avatarContent}
      </Pressable>
    )
  }

  return avatarContent
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    position: 'absolute',
    // Sit on the avatar's edge rather than inside it — at top/right 0 the
    // badge covered the second initial (e.g. "MR" read as "M") (#384).
    top: -4,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
