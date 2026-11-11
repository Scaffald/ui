/**
 * AnchoredOverlay — the portal, the placement math, and dismissal
 * (Scaffald/SaaS#1330).
 */

import React, { useRef } from 'react'
import { act, fireEvent, render, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Text, View } from 'react-native'
import {
  AnchoredOverlay,
  computeAnchoredPlacement,
  useListboxNavigation,
} from '../../components/AnchoredOverlay'

describe('computeAnchoredPlacement', () => {
  const anchor = { top: 100, bottom: 140, left: 20, width: 320 }

  it('places below the anchor, matching its left and width', () => {
    const p = computeAnchoredPlacement({ anchor, viewportHeight: 800, maxHeight: 300, offset: 4 })
    expect(p).toEqual({ side: 'below', top: 144, left: 20, width: 320, maxHeight: 300 })
  })

  it('flips above when there is no room below and more room above', () => {
    const low = { top: 600, bottom: 640, left: 0, width: 200 }
    const p = computeAnchoredPlacement({
      anchor: low,
      viewportHeight: 800,
      maxHeight: 300,
      offset: 4,
      viewportMargin: 8,
    })
    expect(p.side).toBe('above')
    // bottom edge sits `offset` above the anchor's top
    expect(p.bottom).toBe(800 - 600 + 4)
    expect(p.top).toBeUndefined()
    expect(p.maxHeight).toBe(300)
  })

  it('stays below when the content fits there, even near the bottom', () => {
    const low = { top: 600, bottom: 640, left: 0, width: 200 }
    const p = computeAnchoredPlacement({
      anchor: low,
      viewportHeight: 800,
      maxHeight: 300,
      contentHeight: 120,
      offset: 4,
      viewportMargin: 8,
    })
    expect(p.side).toBe('below')
    expect(p.maxHeight).toBe(800 - 640 - 4 - 8)
  })

  it('does not flip when there is even less room above', () => {
    const tall = { top: 50, bottom: 700, left: 0, width: 200 }
    const p = computeAnchoredPlacement({
      anchor: tall,
      viewportHeight: 800,
      maxHeight: 300,
      offset: 4,
      viewportMargin: 8,
    })
    expect(p.side).toBe('below')
    expect(p.maxHeight).toBe(800 - 700 - 4 - 8)
  })

  it('clamps maxHeight to the space above when flipped', () => {
    const p = computeAnchoredPlacement({
      anchor: { top: 200, bottom: 760, left: 0, width: 100 },
      viewportHeight: 800,
      maxHeight: 300,
      offset: 4,
      viewportMargin: 8,
    })
    expect(p.side).toBe('above')
    expect(p.maxHeight).toBe(200 - 4 - 8)
  })

  it('never returns a negative maxHeight', () => {
    const p = computeAnchoredPlacement({
      anchor: { top: -400, bottom: -360, left: 0, width: 100 },
      viewportHeight: 800,
      maxHeight: 300,
    })
    expect(p.maxHeight).toBeGreaterThanOrEqual(0)
  })
})

function Harness({
  open = true,
  onRequestClose,
}: {
  open?: boolean
  onRequestClose?: () => void
}) {
  const anchorRef = useRef<View>(null)
  return (
    <View testID="page">
      <View ref={anchorRef} testID="anchor">
        <Text>Anchor</Text>
      </View>
      <AnchoredOverlay
        anchorRef={anchorRef}
        open={open}
        onRequestClose={onRequestClose}
        testID="overlay"
        id="results"
        role="listbox"
      >
        <View testID="row">
          <Text>Row</Text>
        </View>
      </AnchoredOverlay>
      <View testID="outside">
        <Text>Outside</Text>
      </View>
    </View>
  )
}

