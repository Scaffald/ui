/**
 * useAnimatedTiming hook
 * Timing-based animations powered by React Native's vanilla `Animated` API.
 *
 * @example
 * ```tsx
 * import { useAnimatedTiming, AnimatedView } from '@scaffald/ui'
 *
 * function FadeComponent() {
 *   const { animatedStyle, animate } = useAnimatedTiming({
 *     initialValue: 0,
 *     property: 'opacity',
 *     duration: 'normal',
 *   })
 *
 *   useEffect(() => { animate(1) }, [animate])
 *
 *   return (
 *     <AnimatedView style={animatedStyle}>
 *       <Text>Fading content</Text>
 *     </AnimatedView>
 *   )
 * }
 * ```
 */

import { useCallback, useMemo, useRef } from 'react'
import { Animated, Easing, type ViewStyle } from 'react-native'
import { timingConfigs, type TimingConfigKey } from './presets'
import { useReducedMotion } from './useReducedMotion'

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'

export type AnimatedTimingProperty =
  | 'scale'
  | 'opacity'
  | 'translateX'
  | 'translateY'
  | 'rotate'
  | 'height'

export interface UseAnimatedTimingOptions {
  /**
   * Initial value for the animation.
   * @default 0
   */
  initialValue?: number

  /**
   * Timing duration preset or custom duration in ms.
   * @default 'normal'
   */
  duration?: TimingConfigKey | number

  /**
   * Easing function type.
   * @default 'easeOut'
   */
  easing?: EasingType

  /**
   * Property to animate.
   * @default 'opacity'
   */
  property?: AnimatedTimingProperty
}

export interface UseAnimatedTimingReturn {
  /** Underlying `Animated.Value`. */
  value: Animated.Value
  /** Style object to spread on an `Animated.View`. */
  animatedStyle: ViewStyle
  /** Animate to a new value. */
  animate: (toValue: number, callback?: () => void) => void
  /** Always true — kept for backwards compatibility with the old API. */
  isAnimated: boolean
}

function getEasing(type: EasingType): (t: number) => number {
  switch (type) {
    case 'linear':
      return Easing.linear
    case 'easeIn':
      return Easing.in(Easing.quad)
    case 'easeOut':
      return Easing.out(Easing.quad)
    case 'easeInOut':
      return Easing.inOut(Easing.quad)
    default:
      return Easing.out(Easing.quad)
  }
}

function getDurationMs(duration: TimingConfigKey | number): number {
  if (typeof duration === 'number') return duration
  return timingConfigs[duration]?.duration ?? 300
}

function createStyle(
  property: AnimatedTimingProperty,
  value: Animated.Value
): ViewStyle {
  switch (property) {
    case 'scale':
      return { transform: [{ scale: value }] } as unknown as ViewStyle
    case 'opacity':
      return { opacity: value } as unknown as ViewStyle
    case 'translateX':
      return { transform: [{ translateX: value }] } as unknown as ViewStyle
    case 'translateY':
      return { transform: [{ translateY: value }] } as unknown as ViewStyle
    case 'rotate':
      return {
        transform: [
          {
            rotate: value.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      } as unknown as ViewStyle
    case 'height':
      return { height: value } as unknown as ViewStyle
    default:
      return {}
  }
}

// `height` can't run on the native driver in RN; the others can.
const NATIVE_DRIVER_PROPERTIES: ReadonlySet<AnimatedTimingProperty> = new Set([
  'scale',
  'opacity',
  'translateX',
  'translateY',
  'rotate',
])

export function useAnimatedTiming(
  options: UseAnimatedTimingOptions = {}
): UseAnimatedTimingReturn {
  const {
    initialValue = 0,
    duration = 'normal',
    easing = 'easeOut',
    property = 'opacity',
  } = options

  const prefersReducedMotion = useReducedMotion()
  const durationMs = getDurationMs(duration)
  const easingFn = getEasing(easing)
  const useNativeDriver = NATIVE_DRIVER_PROPERTIES.has(property)

  const animValue = useRef(new Animated.Value(initialValue)).current

  const animatedStyle = useMemo(
    () => createStyle(property, animValue),
    [property, animValue]
  )

  const animate = useCallback(
    (toValue: number, callback?: () => void) => {
      if (prefersReducedMotion) {
        animValue.setValue(toValue)
        callback?.()
        return
      }
      Animated.timing(animValue, {
        toValue,
        duration: durationMs,
        easing: easingFn,
        useNativeDriver,
      }).start(({ finished }) => {
        if (finished) callback?.()
      })
    },
    [animValue, durationMs, easingFn, prefersReducedMotion, useNativeDriver]
  )

  return {
    value: animValue,
    animatedStyle,
    animate,
    isAnimated: !prefersReducedMotion,
  }
}
