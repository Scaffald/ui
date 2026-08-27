import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Breadcrumb } from '../Breadcrumb'
import { getTabListStyles } from '../../Tabs/Tabs.styles'

/**
 * Page chrome on a narrow screen (#664).
 *
 * Two things ran off the right edge of a 390px phone with nothing saying they
 * continued: a four-level breadcrumb whose LAST crumb — the one that names
 * where you are — was cut mid-word, and a five-tab strip whose fifth tab sat
 * half off-frame and so read as the end of the list rather than a tab you
 * could reach.
 *
 * Breadcrumb renders as plain Views, so it can be asserted on directly. (The
 * Table equivalent could not: its rows come from a FlatList, which renders
 * nothing under jsdom.)
 */

const mockWidth = vi.hoisted(() => ({ value: 1440 }))
vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ width: mockWidth.value }),
}))

const TRAIL = [
  { id: 'home', label: 'Home' },
  { id: 'office', label: 'Office' },
  { id: 'ats', label: 'ATS' },
  { id: 'current', label: 'Review Background Checks' },
]

const renderAt = (width: number, props = {}) => {
  mockWidth.value = width
  return render(<Breadcrumb items={TRAIL} currentIndex={3} {...props} />)
}

describe('breadcrumb on a narrow screen', () => {
  it('keeps the whole trail when there is room', () => {
    renderAt(1440)
    for (const label of ['Home', 'Office', 'ATS', 'Review Background Checks']) {
      expect(screen.getByText(label)).toBeTruthy()
    }
    expect(screen.queryByText('...')).toBeNull()
  })

  it('collapses to Home > ... > Current when there is not', () => {
    renderAt(390)
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('...')).toBeTruthy()
    // The crumb that names where you are is the one that must survive.
    expect(screen.getByText('Review Background Checks')).toBeTruthy()
    expect(screen.queryByText('Office')).toBeNull()
  })

  it('lets an explicit maxItems win over the automatic collapse', () => {
    renderAt(390, { maxItems: 4 })
    expect(screen.getByText('Office')).toBeTruthy()
    expect(screen.queryByText('...')).toBeNull()
  })

  it('honours collapseBelow=0 as "never collapse"', () => {
    renderAt(390, { collapseBelow: 0 })
    expect(screen.getByText('Office')).toBeTruthy()
    expect(screen.queryByText('...')).toBeNull()
  })

  it('does not collapse a trail that already fits the limit', () => {
    mockWidth.value = 390
    render(<Breadcrumb items={TRAIL.slice(0, 3)} currentIndex={2} />)
    expect(screen.queryByText('...')).toBeNull()
  })
})

describe('tab strip on a narrow screen', () => {
  it('wraps rather than running off the edge', () => {
    expect(getTabListStyles('horizontal', 'light', { wrap: true }).flexWrap).toBe('wrap')
  })

  it('stays on one line when there is room', () => {
    expect(getTabListStyles('horizontal', 'light', { wrap: false }).flexWrap).toBeUndefined()
    expect(getTabListStyles('horizontal', 'light').flexWrap).toBeUndefined()
  })

  it('never wraps a vertical strip — that is a column already', () => {
    expect(getTabListStyles('vertical', 'light', { wrap: true }).flexWrap).toBeUndefined()
  })
})
