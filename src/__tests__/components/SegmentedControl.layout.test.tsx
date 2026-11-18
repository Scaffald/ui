/**
 * SegmentedControl layout tests
 *
 * Regression cover for segments that ellipsized their own labels. Each segment
 * was `flex: 1` (basis 0) inside a container sized to its content, so every
 * segment got an equal share of the summed label widths and the longest label
 * was cut off at any viewport width: "Create a…" on /auth (Scaffald/SaaS#1361),
 * "In progr…" / "Cancel…" on the task status control, "Metr…" on Office
 * applications. Six call sites had grown a hand-tuned `width` or `minWidth` to
 * paper over it. Segments now grow from their label's width instead.
 *
 * jsdom has no layout engine, so these pin the style contract; the behaviour
 * was measured in Chromium against both styles before the change.
 */

import React from 'react'
import { render } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from '../../components/SegmentedControl'
import { getSegmentedControlStyles } from '../../components/SegmentedControl/SegmentedControl.styles'

const THEMES = ['light', 'dark'] as const

describe('SegmentedControl segment sizing', () => {
  for (const theme of THEMES) {
    const { segment, container } = getSegmentedControlStyles(theme)

    it(`${theme}: a segment's basis is its content, not zero`, () => {
      expect(segment.flexBasis).toBe('auto')
      // `flex: 1` expands to a zero basis on web and in Yoga — the bug.
      expect(segment.flex).toBeUndefined()
    })

    it(`${theme}: segments still fill width a caller gives the control`, () => {
      expect(segment.flexGrow).toBe(1)
    })

    it(`${theme}: segments may still shrink when the control is squeezed`, () => {
      expect(segment.flexShrink).toBe(1)
    })

    it(`${theme}: the container stays content-sized by default`, () => {
      expect(container.flexDirection).toBe('row')
      expect(container.alignSelf).toBe('flex-start')
    })
  }

  it('renders every segment with the content-based sizing', () => {
    const { getAllByRole } = render(
      <SegmentedControl
        segments={['To do', 'In progress', 'Done', 'Cancelled']}
        selectedIndex={1}
        onSelectionChange={vi.fn()}
      />,
    )
    const tabs = getAllByRole('tab')
    expect(tabs).toHaveLength(4)
    for (const tab of tabs) {
      // react-native-web renders to the DOM here; read what it applied.
      const style = window.getComputedStyle(tab as unknown as Element)
      expect(style.flexBasis).toBe('auto')
      expect(style.flexGrow).toBe('1')
    }
  })
})
