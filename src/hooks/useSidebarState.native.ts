import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react'
import type { UseSidebarState } from './useSidebarState'

export const useSidebarState: UseSidebarState = ({
  storageKey,
  defaultCollapsed = false,
  disablePersistence = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed)
  const hydratedRef = useRef(false)

  // Hydrate from AsyncStorage on mount.
  useEffect(() => {
    if (disablePersistence) {
      hydratedRef.current = true
      return
    }
    let cancelled = false
    void AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (!cancelled && value !== null) {
          setCollapsed(value === 'true')
        }
      })
      .catch(() => {
        // ignore storage errors
      })
      .finally(() => {
        hydratedRef.current = true
      })

    return () => {
      cancelled = true
    }
  }, [storageKey, disablePersistence])

  // Persist changes after hydration so the initial default doesn't overwrite stored value.
  useEffect(() => {
    if (disablePersistence || !hydratedRef.current) return
    void AsyncStorage.setItem(storageKey, String(collapsed)).catch(() => {
      // ignore storage errors
    })
  }, [collapsed, storageKey, disablePersistence])

  return [collapsed, setCollapsed]
}
