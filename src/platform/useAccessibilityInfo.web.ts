import { useState, useEffect } from 'react'
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
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)')
    const invertQuery = window.matchMedia('(inverted-colors: inverted)')

    const update = () => {
      setState({
        isScreenReaderEnabled: false, // not detectable on web
        isBoldTextEnabled: false, // not detectable on web
        isReduceMotionEnabled: motionQuery.matches,
        isReduceTransparencyEnabled: transparencyQuery.matches,
        isGrayscaleEnabled: false, // not detectable on web
        isInvertColorsEnabled: invertQuery.matches,
      })
    }

    update()
    motionQuery.addEventListener?.('change', update)
    transparencyQuery.addEventListener?.('change', update)
    invertQuery.addEventListener?.('change', update)

    return () => {
      motionQuery.removeEventListener?.('change', update)
      transparencyQuery.removeEventListener?.('change', update)
      invertQuery.removeEventListener?.('change', update)
    }
  }, [])

  return state
}
