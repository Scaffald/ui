/**
 * ScaleTransition component
 * Scale in/out on mount/unmount, powered by vanilla `Animated`.
 *
 * @example
 * ```tsx
 * <ScaleTransition visible={visible} fromScale={0.9}>
 *   <View style={styles.modal}>
 *     <Text>Modal content</Text>
 *   </View>
 * </ScaleTransition>
 * ```
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Animated, View, type ViewProps, type ViewStyle } from 'react-native'
import { springConfigs, type SpringConfigKey } from '../presets'
import { useReducedMotion } from '../useReducedMotion'

export interface ScaleTransitionProps extends Omit<ViewProps, 'style'> {
  /** Whether the content is visible. */
  visible: boolean
  /** Scale value when hidden. @default 0.9 */
  fromScale?: number
  /** Scale value when visible. @default 1 */
  toScale?: number
  /** Spring config preset. @default 'snappy' */
  springConfig?: SpringConfigKey
  /** Whether to include fade with scale. @default true */
  withFade?: boolean
  /** Whether to unmount content when not visible. @default true */
  unmountOnHide?: boolean
  /** Callback when scale-in animation completes. */
  onScaleInComplete?: () => void
  /** Callback when scale-out animation completes. */
  onScaleOutComplete?: () => void
  /** Style for the container. */
  style?: ViewStyle
  /** Children to render. */
  children: React.ReactNode
}

export const ScaleTransition = forwardRef<View, ScaleTransitionProps>(
  function ScaleTransition(
    {
      visible,
      fromScale = 0.9,
      toScale = 1,
      springConfig = 'snappy',
      withFade = true,
      unmountOnHide = true,
      onScaleInComplete,
      onScaleOutComplete,
      style,
      children,
      ...props
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion()
    const [shouldRender, setShouldRender] = useState(visible)

    const scale = useRef(new Animated.Value(visible ? toScale : fromScale)).current
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current
    const spring = springConfigs[springConfig]

    const visibleRef = useRef(visible)
    visibleRef.current = visible

    useEffect(() => {
      if (prefersReducedMotion) {
        scale.setValue(visible ? toScale : fromScale)
        opacity.setValue(visible ? 1 : 0)
        if (visible) {
          setShouldRender(true)
          onScaleInComplete?.()
        } else {
          if (unmountOnHide) setShouldRender(false)
          onScaleOutComplete?.()
        }
        return
      }

      if (visible) {
        setShouldRender(true)
        requestAnimationFrame(() => {
          const anims: Animated.CompositeAnimation[] = [
            Animated.spring(scale, {
              toValue: toScale,
              damping: spring.damping,
              stiffness: spring.stiffness,
              mass: spring.mass,
              useNativeDriver: true,
            }),
          ]
          if (withFade) {
            anims.push(
              Animated.spring(opacity, {
                toValue: 1,
                damping: spring.damping,
                stiffness: spring.stiffness,
                mass: spring.mass,
                useNativeDriver: true,
              })
            )
          }
          Animated.parallel(anims).start(({ finished }) => {
            if (finished && visibleRef.current) onScaleInComplete?.()
          })
        })
      } else {
        const anims: Animated.CompositeAnimation[] = [
          Animated.spring(scale, {
            toValue: fromScale,
            damping: spring.damping,
            stiffness: spring.stiffness,
            mass: spring.mass,
            useNativeDriver: true,
          }),
        ]
        if (withFade) {
          anims.push(
            Animated.spring(opacity, {
              toValue: 0,
              damping: spring.damping,
              stiffness: spring.stiffness,
              mass: spring.mass,
              useNativeDriver: true,
            })
          )
        }
        Animated.parallel(anims).start(({ finished }) => {
          if (finished && !visibleRef.current) {
            if (unmountOnHide) setShouldRender(false)
            onScaleOutComplete?.()
          }
        })
      }
    }, [
      visible,
      toScale,
      fromScale,
      withFade,
      unmountOnHide,
      onScaleInComplete,
      onScaleOutComplete,
      scale,
      opacity,
      spring,
      prefersReducedMotion,
    ])

    if (!shouldRender && unmountOnHide) {
      return null
    }

    const animatedStyle: ViewStyle = {
      transform: [{ scale }],
      ...(withFade ? { opacity } : {}),
    } as unknown as ViewStyle

    return (
      <Animated.View ref={ref} style={[style, animatedStyle]} {...props}>
        {children}
      </Animated.View>
    )
  }
)

ScaleTransition.displayName = 'ScaleTransition'
