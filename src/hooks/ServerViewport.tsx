import { createContext, type ReactNode, useContext, useMemo } from 'react'

export type ServerViewport = { readonly width: number; readonly height: number }

/**
 * What the server (and the client's hydration render) assumes the viewport is.
 *
 * `useResponsive` cannot measure a window on the server, so it renders every
 * page against a fixed snapshot. Left at the default, that snapshot is a
 * 1280×900 desktop for every visitor — and on a phone the whole page re-lays
 * out the moment hydration finishes and the real width arrives: the desktop
 * chrome disappears, everything below it moves (CLS ≈ 1 on every
 * server-rendered page at phone width), and because the tree changed shape
 * during hydration React throws the server tree away and regenerates it.
 *
 * Wrap the app in `ServerViewportProvider` with a snapshot chosen per request
 * (a phone snapshot for a phone user agent) and the server renders the layout
 * the device will use. React also uses the server snapshot for the hydration
 * render, so the first client render still matches the server; only after
 * hydration does the store's measured width take over.
 *
 * Default stays 1280×900, so nothing changes for callers that do not provide.
 */
export const DEFAULT_SERVER_VIEWPORT: ServerViewport = { width: 1280, height: 900 }

const ServerViewportContext = createContext<ServerViewport>(DEFAULT_SERVER_VIEWPORT)

export type ServerViewportProviderProps = {
  /** The snapshot to render against on the server and during hydration. */
  viewport: ServerViewport | undefined
  children: ReactNode
}

export function ServerViewportProvider({ viewport, children }: ServerViewportProviderProps) {
  // Stable identity: `useSyncExternalStore` compares snapshots by reference,
  // so a fresh object on every render would read as a changed snapshot.
  const width = viewport?.width
  const height = viewport?.height
  const value = useMemo<ServerViewport>(
    () => (width !== undefined && height !== undefined ? { width, height } : DEFAULT_SERVER_VIEWPORT),
    [width, height]
  )
  return <ServerViewportContext.Provider value={value}>{children}</ServerViewportContext.Provider>
}

/** The snapshot `useResponsive` hands to `useSyncExternalStore` as `getServerSnapshot`. */
export function useServerViewport(): ServerViewport {
  return useContext(ServerViewportContext)
}
