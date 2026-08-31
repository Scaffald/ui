/**
 * useResponsive hook
 * Provides responsive utilities for adapting layout based on screen size
 *
 * @example
 * ```tsx
 * import { useResponsive } from '@scaffald/ui'
 *
 * function MyComponent() {
 *   const { breakpoint, isMobile, isDesktop, select } = useResponsive()
 *
 *   // Use current breakpoint
 *   console.log(breakpoint) // 'md'
 *
 *   // Boolean checks
 *   if (isMobile) return <MobileLayout />
 *
 *   // Select value based on breakpoint
 *   const padding = select({
 *     base: 8,
 *     sm: 16,
 *     md: 24,
 *     lg: 32,
 *   })
 *
 *   return <Box padding={padding}>...</Box>
 * }
 * ```
 */

import { useSyncExternalStore, useCallback } from 'react'
import { Platform, Dimensions } from 'react-native'
import { breakpoints, getCurrentBreakpoint, type Breakpoint } from '../tokens/breakpoints'

/**
 * Responsive value map - specify values for different breakpoints
 * Values are inherited upward (base -> xs -> sm -> md -> lg -> xl -> xxl)
 */
export type ResponsiveValue<T> = {
  /** Base value (smallest screens, below xs) */
  base?: T
  /** Extra small screens (660px+) */
  xs?: T
  /** Small screens (800px+) */
  sm?: T
  /** Medium screens (1020px+) */
  md?: T
  /** Large screens (1280px+) */
  lg?: T
  /** Extra large screens (1420px+) */
  xl?: T
  /** Extra extra large screens (1600px+) */
  xxl?: T
}

/**
 * Responsive hook return type
 */
export interface UseResponsiveReturn {
  /** Current screen width */
  width: number
  /** Current screen height */
  height: number
  /** Current breakpoint name */
  breakpoint: Breakpoint | 'base'
  /** True if screen is below sm breakpoint (mobile) */
  isMobile: boolean
  /** True if screen is between sm and lg breakpoints (tablet) */
  isTablet: boolean
  /** True if screen is lg or above (desktop) */
  isDesktop: boolean
  /**
   * Select a value based on current breakpoint
   * Values inherit upward: base -> xs -> sm -> md -> lg -> xl -> xxl
   */
  select: <T>(values: ResponsiveValue<T>) => T | undefined
  /**
   * Check if current screen matches or exceeds a breakpoint
   */
  atLeast: (bp: Breakpoint) => boolean
  /**
   * Check if current screen is below a breakpoint
   */
  below: (bp: Breakpoint) => boolean
}

// ── Shared snapshot type ──────────────────────────────────────────────────────

type Snapshot = { readonly width: number; readonly height: number }

// ── Web singleton store ───────────────────────────────────────────────────────
// One module-level store means ONE resize listener shared across ALL
// useResponsive() instances. This prevents the per-instance useState/useEffect
// cascade that triggers React's "Maximum update depth exceeded" error when
// many Box/Stack/Grid components are mounted simultaneously.

let _webSnapshot: Snapshot = { width: 0, height: 0 }
const _webListeners = new Set<() => void>()

function _readWebDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') return { width: 1280, height: 900 }
  if (window.visualViewport) {
    return {
      width: Math.round(window.visualViewport.width * window.visualViewport.scale),
      height: Math.round(window.visualViewport.height * window.visualViewport.scale),
    }
  }
  return {
    width: window.document.documentElement.clientWidth,
    height: window.innerHeight,
  }
}

function _updateWebStore() {
  const { width, height } = _readWebDimensions()
  if (width !== _webSnapshot.width || height !== _webSnapshot.height) {
    _webSnapshot = { width, height }
    _webListeners.forEach((fn) => {
      fn()
    })
  }
}

function _subscribeWeb(listener: () => void): () => void {
  if (_webListeners.size === 0 && typeof window !== 'undefined') {
    // Attach the single shared listener only on first subscriber
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', _updateWebStore)
    } else {
      window.addEventListener('resize', _updateWebStore)
    }
  }
  _webListeners.add(listener)
  return () => {
    _webListeners.delete(listener)
    if (_webListeners.size === 0 && typeof window !== 'undefined') {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', _updateWebStore)
      } else {
        window.removeEventListener('resize', _updateWebStore)
      }
    }
  }
}

function _getWebSnapshot(): Snapshot {
  return _webSnapshot
}

/**
 * Server snapshot. Must be a stable reference, not a fresh object.
 *
 * Returning `{ width: 1280, height: 900 }` from here allocated a new object on
 * every call, so React saw the snapshot change on every read and warned "The
 * result of getServerSnapshot should be cached to avoid an infinite loop" —
 * repeatedly, because useResponsive backs Box/Stack/Grid and so runs many times
 * per SSR page. Hoisting it makes the identity stable.
 */
const _SERVER_SNAPSHOT: Snapshot = { width: 1280, height: 900 }

