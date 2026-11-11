/**
 * AnchoredOverlay — a menu that hangs off an anchor (an input, a trigger) and
 * always draws above the page.
 *
 * Why it exists (Scaffald/SaaS#1330): an inline `position: absolute; top: 100%`
 * menu can't escape React Native Web's stacking contexts — every RNW view is
 * `position: relative; z-index: 0`, so a menu's z-index only competes inside its
 * immediate parent — and a `Card` ancestor's `overflow: hidden` clips it.
 *
 * - **Web:** the overlay is portalled to `document.body` and drawn
 *   `position: fixed` from the anchor's `getBoundingClientRect()`. It re-measures
 *   on scroll (capture phase, so inner ScrollViews count), on resize, and when
 *   the anchor or the overlay changes size. It flips above the anchor when there
 *   isn't room below and there is more room above, and clamps its `maxHeight` to
 *   the space available. It never takes focus: a mousedown inside it is
 *   prevented, so typing continues in the input and the input does not blur
 *   when a row is clicked. A pointerdown outside both the anchor and the overlay,
 *   or Escape, calls `onRequestClose`.
 * - **Native:** rendered inline, absolutely positioned at `top: '100%'` of its
 *   parent, as menus were before. Put it inside the `position: relative`
 *   container that wraps the anchor. Stacking on native is out of scope here;
 *   close on blur as before.
 *
 * @example
 * ```tsx
 * const anchorRef = useRef<View>(null)
 * const nav = useListboxNavigation({ id: 'city-results', itemCount: results.length, open, ... })
 *
 * <View ref={anchorRef} style={{ position: 'relative' }}>
 *   <Input value={q} onChangeText={setQ} {...nav.inputProps} />
 *   <AnchoredOverlay anchorRef={anchorRef} open={open} onRequestClose={close} {...nav.listboxProps}>
 *     {results.map((r, i) => (
 *       <Pressable key={r.id} onPress={() => pick(r)} {...nav.getOptionProps(i)}>…</Pressable>
 *     ))}
 *   </AnchoredOverlay>
 * </View>
 * ```
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import { Platform } from '../../platform/Platform'
import { useThemeContext } from '../../theme'
import { borderWidth } from '../../tokens/borders'
import { getMenuSurfaceStyle } from './menuSurface'
import {
  computeAnchoredPlacement,
  placementsEqual,
  type AnchoredPlacement,
  type PlacementSide,
} from './placement'

/** Above everything else on the page, as AddressAutocomplete's portal always was. */
export const ANCHORED_OVERLAY_Z_INDEX = 2147483647

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function getCreatePortal(): typeof import('react-dom').createPortal | null {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return null
  try {
    // Lazy require so native bundles never pull in react-dom.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-dom').createPortal
  } catch {
    return null
  }
}

/** Something whose `.current` is the anchor: on web a View ref is its DOM node. */
type AnchorRef = RefObject<unknown>

function asElement(node: unknown): HTMLElement | null {
  if (!node || typeof (node as HTMLElement).getBoundingClientRect !== 'function') return null
  return node as HTMLElement
}

export interface AnchoredOverlayRenderInfo {
  /** The overlay's current max height (clamped to the space available on web). */
  maxHeight: number
  side: PlacementSide
}

export interface AnchoredOverlayProps {
  /** Ref to the anchor — usually a View wrapping the input or trigger. */
  anchorRef: AnchorRef
  open: boolean
  /** Called on a pointerdown outside the anchor and the overlay, and on Escape (web). */
  onRequestClose?: () => void
  children?: ReactNode | ((info: AnchoredOverlayRenderInfo) => ReactNode)
  /** The tallest the overlay may be. Default 300. */
  maxHeight?: number
  /** Gap between the anchor and the overlay. Default 4. */
  offset?: number
  /** Space kept clear at the viewport edge (web). Default 8. */
  viewportMargin?: number
  /** Wrap children in a ScrollView capped at the overlay's height. Default true. */
  scrollable?: boolean
  /** Draw the shared menu surface (background, border, shadow). Default true. */
  surface?: boolean
  /** Prevent mousedown inside the overlay from moving focus out of the input (web). Default true. */
  preventFocusSteal?: boolean
  /** Extra style for the overlay container. Position and size are owned by the overlay. */
  style?: StyleProp<ViewStyle>
  /** DOM id — point the input's `aria-controls` at it. */
  id?: string
  /** Usually `"listbox"`. */
  role?: 'listbox' | 'menu' | 'dialog' | 'list'
  'aria-label'?: string
  testID?: string
  zIndex?: number
}

