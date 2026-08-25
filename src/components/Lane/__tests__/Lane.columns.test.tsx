import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Lane } from '../Lane'

/**
 * Stacked rows and labelled columns.
 *
 * A wide Lane row gets its meaning from position: `88 | Scaffald | — |
 * Unassigned` reads because each cell sits under a heading. Stacking destroys
 * position, and the phone form became four orphaned values down the page, one
 * of which was a lone em dash. These pin the two rules that fix it — the label
 * appears only when stacked, and an empty cell is dropped only when stacked.
 */

// useResponsive drives the stacking decision; drive it directly rather than
// trying to fake a viewport.
const mockWidth = vi.hoisted(() => ({ value: 1440 }))
vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ width: mockWidth.value }),
}))

const renderAt = (width: number, props = {}) => {
  mockWidth.value = width
  return render(
    <Lane
      title="Alice Chen"
      subtitle="Site Electrical Lead"
      age="8d"
      columns={[
        { label: 'Score', value: '88' },
        { label: 'Source', value: 'Scaffald' },
        { label: 'Union', value: '—', empty: true },
      ]}
      {...props}
    />
  )
}

describe('labelled columns', () => {
  it('labels the cells on a wide row too — the row has no column headings', () => {
    // A Lane row carries no header, so position implies nothing and a bare
    // "0  Scaffald  —  Unassigned" says what none of its values are. The first
    // caller worked around this by writing "score" into the cell itself.
    renderAt(1440)
    expect(screen.getByText('Source')).toBeTruthy()
    expect(screen.getByText('Scaffald')).toBeTruthy()
    expect(screen.getByText('Score')).toBeTruthy()
  })

  it('keeps the labels once stacked, so no value is orphaned', () => {
    renderAt(390)
    expect(screen.getByText('Source')).toBeTruthy()
    expect(screen.getByText('Scaffald')).toBeTruthy()
  })

  it('keeps an empty cell on a wide row so the grid still lines up', () => {
    renderAt(1440)
    expect(screen.getByText('—')).toBeTruthy()
  })

  it('does not label an empty cell — a heading with nothing after it is noise', () => {
    // Wide, an empty cell survives as a spacer holding the grid. Labelling the
    // spacer printed "Outcome" followed by blank.
    renderAt(1440)
    expect(screen.queryByText('Union')).toBeNull()
  })

  it('drops an empty cell when stacked rather than spending a line on a dash', () => {
    renderAt(390)
    expect(screen.queryByText('—')).toBeNull()
    expect(screen.queryByText('Union')).toBeNull()
  })

  it('still renders a bare ReactNode column, label and all', () => {
    // The unlabelled form is kept for callers that bake the label into the
    // cell. It must not gain a phantom label or be dropped.
    mockWidth.value = 390
    render(<Lane title="Alice Chen" columns={[<span key="s">score 88</span>]} />)
    expect(screen.getByText('score 88')).toBeTruthy()
  })

  it('renders the identity either way', () => {
    renderAt(390)
    expect(screen.getByText('Alice Chen')).toBeTruthy()
    expect(screen.getByText('Site Electrical Lead')).toBeTruthy()
    expect(screen.getByText('8d')).toBeTruthy()
  })
})