function _getServerSnapshot(): Snapshot {
  return _SERVER_SNAPSHOT
}

// Initialize web store immediately on module load
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const initial = _readWebDimensions()
  _webSnapshot = initial
}

// ── Native singleton store ────────────────────────────────────────────────────

let _nativeSnapshot: Snapshot = (() => {
  if (Platform.OS !== 'web') {
    const d = Dimensions.get('window')
    return { width: d.width, height: d.height }
  }
  return { width: 0, height: 0 }
})()

const _nativeListeners = new Set<() => void>()
let _nativeSubscription: ReturnType<typeof Dimensions.addEventListener> | null = null

function _subscribeNative(listener: () => void): () => void {
  if (_nativeListeners.size === 0) {
    _nativeSubscription = Dimensions.addEventListener('change', ({ window: w }) => {
      if (w.width !== _nativeSnapshot.width || w.height !== _nativeSnapshot.height) {
        _nativeSnapshot = { width: w.width, height: w.height }
        _nativeListeners.forEach((fn) => {
          fn()
        })
      }
    })
  }
  _nativeListeners.add(listener)
  return () => {
    _nativeListeners.delete(listener)
    if (_nativeListeners.size === 0 && _nativeSubscription) {
      _nativeSubscription.remove()
      _nativeSubscription = null
    }
  }
}

function _getNativeSnapshot(): Snapshot {
  return _nativeSnapshot
}

// ── Platform-selected store (stable module-level references) ─────────────────

const _subscribe = Platform.OS === 'web' ? _subscribeWeb : _subscribeNative
const _getSnapshot = Platform.OS === 'web' ? _getWebSnapshot : _getNativeSnapshot

// ── Breakpoint helpers ────────────────────────────────────────────────────────

function selectValue<T>(values: ResponsiveValue<T>, width: number): T | undefined {
  const order: (keyof ResponsiveValue<T>)[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'base']
  for (const bp of order) {
    if (values[bp] !== undefined) {
      if (bp === 'base') return values[bp]
      if (width >= breakpoints[bp as Breakpoint]) return values[bp]
    }
  }
  return values.base
}

/**
 * Hook for responsive design utilities.
 *
 * Uses a module-level singleton store (not per-instance useState) so that all
 * components share ONE resize event listener. This prevents the cascading
 * setState pattern that exhausts React's nested-update limit when many layout
 * primitives (Box/Stack/Grid) are mounted in the same tree.
 */
export function useResponsive(): UseResponsiveReturn {
  const { width, height } = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot)

  const breakpoint = width >= breakpoints.xs ? getCurrentBreakpoint(width) : 'base'
  const isMobile = width < breakpoints.sm
  const isTablet = width >= breakpoints.sm && width < breakpoints.lg
  const isDesktop = width >= breakpoints.lg

  const select = useCallback(
    <T>(values: ResponsiveValue<T>): T | undefined => selectValue(values, width),
    [width]
  )

  const atLeast = useCallback((bp: Breakpoint): boolean => width >= breakpoints[bp], [width])

  const below = useCallback((bp: Breakpoint): boolean => width < breakpoints[bp], [width])

  return { width, height, breakpoint, isMobile, isTablet, isDesktop, select, atLeast, below }
}

/**
 * Drop-in replacement for react-native's `useWindowDimensions`, backed by the
 * same store as `useResponsive` — and therefore hydration-safe.
 *
 * ─── Why this exists ───────────────────────────────────────────────────────
 *
 * The previous implementation was a bare `export { useWindowDimensions } from
 * 'react-native'`. React Native Web reads `Dimensions` directly, with no
 * `getServerSnapshot`, so an SSR page renders at the server's idea of the
 * viewport and the client's hydration pass renders at the real one. Any style
 * derived from the width then differs, React throws the whole tree away, and
 * the page is re-rendered on the client — the entire cost of SSR paid and then
 * discarded (#625).
 *
 * That is what was happening in the app shell: `DrawerContent` computed
 * `isSmall = width < 1024` from this hook, and React reported the mismatch on
 * the `flex: 1, width: '100%'` div it wraps. It only showed on authenticated
 * pages because the drawer is the thing auth gates — the cause was never auth
 * itself, which is what #625 originally blamed.
 *
 * `useSyncExternalStore` uses `getServerSnapshot` for BOTH the server render
 * and the client's hydration render, then switches to the live snapshot. So
 * the first paint agrees by construction, and the real viewport arrives as an
 * ordinary state update instead of a hydration failure.
 *
 * `scale` and `fontScale` still come from `Dimensions`: they do not vary
 * between server and client in a way that moves layout, and nothing in this
 * codebase branches on them.
 */
export function useWindowDimensions(): {
  width: number
  height: number
  scale: number
  fontScale: number
} {
  const { width, height } = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot)
  const { scale, fontScale } = Dimensions.get('window')
  return { width, height, scale, fontScale }
}

export type { Breakpoint }
