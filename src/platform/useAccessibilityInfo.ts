/**
 * useAccessibilityInfo hook
 * Provides access to native accessibility settings.
 *
 * Web: derived from `prefers-reduced-motion`, `prefers-reduced-transparency`,
 *   and `inverted-colors` media queries. Some flags (screen reader, bold
 *   text, grayscale) are not detectable on web and always report `false`.
 * Native: reads from React Native's `AccessibilityInfo` API and subscribes
 *   to change events.
 *
 * @example
 * ```tsx
 * import { useAccessibilityInfo } from '@scaffald/ui'
 *
 * function MyComponent() {
 *   const { isReduceMotionEnabled } = useAccessibilityInfo()
 *   return isReduceMotionEnabled ? <StaticContent /> : <AnimatedContent />
 * }
 * ```
 */

export interface UseAccessibilityInfoReturn {
  /** Whether a screen reader is currently enabled */
  isScreenReaderEnabled: boolean
  /** Whether bold text is enabled (iOS) */
  isBoldTextEnabled: boolean
  /** Whether reduce motion is enabled */
  isReduceMotionEnabled: boolean
  /** Whether reduce transparency is enabled (iOS) */
  isReduceTransparencyEnabled: boolean
  /** Whether grayscale mode is enabled (Android) */
  isGrayscaleEnabled: boolean
  /** Whether invert colors is enabled (iOS) */
  isInvertColorsEnabled: boolean
}

export type UseAccessibilityInfo = () => UseAccessibilityInfoReturn

const DEFAULT_STATE: UseAccessibilityInfoReturn = {
  isScreenReaderEnabled: false,
  isBoldTextEnabled: false,
  isReduceMotionEnabled: false,
  isReduceTransparencyEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
}

export const useAccessibilityInfo: UseAccessibilityInfo = () => DEFAULT_STATE
