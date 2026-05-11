/**
 * AssessmentProgressBar - A thin, animated progress bar for assessment flows.
 *
 * Width is animated with `Animated.timing` on the JS driver (RN's native
 * driver does not support `width` animation). The progress bar updates
 * infrequently, so the JS-driver cost is unnoticeable.
 *
 * @example
 * ```tsx
 * <AssessmentProgressBar value={75} />
 * <AssessmentProgressBar value={50} color={colors.emerald[500]} height={4} />
 * ```
 */

import { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import { useReducedMotion } from '../../animation/useReducedMotion'
import { timingConfigs } from '../../animation/presets'
import { useThemeContext } from '../../theme'
import { colors } from '../../tokens/colors'
import { borderRadius } from '../../tokens/borders'
import type { AssessmentProgressBarProps } from './AssessmentProgressBar.types'

export function AssessmentProgressBar({
  value,
  color,
  trackColor,
  height = 3,
  animated = true,
  style,
}: AssessmentProgressBarProps) {
  const { theme } = useThemeContext()
  const prefersReducedMotion = useReducedMotion()
  const clampedValue = Math.max(0, Math.min(100, value))
  const canAnimate = animated && !prefersReducedMotion

  const fillColor = color ?? colors.primary[500]
  const bgColor = trackColor ?? colors.bg[theme].subtle

  const trackStyle = useMemo(
    () => ({
      height,
      backgroundColor: bgColor,
      borderRadius: borderRadius.max,
      overflow: 'hidden' as const,
      width: '100%' as unknown as number,
    }),
    [height, bgColor]
  )

  const fillBaseStyle = useMemo(
    () => ({
      height: '100%' as unknown as number,
      backgroundColor: fillColor,
      borderRadius: borderRadius.max,
    }),
    [fillColor]
  )

  if (canAnimate) {
    return (
      <View style={[trackStyle, style]}>
        <AnimatedFill value={clampedValue} baseStyle={fillBaseStyle} />
      </View>
    )
  }

  return (
    <View style={[trackStyle, style]}>
      <View style={[fillBaseStyle, { width: `${clampedValue}%` as unknown as number }]} />
    </View>
  )
}

function AnimatedFill({
  value,
  baseStyle,
}: {
  value: number
  baseStyle: Record<string, unknown>
}) {
  const progress = useRef(new Animated.Value(value)).current
  const durationMs = timingConfigs.normal.duration

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value,
      duration: durationMs,
      easing: Easing.out(Easing.quad),
      // width can't run on the native driver
      useNativeDriver: false,
    }).start()
  }, [value, durationMs, progress])

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <Animated.View
      style={[baseStyle, { width: widthInterpolated as unknown as number }]}
    />
  )
}
