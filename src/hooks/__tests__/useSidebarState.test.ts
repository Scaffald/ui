import { renderHook, act } from '@testing-library/react-native'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSidebarState } from '../useSidebarState'

describe('useSidebarState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should default to collapsed = false', () => {
    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar', disablePersistence: true })
    )
    expect(result.current[0]).toBe(false)
  })

  it('should respect defaultCollapsed = true', () => {
    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar', defaultCollapsed: true, disablePersistence: true })
    )
    expect(result.current[0]).toBe(true)
  })

  it('should toggle collapsed state via setter', () => {
    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar', disablePersistence: true })
    )

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1](true)
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1](false)
    })
    expect(result.current[0]).toBe(false)
  })

  it('should persist to localStorage when persistence is enabled', () => {
    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar-persist' })
    )

    act(() => {
      result.current[1](true)
    })

    expect(localStorage.getItem('test-sidebar-persist')).toBe('true')
  })

  it('should read initial value from localStorage', () => {
    localStorage.setItem('test-sidebar-read', 'true')

    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar-read' })
    )

    expect(result.current[0]).toBe(true)
  })

  it('should not persist when disablePersistence is true', () => {
    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar-no-persist', disablePersistence: true })
    )

    act(() => {
      result.current[1](true)
    })

    expect(localStorage.getItem('test-sidebar-no-persist')).toBeNull()
  })

  it('should fall back to defaultCollapsed when localStorage read fails', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() =>
      useSidebarState({ storageKey: 'test-sidebar-error', defaultCollapsed: true })
    )

    expect(result.current[0]).toBe(true)
    getItemSpy.mockRestore()
  })
})
