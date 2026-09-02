/**
 * useResponsive hook tests
 *
 * These tests were written against an older per-instance implementation that
 * read `window.innerWidth` on every render, so they replaced `global.window`
 * with a plain object and assigned `innerWidth` before rendering.
 *
 * `useResponsive` no longer works that way. It is backed by a module-level
 * singleton store (one shared resize listener for every Box/Stack/Grid in the
 * tree -- see the hook for why), which reads the viewport once at import and
 * thereafter only when a `resize` event fires. It also reads
 * `document.documentElement.clientWidth` rather than `innerWidth`, so that it
 * excludes the scrollbar and agrees with CSS media queries.
 *
 * Against that implementation the old mock could never work: the replacement
 * window had no `document`, and the store had no reason to re-read anyway
 * because the mocked `addEventListener` never fired anything. Every assertion
 * about a specific width was really asserting against the width jsdom had at
 * import time, which is 0. Nobody noticed because the package's vitest config
 * pointed at a directory that does not exist, so none of these ran (#469).
 *
 * So: drive the real jsdom viewport and dispatch the real event.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react-native'
import { useResponsive } from '../useResponsive'
import { breakpoints } from '../../tokens/breakpoints'

vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native')
  return {
    ...(actual as object),
    Platform: { OS: 'web' },
  }
})

/**
 * Move the viewport and notify the store. Must be called *after* the hook has
 * mounted: the store attaches its listener on the first subscriber, so a
 * resize dispatched before then is not observed by anything.
 */
function setViewport(width: number, height = 768): void {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: width,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true })
  window.dispatchEvent(new Event('resize'))
}

/** Mount the hook, then settle it at `width`. */
function renderAt(width: number) {
  const rendered = renderHook(() => useResponsive())
  act(() => {
    setViewport(width)
  })
  return rendered
}

describe('useResponsive', () => {
  beforeEach(() => {
    setViewport(1024)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Properties', () => {
    it('should return width and height', () => {
      const { result } = renderAt(1024)

      expect(result.current.width).toBe(1024)
      expect(result.current.height).toBe(768)
    })

    it('should return breakpoint name', () => {
      const { result } = renderAt(1024)

      expect(['base', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']).toContain(result.current.breakpoint)
    })

    it('should return boolean device type flags', () => {
      const { result } = renderAt(1024)

      expect(typeof result.current.isMobile).toBe('boolean')
      expect(typeof result.current.isTablet).toBe('boolean')
      expect(typeof result.current.isDesktop).toBe('boolean')
    })

    it('should track the viewport as it changes', () => {
      const { result } = renderAt(400)
      expect(result.current.width).toBe(400)

      act(() => {
        setViewport(breakpoints.lg)
      })
      expect(result.current.width).toBe(breakpoints.lg)
    })
  })

  describe('select function', () => {
    it('should return base value when no breakpoint matches', () => {
      const { result } = renderAt(300)

      expect(result.current.select({ base: 'base-value', md: 'md-value' })).toBe('base-value')
    })

    it('should return correct breakpoint value', () => {
      const { result } = renderAt(breakpoints.md + 100)

      expect(result.current.select({ base: 8, sm: 16, md: 24, lg: 32 })).toBe(24)
    })

    it('should inherit from lower breakpoints when not specified', () => {
      const { result } = renderAt(breakpoints.lg)

      const value = result.current.select({
        base: 'base',
        sm: 'sm',
        // md not specified, should use sm
        // lg not specified, should use sm
      })

      expect(value).toBe('sm')
    })
  })

  describe('atLeast function', () => {
    it('should return true when width >= breakpoint', () => {
      const { result } = renderAt(breakpoints.md)

      expect(result.current.atLeast('sm')).toBe(true)
      expect(result.current.atLeast('md')).toBe(true)
    })

    it('should return false when width < breakpoint', () => {
      const { result } = renderAt(breakpoints.sm - 1)

      expect(result.current.atLeast('md')).toBe(false)
    })
  })

  describe('below function', () => {
    it('should return true when width < breakpoint', () => {
      const { result } = renderAt(breakpoints.sm - 1)

      expect(result.current.below('sm')).toBe(true)
    })

    it('should return false when width >= breakpoint', () => {
      const { result } = renderAt(breakpoints.md)

      expect(result.current.below('sm')).toBe(false)
    })
  })

  describe('Device Type Detection', () => {
    it('should detect mobile correctly', () => {
      const { result } = renderAt(breakpoints.sm - 1)

      expect(result.current.isMobile).toBe(true)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(false)
    })

    it('should detect tablet correctly', () => {
      const { result } = renderAt(breakpoints.sm + 50)

      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(true)
      expect(result.current.isDesktop).toBe(false)
    })

    it('should detect desktop correctly', () => {
      const { result } = renderAt(breakpoints.lg + 100)

      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(true)
    })
  })

  describe('Web Platform', () => {
    it('should add resize event listener on web', () => {
      const addSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useResponsive())

      expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      addSpy.mockRestore()
    })

    it('should remove resize event listener on unmount', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useResponsive())
      unmount()

      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      removeSpy.mockRestore()
    })
  })
})