describe('AnchoredOverlay (web)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('portals into document.body, outside the render container', () => {
    const { container, getByTestId } = render(<Harness />)
    const overlay = getByTestId('overlay')
    expect(document.body.contains(overlay)).toBe(true)
    expect(container.contains(overlay)).toBe(false)
    expect(overlay.parentElement).toBe(document.body)
    expect(overlay.getAttribute('id')).toBe('results')
    expect(overlay.getAttribute('role')).toBe('listbox')
  })

  it('is position: fixed below the anchor, at the anchor width', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isAnchor = this.getAttribute('data-testid') === 'anchor'
      return {
        top: isAnchor ? 100 : 0,
        bottom: isAnchor ? 140 : 0,
        left: isAnchor ? 24 : 0,
        right: isAnchor ? 324 : 0,
        width: isAnchor ? 300 : 0,
        height: isAnchor ? 40 : 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect
    })
    const { getByTestId } = render(<Harness />)
    const style = getByTestId('overlay').style
    expect(style.position).toBe('fixed')
    expect(style.top).toBe('144px')
    expect(style.left).toBe('24px')
    expect(style.width).toBe('300px')
  })

  it('re-measures when its content changes, not only when it resizes', async () => {
    // A "Searching…" row and a full result list can both fill the clamped
    // maxHeight, so no ResizeObserver fires when results arrive; without a
    // re-measure a menu near the bottom never flips above (#1330 smoke test).
    const measured = vi.fn()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.getAttribute('data-testid') === 'anchor') measured()
      return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect
    })
    const { getByTestId } = render(<Harness />)
    const before = measured.mock.calls.length
    await act(async () => {
      getByTestId('row').appendChild(document.createTextNode('more results'))
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    expect(measured.mock.calls.length).toBeGreaterThan(before)
  })

  it('renders nothing when closed', () => {
    const { queryByTestId } = render(<Harness open={false} />)
    expect(queryByTestId('overlay')).toBeNull()
  })

  it('calls onRequestClose on a pointerdown outside', () => {
    const onRequestClose = vi.fn()
    const { getByTestId } = render(<Harness onRequestClose={onRequestClose} />)
    fireEvent.pointerDown(getByTestId('outside'))
    expect(onRequestClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on a pointerdown inside the overlay or the anchor', () => {
    const onRequestClose = vi.fn()
    const { getByTestId } = render(<Harness onRequestClose={onRequestClose} />)
    fireEvent.pointerDown(getByTestId('row'))
    fireEvent.pointerDown(getByTestId('anchor'))
    expect(onRequestClose).not.toHaveBeenCalled()
  })

  it('calls onRequestClose on Escape', () => {
    const onRequestClose = vi.fn()
    render(<Harness onRequestClose={onRequestClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onRequestClose).toHaveBeenCalledTimes(1)
  })

  it('prevents mousedown inside the overlay so the input keeps focus', () => {
    const { getByTestId } = render(<Harness />)
    const notCancelled = fireEvent.mouseDown(getByTestId('row'))
    expect(notCancelled).toBe(false)
  })

  it('removes its document listeners when closed', () => {
    const onRequestClose = vi.fn()
    const { rerender, getByTestId } = render(<Harness onRequestClose={onRequestClose} />)
    rerender(<Harness open={false} onRequestClose={onRequestClose} />)
    fireEvent.pointerDown(getByTestId('outside'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onRequestClose).not.toHaveBeenCalled()
  })
})

describe('useListboxNavigation', () => {
  const key = (k: string) => ({ nativeEvent: { key: k }, preventDefault: vi.fn() })

  it('wires combobox and option aria attributes', () => {
    const { result } = renderHook(() =>
      useListboxNavigation({ id: 'lb', itemCount: 3, open: true, onSelectIndex: vi.fn() }),
    )
    expect(result.current.inputProps).toMatchObject({
      role: 'combobox',
      'aria-expanded': true,
      'aria-controls': 'lb',
    })
    expect(result.current.listboxProps).toEqual({ id: 'lb', role: 'listbox' })
    expect(result.current.getOptionProps(1)).toEqual({
      id: 'lb-option-1',
      role: 'option',
      'aria-selected': false,
    })
  })

  it('moves with the arrow keys, wraps, and selects on Enter', () => {
    const onSelectIndex = vi.fn()
    const { result } = renderHook(() =>
      useListboxNavigation({ id: 'lb', itemCount: 3, open: true, onSelectIndex }),
    )
    act(() => result.current.handleKeyPress(key('ArrowDown')))
    act(() => result.current.handleKeyPress(key('ArrowDown')))
    expect(result.current.activeIndex).toBe(1)
    expect(result.current.inputProps['aria-activedescendant']).toBe('lb-option-1')
    expect(result.current.getOptionProps(1)['aria-selected']).toBe(true)
    act(() => result.current.handleKeyPress(key('ArrowUp')))
    act(() => result.current.handleKeyPress(key('ArrowUp')))
    expect(result.current.activeIndex).toBe(2)
    act(() => result.current.handleKeyPress(key('Enter')))
    expect(onSelectIndex).toHaveBeenCalledWith(2)
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useListboxNavigation({ id: 'lb', itemCount: 2, open: true, onSelectIndex: vi.fn(), onClose }),
    )
    act(() => result.current.handleKeyPress(key('Escape')))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
