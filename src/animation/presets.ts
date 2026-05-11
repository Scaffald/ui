/**
 * Animation presets
 *
 * Design-token-derived config for spring and timing animations. Compatible
 * with React Native's `Animated.spring(value, { damping, stiffness, mass })`
 * and `Animated.timing(value, { duration })`.
 *
 * @example
 * ```tsx
 * import { Animated } from 'react-native'
 * import { springConfigs, timingConfigs } from '@scaffald/ui'
 *
 * Animated.spring(scale, {
 *   toValue: 1,
 *   ...springConfigs.snappy,
 *   useNativeDriver: true,
 * }).start()
 *
 * Animated.timing(opacity, {
 *   toValue: 1,
 *   duration: timingConfigs.normal.duration,
 *   useNativeDriver: true,
 * }).start()
 * ```
 */

import { duration, springs } from '../tokens/animations'

/**
 * Cubic bezier control points, suitable for `Easing.bezier()`.
 */
export const bezierCurves = {
  easeInQuad: [0.55, 0.085, 0.68, 0.53] as const,
  easeOutQuad: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955] as const,
  easeInCubic: [0.55, 0.055, 0.675, 0.19] as const,
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,
  easeInOutCubic: [0.645, 0.045, 0.355, 1] as const,
  spring: [0.68, -0.55, 0.265, 1.55] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
} as const

/**
 * Spring configurations for `Animated.spring`. Maps directly to our design
 * token spring values.
 */
export const springConfigs = {
  /** Gentle spring - smooth and subtle */
  gentle: {
    damping: springs.gentle.damping,
    stiffness: springs.gentle.stiffness,
    mass: springs.gentle.mass,
  },
  /** Bouncy spring - playful with overshoot */
  bouncy: {
    damping: springs.bouncy.damping,
    stiffness: springs.bouncy.stiffness,
    mass: springs.bouncy.mass,
  },
  /** Snappy spring - quick and responsive */
  snappy: {
    damping: springs.snappy.damping,
    stiffness: springs.snappy.stiffness,
    mass: springs.snappy.mass,
  },
  /** Wobbly spring - loose and wavy */
  wobbly: {
    damping: springs.wobbly.damping,
    stiffness: springs.wobbly.stiffness,
    mass: springs.wobbly.mass,
  },
  /** Default spring for general use */
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  /** Press feedback spring - subtle scale on press */
  press: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  },
} as const

/**
 * Timing configurations for `Animated.timing`. Pair with an
 * `Easing` function from `react-native` at the call site.
 *
 * @example
 * ```tsx
 * import { Animated, Easing } from 'react-native'
 *
 * Animated.timing(opacity, {
 *   toValue: 1,
 *   duration: timingConfigs.normal.duration,
 *   easing: Easing.out(Easing.quad),
 *   useNativeDriver: true,
 * }).start()
 * ```
 */
export const timingConfigs = {
  /** Instant - no animation */
  instant: {
    duration: duration.instant,
  },
  /** Fastest - micro-interactions */
  fastest: {
    duration: duration.fastest,
  },
  /** Fast - quick feedback */
  fast: {
    duration: duration.fast,
  },
  /** Normal - standard animations */
  normal: {
    duration: duration.normal,
  },
  /** Slow - emphasized transitions */
  slow: {
    duration: duration.slow,
  },
  /** Slowest - dramatic animations */
  slowest: {
    duration: duration.slowest,
  },
} as const

/**
 * Animation preset values for common use cases
 */
export const animationPresets = {
  /** Button press scale animation */
  pressScale: {
    pressed: 0.95,
    default: 1,
    spring: springConfigs.press,
  },
  /** Fade in/out */
  fade: {
    visible: 1,
    hidden: 0,
    timing: timingConfigs.normal,
  },
  /** Modal scale animation */
  modalScale: {
    visible: 1,
    hidden: 0.9,
    spring: springConfigs.snappy,
  },
  /** Slide distances */
  slideDistance: {
    small: 20,
    medium: 50,
    large: 100,
    full: '100%',
  },
  /** Toggle thumb translation */
  toggle: {
    sm: { on: 18, off: 2 },
    md: { on: 24, off: 2 },
  },
  /** Checkbox check animation */
  checkbox: {
    checked: { scale: 1, opacity: 1 },
    unchecked: { scale: 0.8, opacity: 0 },
    spring: springConfigs.snappy,
  },
  /** Accordion height animation */
  accordion: {
    timing: timingConfigs.normal,
  },
} as const

export type SpringConfigKey = keyof typeof springConfigs
export type TimingConfigKey = keyof typeof timingConfigs
export type BezierCurveKey = keyof typeof bezierCurves
