/**
 * AnimatedView component
 * Thin wrapper around React Native's `Animated.View`.
 *
 * Previous versions of this file branched on whether Reanimated was loaded
 * and accepted `layout` / `entering` / `exiting` props. Reanimated has been
 * removed; consumers that need mount/unmount animations should use the
 * `FadeTransition` / `ScaleTransition` / `SlideTransition` components, and
 * layout-change animations should call `useLayoutAnimation()` before the
 * state update.
 *
 * @example
 * ```tsx
 * import { AnimatedView } from '@scaffald/ui'
 * import { Animated } from 'react-native'
 *
 * function MyComponent() {
 *   const opacity = useRef(new Animated.Value(0)).current
 *   useEffect(() => {
 *     Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start()
 *   }, [opacity])
 *
 *   return (
 *     <AnimatedView style={{ opacity }}>
 *       <Text>Fading content</Text>
 *     </AnimatedView>
 *   )
 * }
 * ```
 */

import { forwardRef } from 'react'
import { Animated, View, type ViewProps } from 'react-native'

export interface AnimatedViewProps extends ViewProps {
  /**
   * When true, renders a plain `View` instead of `Animated.View`. Useful when
   * you want to opt out of the native-driver wrapper for performance or to
   * sidestep RN's restrictions on what props can be animated.
   * @default false
   */
  disableAnimation?: boolean
}

export const AnimatedView = forwardRef<View, AnimatedViewProps>(
  function AnimatedView({ disableAnimation = false, ...props }, ref) {
    if (disableAnimation) {
      return <View ref={ref} {...props} />
    }
    return <Animated.View ref={ref} {...props} />
  }
)

AnimatedView.displayName = 'AnimatedView'

/**
 * Kept for backwards compatibility with the previous Reanimated-aware API.
 * Always returns `true` now — animations are built on the React Native
 * `Animated` module, which ships with RN itself.
 *
 * @deprecated Animations now always work; this check is unnecessary.
 */
export function isReanimatedAvailable(): boolean {
  return true
}
