import { useState, useEffect } from 'react'
import { AccessibilityInfo } from 'react-native'
import type { UseAccessibilityInfo, UseAccessibilityInfoReturn } from './useAccessibilityInfo'

export const useAccessibilityInfo: UseAccessibilityInfo = () => {
  const [state, setState] = useState<UseAccessibilityInfoReturn>({
    isScreenReaderEnabled: false,
    isBoldTextEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isGrayscaleEnabled: false,
    isInvertColorsEnabled: false,
  })

  useEffect(() => {
    let cancelled = false

    void Promise.all([
      AccessibilityInfo.isScreenReaderEnabled(),
      AccessibilityInfo.isBoldTextEnabled?.() ?? Promise.resolve(false),
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isReduceTransparencyEnabled?.() ?? Promise.resolve(false),
      AccessibilityInfo.isGrayscaleEnabled?.() ?? Promise.resolve(false),
      AccessibilityInfo.isInvertColorsEnabled?.() ?? Promise.resolve(false),
    ]).then(
      ([screenReader, boldText, reduceMotion, reduceTransparency, grayscale, invertColors]) => {
        if (cancelled) return
        setState({
          isScreenReaderEnabled: screenReader,
          isBoldTextEnabled: boldText,
          isReduceMotionEnabled: reduceMotion,
          isReduceTransparencyEnabled: reduceTransparency,
          isGrayscaleEnabled: grayscale,
          isInvertColorsEnabled: invertColors,
        })
      }
    )

    const subscriptions = [
      AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isScreenReaderEnabled: isEnabled }))
      }),
      AccessibilityInfo.addEventListener('boldTextChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isBoldTextEnabled: isEnabled }))
      }),
      AccessibilityInfo.addEventListener('reduceMotionChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isReduceMotionEnabled: isEnabled }))
      }),
      AccessibilityInfo.addEventListener('reduceTransparencyChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isReduceTransparencyEnabled: isEnabled }))
      }),
      AccessibilityInfo.addEventListener('grayscaleChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isGrayscaleEnabled: isEnabled }))
      }),
      AccessibilityInfo.addEventListener('invertColorsChanged', (isEnabled) => {
        setState((prev) => ({ ...prev, isInvertColorsEnabled: isEnabled }))
      }),
    ]

    return () => {
      cancelled = true
      for (const subscription of subscriptions) {
        subscription.remove()
      }
    }
  }, [])

  return state
}
