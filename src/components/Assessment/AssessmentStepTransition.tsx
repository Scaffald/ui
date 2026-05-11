/**
 * AssessmentStepTransition - Animated wrapper for assessment step transitions.
 *
 * Slides content out then in when the step key changes, driven by vanilla
 * `Animated` on the native driver. Falls back to instant swap when reduced
 * motion is preferred.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Animated,
  Easing,
  View,
  type ViewStyle,
} from 'react-native'
import { useReducedMotion } from '../../animation/useReducedMotion'
import { timingConfigs } from '../../animation/presets'

export interface AssessmentStepTransitionProps {
  /**
   * Key that identifies the current step. Transition triggers when this changes.
   */
  stepKey: string

  /**
   * Slide direction: 1 = forward (slide left), -1 = backward (slide right)
   * @default 1
   */
  direction?: 1 | -1

  /**
   * Slide distance in pixels.
   * @default 40
   */
  distance?: number

  /** Children to render. */
  children: ReactNode

  /** Additional container styles. */
  style?: ViewStyle
}

export function AssessmentStepTransition({
  stepKey,
  direction = 1,
  distance = 40,
  children,
  style,
}: AssessmentStepTransitionProps) {
  const prefersReducedMotion = useReducedMotion()
  const prevKeyRef = useRef(stepKey)
  const isFirstRender = useRef(true)

  const translateX = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current
  const [displayKey, setDisplayKey] = useState(stepKey)
  const [displayChildren, setDisplayChildren] = useState(children)
  const pendingStepKeyRef = useRef<string | null>(null)
  const exitAnimRef = useRef<Animated.CompositeAnimation | null>(null)
  const enterAnimRef = useRef<Animated.CompositeAnimation | null>(null)

  const durationMs = timingConfigs.normal.duration

  // biome-ignore lint/correctness/useExhaustiveDependencies: transition should only trigger on stepKey change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevKeyRef.current = stepKey
      return
    }

    if (stepKey === prevKeyRef.current) {
      setDisplayChildren(children)
      return
    }

    // Cancel any in-flight transition before starting a new one.
    exitAnimRef.current?.stop()
    enterAnimRef.current?.stop()

    if (prefersReducedMotion) {
      setDisplayKey(stepKey)
      setDisplayChildren(children)
      prevKeyRef.current = stepKey
      translateX.setValue(0)
      opacity.setValue(1)
      return
    }

    const dir = direction ?? 1
    pendingStepKeyRef.current = stepKey
    const exitDuration = durationMs * 0.4
    const enterDuration = durationMs * 0.6

    const exit = Animated.parallel([
      Animated.timing(translateX, {
        toValue: -dir * distance,
        duration: exitDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: exitDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ])

    exitAnimRef.current = exit
    exit.start(({ finished }) => {
      if (!finished) return
      if (pendingStepKeyRef.current !== stepKey) return

      setDisplayKey(stepKey)
      setDisplayChildren(children)
      prevKeyRef.current = stepKey

      // Jump to offset, then animate to 0.
      translateX.setValue(dir * distance)
      opacity.setValue(0)

      const enter = Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: enterDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: enterDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
      enterAnimRef.current = enter
      enter.start()
    })

    return () => {
      exitAnimRef.current?.stop()
      enterAnimRef.current?.stop()
    }
  }, [stepKey])

  // Update children if step hasn't changed (e.g., state updates within step).
  useEffect(() => {
    if (stepKey === displayKey) {
      setDisplayChildren(children)
    }
  }, [children, stepKey, displayKey])

  if (prefersReducedMotion) {
    return <View style={style}>{children}</View>
  }

  const animatedStyle = {
    transform: [{ translateX }],
    opacity,
  }

  return (
    <Animated.View style={[style, animatedStyle]} key={displayKey}>
      {displayChildren}
    </Animated.View>
  )
}
