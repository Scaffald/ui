import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Lane } from '../Lane'

/**
 * Lane's column contract.
 *
 * `columns` is `ReactNode[]` — self-contained cells the caller composes. It was
 * briefly a union of `ReactNode | { label, value }` that Lane discriminated at
 * render time, so it could add the label itself. That is gone, and these tests
 * exist partly to keep it gone:
 *
 * The guard evaluated differently under the app and under vitest. The rendered
 * app was correct at both widths; every row-rendering test in
 * ApplicationsLanes.test.tsx crashed with "Objects are not valid as a React
 * child (found: object with keys {label, value})" — the descriptor was reaching
 * React because the guard returned false there. Three explanations were checked
 * and eliminated (a stale build, a stale Vite cache, `isValidElement` being the
 * fragile clause) before the honest conclusion: a render path is the wrong
 * place to be guessing what a value is, whatever the specific cause.
 *
 * So Lane renders whatever node it is handed, and the caller composes the
 * label. Nothing to discriminate, nothing to get wrong.
 */

const mockWidth = vi.hoisted(() => ({ value: 1440 }))
vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ width: mockWidth.value }),
}))

const renderAt = (width: number, columns: React.ReactNode[]) => {
  mockWidth.value = width
  return render(<Lane title="Alice Chen" subtitle="Site Electrical Lead" age="8d" columns={columns} />)
}

describe('Lane columns', () => {
  it('renders each cell exactly as given, wide', () => {
    renderAt(1440, [<span key="a">Score 88</span>, <span key="b">Source Scaffald</span>])
    expect(screen.getByText('Score 88')).toBeTruthy()
    expect(screen.getByText('Source Scaffald')).toBeTruthy()
  })

  it('renders each cell exactly as given, stacked', () => {
    renderAt(390, [<span key="a">Score 88</span>, <span key="b">Source Scaffald</span>])
    expect(screen.getByText('Score 88')).toBeTruthy()
    expect(screen.getByText('Source Scaffald')).toBeTruthy()
  })

  it('accepts a plain string cell', () => {
    renderAt(1440, ['Unassigned'])
    expect(screen.getByText('Unassigned')).toBeTruthy()
  })

  it('drops nothing and adds nothing — a null cell simply renders nothing', () => {
    // The caller decides what to omit; Lane does not second-guess it.
    renderAt(390, [<span key="a">Score 88</span>, null])
    expect(screen.getByText('Score 88')).toBeTruthy()
  })

  it('renders the identity at both widths', () => {
    for (const w of [1440, 390]) {
      const { unmount } = renderAt(w, [])
      expect(screen.getByText('Alice Chen')).toBeTruthy()
      expect(screen.getByText('Site Electrical Lead')).toBeTruthy()
      expect(screen.getByText('8d')).toBeTruthy()
      unmount()
    }
  })

  it('never renders a raw object as a child', () => {
    // The regression this file is named for. A caller that hands Lane a
    // descriptor by mistake should not take the whole tree down.
    expect(() =>
      renderAt(390, [{ label: 'Score', value: '88' } as unknown as React.ReactNode])
    ).toThrow(/Objects are not valid as a React child/)
  })
})
