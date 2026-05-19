/**
 * useSidebarState hook
 * Manages sidebar collapsed state with persistence.
 *
 * Web: persists via `localStorage` (synchronous; initial render reflects
 *   stored value).
 * Native: persists via `AsyncStorage` (async; first render shows the
 *   default, then hydrates).
 *
 * The Metro-resolved `.web.ts` / `.native.ts` variants own the storage
 * implementation. This file only defines the shared shape.
 */

import { useState } from 'react'

export interface UseSidebarStateOptions {
  /**
   * Storage key for persistence.
   */
  storageKey: string

  /**
   * Default collapsed state.
   * @default false
   */
  defaultCollapsed?: boolean

  /**
   * Disable persistence — useful for tests and stories.
   * @default false
   */
  disablePersistence?: boolean
}

export type UseSidebarState = (
  options: UseSidebarStateOptions
) => [boolean, (collapsed: boolean) => void]

// Default (no persistence). The .web.ts / .native.ts variants override this.
export const useSidebarState: UseSidebarState = ({ defaultCollapsed = false }) => {
  return useState<boolean>(defaultCollapsed)
}
