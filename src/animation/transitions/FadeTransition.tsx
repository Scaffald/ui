/**
 * FadeTransition component
 * Fade in/out on mount/unmount, powered by vanilla `Animated`.
 *
 * @example
 * ```tsx
 * <FadeTransition visible={visible} duration="fast">
 *   <View style={styles.tooltip}>
 *     <Text>Tooltip content</Text>
 *   </View>
 * </FadeTransition>
 * ```
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Animated, View, type ViewProps, type ViewStyle } from 'react-native'
import type { TimingConfigKey } from '../presets'
import { timingConfigs } from '../presets'
import { useReducedMotion } from '../useReducedMotion'
import { useAnimatedTiming, type EasingType } from '../useAnimatedTiming'

export interface FadeTransitionProps extends Omit<ViewProps, 'style'> {
  /** Whether the content is visible. */
  visible: boolean
  /** Duration of the fade animation. @default 'normal' */
  duration?: TimingConfigKey | number
  /** Easing function for the animation. @default 'easeOut' */
  easing?: EasingType
  /** Whether to unmount content when not visible. @default true */
  unmountOnHide?: boolean
  /** Callback when fade-in animation completes. */
  onFadeInComplete?: () => void
  /** Callback when fade-out animation completes. */
  onFadeOutComplete?: () => void
  /** Style for the container. */
  style?: ViewStyle
  /** Children to render. */
  children: React.ReactNode
}

function resolveDurationMs(duration: TimingConfigKey | number): number {
  if (typeof duration === 'number') return duration
  return timingConfigs[duration]?.duration ?? 300
}

export const FadeTransition = forwardRef<View, FadeTransitionProps>(
  function FadeTransition(
    {
      visible,
      duration = 'normal',
      easing = 'easeOut',
      unmountOnHide = true,
      onFadeInComplete,
      onFadeOutComplete,
      style,
      children,
      ...props
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion()
    const [shouldRender, setShouldRender] = useState(visible)
    const durationMs = resolveDurationMs(duration)

    const { animatedStyle, animate } = useAnimatedTiming({
      initialValue: visible ? 1 : 0,
      duration: prefersReducedMotion ? 0 : durationMs,
      easing,
      property: 'opacity',
    })

    // Track the latest visible state in a ref so the effect can read it
    // without re-running on every animate callback change.
    const visibleRef = useRef(visible)
    visibleRef.current = visible

    useEffect(() => {
      if (visible) {
        setShouldRender(true)
        requestAnimationFrame(() => {
          animate(1, () => {
            if (visibleRef.current) onFadeInComplete?.()
          })
        })
      } else {
        animate(0, () => {
          if (!visibleRef.current) {
            if (unmountOnHide) setShouldRender(false)
            onFadeOutComplete?.()
          }
        })
      }
    }, [visible, animate, unmountOnHide, onFadeInComplete, onFadeOutComplete])

    if (!shouldRender && unmountOnHide) {
      return null
    }

    return (
      <Animated.View ref={ref} style={[style, animatedStyle]} {...props}>
        {children}
      </Animated.View>
    )
  }
)

FadeTransition.displayName = 'FadeTransition'
