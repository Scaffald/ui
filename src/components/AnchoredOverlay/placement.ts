/**
 * Placement math for AnchoredOverlay — pure, so it can be unit tested without a
 * browser. All values are viewport (CSS pixel) coordinates, as returned by
 * `getBoundingClientRect()`, because the overlay is `position: fixed`.
 */

export interface AnchorRect {
  top: number
  bottom: number
  left: number
  width: number
}

export interface PlacementInput {
  /** The anchor's viewport rect. */
  anchor: AnchorRect
  /** `window.innerHeight`. */
  viewportHeight: number
  /**
   * The height the content wants. Pass the measured natural height when it is
   * known; omit it to assume the content fills `maxHeight`.
   */
  contentHeight?: number
  /** The tallest the overlay may ever be. */
  maxHeight: number
  /** Gap between the anchor and the overlay. */
  offset?: number
  /** Space kept clear at the viewport edge. */
  viewportMargin?: number
}

export type PlacementSide = 'below' | 'above'

export interface AnchoredPlacement {
  side: PlacementSide
  /** Set when `side === 'below'`: CSS `top` for a fixed element. */
  top?: number
  /** Set when `side === 'above'`: CSS `bottom` for a fixed element, so it grows upward. */
  bottom?: number
  left: number
  width: number
  /** `maxHeight` clamped to the space available on the chosen side. */
  maxHeight: number
}

/**
 * Place the overlay below the anchor unless there isn't room for the content
 * there *and* there is more room above, then flip. `maxHeight` is clamped to
 * the space on the chosen side so the overlay never runs off screen.
 */
export function computeAnchoredPlacement({
  anchor,
  viewportHeight,
  contentHeight,
  maxHeight,
  offset = 4,
  viewportMargin = 8,
}: PlacementInput): AnchoredPlacement {
  const needed = Math.min(contentHeight ?? maxHeight, maxHeight)
  const spaceBelow = Math.max(0, viewportHeight - anchor.bottom - offset - viewportMargin)
  const spaceAbove = Math.max(0, anchor.top - offset - viewportMargin)

  // The overlay lines up with the anchor and matches its width.
  const left = anchor.left
  const width = anchor.width

  if (spaceBelow < needed && spaceAbove > spaceBelow) {
    return {
      side: 'above',
      bottom: viewportHeight - anchor.top + offset,
      left,
      width,
      maxHeight: Math.min(maxHeight, spaceAbove),
    }
  }

  return {
    side: 'below',
    top: anchor.bottom + offset,
    left,
    width,
    maxHeight: Math.min(maxHeight, spaceBelow),
  }
}

export function placementsEqual(a: AnchoredPlacement | null, b: AnchoredPlacement | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.side === b.side &&
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.left === b.left &&
    a.width === b.width &&
    a.maxHeight === b.maxHeight
  )
}
