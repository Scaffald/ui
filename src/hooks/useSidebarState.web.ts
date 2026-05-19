import { useState, useEffect } from 'react'
import type { UseSidebarState } from './useSidebarState'

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export const useSidebarState: UseSidebarState = ({
  storageKey,
  defaultCollapsed = false,
  disablePersistence = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (disablePersistence) return defaultCollapsed
    const stored = safeLocalStorage()?.getItem(storageKey)
    return stored !== null && stored !== undefined ? stored === 'true' : defaultCollapsed
  })

  useEffect(() => {
    if (disablePersistence) return
    safeLocalStorage()?.setItem(storageKey, String(collapsed))
  }, [collapsed, storageKey, disablePersistence])

  return [collapsed, setCollapsed]
}
