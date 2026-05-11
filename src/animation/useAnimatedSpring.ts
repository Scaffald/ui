/**
 * useAnimatedSpring hook
 * Spring-based animations powered by React Native's vanilla `Animated` API.
 *
 * @example
 * ```tsx
 * import { Animated } from 'react-native'
 * import { AnimatedView, useAnimatedSpring } from '@scaffald/ui'
 *
 * function ScaleButton() {
 *   const { animatedStyle, animate } = useAnimatedSpring({
 *     initialValue: 1,
 *     springConfig: 'snappy',
 *     property: 'scale',
 *   })
 *
 *   return (
 *     <AnimatedView style={animatedStyle}>
 *       <Pressable
 *         onPressIn={() => animate(0.95)}
 *         onPressOut={() => animate(1)}
 *       >
 *         <Text>Press me</Text>
 *       </Pressable>
 *     </AnimatedView>
 *   )
 * }
 * ```
 */

import { useCallback, useMemo, useRef } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { springConfigs, type SpringConfigKey } from './presets'
import { useReducedMotion } from './useReducedMotion'

export interface SpringConfig {
  damping?: number
  stiffness?: number
  mass?: number
  overshootClamping?: boolean
  restDisplacementThreshold?: number
  restSpeedThreshold?: number
}

export type AnimatedSpringProperty =
  | 'scale'
  | 'opacity'
  | 'translateX'
  | 'translateY'
  | 'rotate'

export interface UseAnimatedSpringOptions {
  /**
   * Initial value for the animation.
   * @default 0
   */
  initialValue?: number

  /**
   * Spring configuration preset or custom config.
   * @default 'default'
   */
  springConfig?: SpringConfigKey | SpringConfig

  /**
   * Which style property to animate.
   * @default 'scale'
   */
  property?: AnimatedSpringProperty
}

export interface UseAnimatedSpringReturn {
  /** Underlying `Animated.Value`. */
  value: Animated.Value
  /** Style object to apply to an `Animated.View`. */
  animatedStyle: ViewStyle
  /** Animate to a new value. */
  animate: (toValue: number) => void
  /** Always true — kept for backwards compatibility with the old API. */
  isAnimated: boolean
}

function getSpringConfig(
  springConfig: SpringConfigKey | SpringConfig | undefined
): SpringConfig {
  if (!springConfig) return springConfigs.default
  if (typeof springConfig === 'string') return springConfigs[springConfig]
  return springConfig
}

function createStyle(
  property: AnimatedSpringProperty,
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
    default:
      return {}
  }
}

// `opacity` and `transform` are native-driver compatible.
const NATIVE_DRIVER_PROPERTIES: ReadonlySet<AnimatedSpringProperty> = new Set([
  'scale',
  'opacity',
  'translateX',
  'translateY',
  'rotate',
])

export function useAnimatedSpring(
  options: UseAnimatedSpringOptions = {}
): UseAnimatedSpringReturn {
  const { initialValue = 0, springConfig, property = 'scale' } = options

  const prefersReducedMotion = useReducedMotion()
  const config = getSpringConfig(springConfig)

  const animValue = useRef(new Animated.Value(initialValue)).current

  const animatedStyle = useMemo(
    () => createStyle(property, animValue),
    [property, animValue]
  )

  const animate = useCallback(
    (toValue: number) => {
      if (prefersReducedMotion) {
        animValue.setValue(toValue)
        return
      }
      Animated.spring(animValue, {
        toValue,
        damping: config.damping,
        stiffness: config.stiffness,
        mass: config.mass,
        overshootClamping: config.overshootClamping,
        restDisplacementThreshold: config.restDisplacementThreshold,
        restSpeedThreshold: config.restSpeedThreshold,
        useNativeDriver: NATIVE_DRIVER_PROPERTIES.has(property),
      }).start()
    },
    [animValue, config, prefersReducedMotion, property]
  )

  return {
    value: animValue,
    animatedStyle,
    animate,
    isAnimated: !prefersReducedMotion,
  }
}
