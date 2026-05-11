/**
 * Animation module for Beyond UI
 *
 * Animation primitives built on React Native's vanilla `Animated` API.
 * No Reanimated dependency.
 *
 * @example
 * ```tsx
 * import {
 *   AnimatedView,
 *   AnimatedPressable,
 *   FadeTransition,
 *   useAnimatedSpring,
 *   springConfigs,
 * } from '@scaffald/ui'
 *
 * <AnimatedPressable onPress={handlePress} pressScale={0.95}>
 *   <Text>Press me</Text>
 * </AnimatedPressable>
 *
 * <FadeTransition visible={isVisible}>
 *   <ModalContent />
 * </FadeTransition>
 *
 * const { animatedStyle, animate } = useAnimatedSpring({
 *   initialValue: 1,
 *   springConfig: 'snappy',
 * })
 * ```
 */

// Core animated components
export { AnimatedView, isReanimatedAvailable, type AnimatedViewProps } from './AnimatedView'
export {
  AnimatedPressable,
  isAnimatedPressAvailable,
  type AnimatedPressableProps,
} from './AnimatedPressable'

// Animation hooks
export { useReducedMotion } from './useReducedMotion'
export { useLayoutAnimation, type LayoutAnimationConfig } from './useLayoutAnimation'
export {
  useAnimatedSpring,
  type UseAnimatedSpringOptions,
  type UseAnimatedSpringReturn,
  type SpringConfig,
  type AnimatedSpringProperty,
} from './useAnimatedSpring'
export {
  useAnimatedTiming,
  type UseAnimatedTimingOptions,
  type UseAnimatedTimingReturn,
  type EasingType,
  type AnimatedTimingProperty,
} from './useAnimatedTiming'

// Transition components
export {
  FadeTransition,
  SlideTransition,
  ScaleTransition,
  type FadeTransitionProps,
  type SlideTransitionProps,
  type ScaleTransitionProps,
  type SlideDirection,
  type SlideAnimationType,
} from './transitions'

// Animation presets and configs
export {
  springConfigs,
  timingConfigs,
  animationPresets,
  bezierCurves,
  type SpringConfigKey,
  type TimingConfigKey,
  type BezierCurveKey,
} from './presets'
