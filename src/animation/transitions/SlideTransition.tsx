/**
 * SlideTransition component
 * Slide in/out from a direction on mount/unmount, powered by vanilla `Animated`.
 *
 * @example
 * ```tsx
 * <SlideTransition visible={visible} direction="up" distance={300}>
 *   <View style={styles.sheet}>
 *     <Text>Sheet content</Text>
 *   </View>
 * </SlideTransition>
 * ```
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Animated, Easing, View, type ViewProps, type ViewStyle } from 'react-native'
import {
  springConfigs,
  timingConfigs,
  type SpringConfigKey,
  type TimingConfigKey,
} from '../presets'
import { useReducedMotion } from '../useReducedMotion'

export type SlideDirection = 'up' | 'down' | 'left' | 'right'
export type SlideAnimationType = 'spring' | 'timing'

export interface SlideTransitionProps extends Omit<ViewProps, 'style'> {
  /** Whether the content is visible. */
  visible: boolean
  /** Direction to slide from. @default 'up' */
  direction?: SlideDirection
  /** Distance to slide in pixels. @default 100 */
  distance?: number
  /** Animation type. @default 'spring' */
  animationType?: SlideAnimationType
  /** Spring config preset (when animationType is 'spring'). @default 'snappy' */
  springConfig?: SpringConfigKey
  /** Duration preset (when animationType is 'timing'). @default 'normal' */
  duration?: TimingConfigKey | number
  /** Whether to include fade with slide. @default true */
  withFade?: boolean
  /** Whether to unmount content when not visible. @default true */
  unmountOnHide?: boolean
  /** Callback when slide-in animation completes. */
  onSlideInComplete?: () => void
  /** Callback when slide-out animation completes. */
  onSlideOutComplete?: () => void
  /** Style for the container. */
  style?: ViewStyle
  /** Children to render. */
  children: React.ReactNode
}

function resolveDurationMs(duration: TimingConfigKey | number): number {
  if (typeof duration === 'number') return duration
  return timingConfigs[duration]?.duration ?? 300
}

export const SlideTransition = forwardRef<View, SlideTransitionProps>(
  function SlideTransition(
    {
      visible,
      direction = 'up',
      distance = 100,
      animationType = 'spring',
      springConfig = 'snappy',
      duration = 'normal',
      withFade = true,
      unmountOnHide = true,
      onSlideInComplete,
      onSlideOutComplete,
      style,
      children,
      ...props
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion()
    const [shouldRender, setShouldRender] = useState(visible)

    const isVertical = direction === 'up' || direction === 'down'
    const isPositive = direction === 'up' || direction === 'left'
    const startValue = isPositive ? distance : -distance

    const translate = useRef(new Animated.Value(visible ? 0 : startValue)).current
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current

    const spring = springConfigs[springConfig]
    const durationMs = resolveDurationMs(duration)

    const visibleRef = useRef(visible)
    visibleRef.current = visible

    useEffect(() => {
      if (prefersReducedMotion) {
        translate.setValue(visible ? 0 : startValue)
        opacity.setValue(visible ? 1 : 0)
        if (visible) {
          setShouldRender(true)
          onSlideInComplete?.()
        } else {
          if (unmountOnHide) setShouldRender(false)
          onSlideOutComplete?.()
        }
        return
      }

      const buildAnim = (target: Animated.Value, toValue: number): Animated.CompositeAnimation => {
        if (animationType === 'spring') {
          return Animated.spring(target, {
            toValue,
            damping: spring.damping,
            stiffness: spring.stiffness,
            mass: spring.mass,
            useNativeDriver: true,
          })
        }
        return Animated.timing(target, {
          toValue,
          duration: durationMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      }

      if (visible) {
        setShouldRender(true)
        requestAnimationFrame(() => {
          const anims = [buildAnim(translate, 0)]
          if (withFade) anims.push(buildAnim(opacity, 1))
          Animated.parallel(anims).start(({ finished }) => {
            if (finished && visibleRef.current) onSlideInComplete?.()
          })
        })
      } else {
        const anims = [buildAnim(translate, startValue)]
        if (withFade) anims.push(buildAnim(opacity, 0))
        Animated.parallel(anims).start(({ finished }) => {
          if (finished && !visibleRef.current) {
            if (unmountOnHide) setShouldRender(false)
            onSlideOutComplete?.()
          }
        })
      }
    }, [
      visible,
      startValue,
      animationType,
      durationMs,
      withFade,
      unmountOnHide,
      onSlideInComplete,
      onSlideOutComplete,
      translate,
      opacity,
      spring,
      prefersReducedMotion,
    ])

    if (!shouldRender && unmountOnHide) {
      return null
    }

    const transform = isVertical
      ? [{ translateY: translate }]
      : [{ translateX: translate }]

    const animatedStyle: ViewStyle = {
      transform,
      ...(withFade ? { opacity } : {}),
    } as unknown as ViewStyle

    return (
      <Animated.View ref={ref} style={[style, animatedStyle]} {...props}>
        {children}
      </Animated.View>
    )
  }
)

SlideTransition.displayName = 'SlideTransition'
