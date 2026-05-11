/**
 * AnimatedPressable component
 * A Pressable with a built-in scale-on-press animation, driven by React
 * Native's vanilla `Animated` API on the native driver. No Reanimated
 * dependency.
 *
 * @example
 * ```tsx
 * import { AnimatedPressable } from '@scaffald/ui'
 *
 * <AnimatedPressable onPress={handlePress} pressScale={0.95}>
 *   <Text>Press me</Text>
 * </AnimatedPressable>
 * ```
 */

import { forwardRef, useCallback, useMemo, useRef } from 'react'
import {
  Animated,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type View,
  type ViewStyle,
} from 'react-native'
import { springConfigs } from './presets'
import { useReducedMotion } from './useReducedMotion'

const AnimatedPressableNative = Animated.createAnimatedComponent(Pressable)

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /**
   * Whether to animate on press.
   * @default true
   */
  animateOnPress?: boolean

  /**
   * Scale value when pressed (0-1).
   * @default 0.95
   */
  pressScale?: number

  /**
   * Spring configuration preset.
   * @default 'press'
   */
  springConfig?: keyof typeof springConfigs

  /**
   * Style for the pressable container.
   */
  style?: ViewStyle | ViewStyle[] | ((state: { pressed: boolean }) => ViewStyle | ViewStyle[])

  /**
   * Children to render inside the pressable.
   */
  children?: React.ReactNode
}

export const AnimatedPressable = forwardRef<View, AnimatedPressableProps>(
  function AnimatedPressable(
    {
      animateOnPress = true,
      pressScale = 0.95,
      springConfig = 'press',
      style,
      disabled,
      onPressIn,
      onPressOut,
      children,
      ...props
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion()
    const shouldAnimate = animateOnPress && !prefersReducedMotion && !disabled

    const scale = useRef(new Animated.Value(1)).current
    const config = springConfigs[springConfig]

    const animateTo = useCallback(
      (toValue: number) => {
        Animated.spring(scale, {
          toValue,
          damping: config.damping,
          stiffness: config.stiffness,
          mass: config.mass,
          useNativeDriver: true,
        }).start()
      },
      [scale, config.damping, config.stiffness, config.mass]
    )

    const handlePressIn = useCallback(
      (event: GestureResponderEvent) => {
        if (shouldAnimate) {
          animateTo(pressScale)
        }
        onPressIn?.(event)
      },
      [shouldAnimate, animateTo, pressScale, onPressIn]
    )

    const handlePressOut = useCallback(
      (event: GestureResponderEvent) => {
        if (shouldAnimate) {
          animateTo(1)
        }
        onPressOut?.(event)
      },
      [shouldAnimate, animateTo, onPressOut]
    )

    const transformStyle = useMemo<ViewStyle>(
      () => ({ transform: [{ scale }] }) as unknown as ViewStyle,
      [scale]
    )

    const combinedStyle = useMemo(() => {
      if (typeof style === 'function') {
        return (state: { pressed: boolean }) => {
          const resolved = style(state)
          return Array.isArray(resolved)
            ? [...resolved, transformStyle]
            : [resolved, transformStyle]
        }
      }
      if (Array.isArray(style)) {
        return [...style, transformStyle]
      }
      return [style, transformStyle]
    }, [style, transformStyle])

    return (
      <AnimatedPressableNative
        ref={ref as never}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={combinedStyle}
        {...props}
      >
        {children}
      </AnimatedPressableNative>
    )
  }
)

AnimatedPressable.displayName = 'AnimatedPressable'

/**
 * Backwards-compatible helper that previously gated press animations on
 * whether Reanimated was loaded. Animations are always available now.
 *
 * @deprecated Press animations now always work.
 */
export function isAnimatedPressAvailable(): boolean {
  return true
}
