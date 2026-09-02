import { useState, useEffect } from 'react'
import type { UseSidebarState } from './useSidebarState'

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

// Reaching `window.localStorage` was already guarded, but reading and writing
// through it were not -- and those are the calls that actually throw. Safari in
// private mode, an iframe with third-party cookies blocked, and a full quota
// all hand back a real Storage object whose getItem/setItem raise
// SecurityError or QuotaExceededError. The read sits in a useState
// initializer, so the throw propagated out of render and took down every page
// that mounts a sidebar. A sidebar that cannot remember whether it was
// collapsed is a small loss; one that crashes the page around it is not.
function readCollapsed(storageKey: string): string | null {
  try {
    return safeLocalStorage()?.getItem(storageKey) ?? null
  } catch {
    return null
  }
}

function writeCollapsed(storageKey: string, value: string): void {
  try {
    safeLocalStorage()?.setItem(storageKey, value)
  } catch {
    // Persistence is best-effort; see above.
  }
}

export const useSidebarState: UseSidebarState = ({
  storageKey,
  defaultCollapsed = false,
  disablePersistence = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (disablePersistence) return defaultCollapsed
    const stored = readCollapsed(storageKey)
    return stored !== null ? stored === 'true' : defaultCollapsed
  })

  useEffect(() => {
    if (disablePersistence) return
    writeCollapsed(storageKey, String(collapsed))
  }, [collapsed, storageKey, disablePersistence])

  return [collapsed, setCollapsed]
}