export function AnchoredOverlay({
  anchorRef,
  open,
  onRequestClose,
  children,
  maxHeight = 300,
  offset = 4,
  viewportMargin = 8,
  scrollable = true,
  surface = true,
  preventFocusSteal = true,
  style,
  id,
  role,
  'aria-label': ariaLabel,
  testID,
  zIndex = ANCHORED_OVERLAY_Z_INDEX,
}: AnchoredOverlayProps) {
  const { theme } = useThemeContext()
  const overlayRef = useRef<View>(null)
  const [placement, setPlacement] = useState<AnchoredPlacement | null>(null)
  const [offscreen, setOffscreen] = useState(false)
  const placementRef = useRef<AnchoredPlacement | null>(null)
  const onRequestCloseRef = useRef(onRequestClose)
  onRequestCloseRef.current = onRequestClose

  const createPortal = getCreatePortal()
  const isPortal = open && !!createPortal && typeof document !== 'undefined' && !!document.body

  const measure = useCallback(() => {
    const anchorEl = asElement(anchorRef.current)
    if (!anchorEl || typeof window === 'undefined') return
    const rect = anchorEl.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // The overlay's rendered height is its natural height unless the current
    // maxHeight is clipping it; then assume it wants the full maxHeight.
    const overlayEl = asElement(overlayRef.current)
    const rendered = overlayEl?.offsetHeight ?? 0
    const prev = placementRef.current
    let contentHeight: number | undefined
    if (rendered > 0) {
      contentHeight = prev && rendered >= prev.maxHeight - 1 ? maxHeight : rendered
    }

    const next = computeAnchoredPlacement({
      anchor: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width },
      viewportHeight,
      contentHeight,
      maxHeight,
      offset,
      viewportMargin,
    })
    if (!placementsEqual(prev, next)) {
      placementRef.current = next
      setPlacement(next)
    }
    setOffscreen(rect.bottom < 0 || rect.top > viewportHeight)
  }, [anchorRef, maxHeight, offset, viewportMargin])

  // Measure before paint, so the overlay never shows in the wrong place.
  useIsoLayoutEffect(() => {
    if (!isPortal) {
      placementRef.current = null
      setPlacement(null)
      return
    }
    measure()
  }, [isPortal, measure])

  // Follow the anchor: scroll anywhere (capture), resize, and size changes.
  useEffect(() => {
    if (!isPortal) return
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule)
      const anchorEl = asElement(anchorRef.current)
      const overlayEl = asElement(overlayRef.current)
      if (anchorEl) observer.observe(anchorEl)
      if (overlayEl) observer.observe(overlayEl)
    }
    return () => {
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isPortal, measure, anchorRef])

  // Outside pointerdown and Escape close it (web, portalled or not).
  useEffect(() => {
    if (!open || !Platform.isWeb || typeof document === 'undefined') return
    const handlePointerDown = (event: Event) => {
      const target = event.target as Node | null
      if (!target) return
      const anchorEl = asElement(anchorRef.current)
      const overlayEl = asElement(overlayRef.current)
      if (anchorEl?.contains(target) || overlayEl?.contains(target)) return
      onRequestCloseRef.current?.()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onRequestCloseRef.current?.()
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, anchorRef])

  // Never take focus: a mousedown inside the overlay would blur the input.
  useEffect(() => {
    if (!open || !preventFocusSteal || !Platform.isWeb) return
    const overlayEl = asElement(overlayRef.current)
    if (!overlayEl) return
    const prevent = (event: Event) => event.preventDefault()
    overlayEl.addEventListener('mousedown', prevent)
    return () => overlayEl.removeEventListener('mousedown', prevent)
  }, [open, preventFocusSteal])

  if (!open) return null

  const effectiveMaxHeight = isPortal && placement ? placement.maxHeight : maxHeight
  const side: PlacementSide = placement?.side ?? 'below'
  const surfaceStyle = surface ? getMenuSurfaceStyle(theme) : null
  const innerMaxHeight = Math.max(0, effectiveMaxHeight - (surface ? borderWidth.thin * 2 : 0))

  let positionStyle: ViewStyle
  if (isPortal) {
    positionStyle = placement
      ? ({
          position: 'fixed',
          left: placement.left,
          width: placement.width,
          ...(placement.side === 'above'
            ? { bottom: placement.bottom }
            : { top: placement.top }),
          maxHeight: placement.maxHeight,
          zIndex,
          ...(offscreen ? { opacity: 0, pointerEvents: 'none' } : null),
        } as unknown as ViewStyle)
      : // First pass: rendered invisibly so its natural height can be measured.
        ({
          position: 'fixed',
          top: 0,
          left: 0,
          maxHeight,
          zIndex,
          opacity: 0,
          pointerEvents: 'none',
        } as unknown as ViewStyle)
  } else {
    positionStyle = {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: offset,
      maxHeight,
      zIndex,
    }
  }

  const body =
    typeof children === 'function'
      ? children({ maxHeight: innerMaxHeight, side })
      : children

  const content = (
    <View
      ref={overlayRef}
      id={id}
      // RN's Role union has no 'listbox'; React Native Web passes it through to the DOM.
      role={role as ViewProps['role']}
      aria-label={ariaLabel}
      testID={testID}
      collapsable={false}
      style={[surfaceStyle, style, positionStyle]}
    >
      {scrollable ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          style={{ flexGrow: 0, maxHeight: innerMaxHeight }}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  )

  return isPortal && createPortal ? createPortal(content, document.body) : content
}
