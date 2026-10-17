/**
 * ScreenHeader's reading order on a phone, and the drill-in back link.
 *
 * Actions used to sit on the wrapping title row, so at 390 they landed
 * between the title and its tip — "Good afternoon, Zach." / two buttons /
 * "Finish your profile…" (#1161). Below 640 they now follow the tip.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScreenHeader } from '../ScreenHeader'

const mockWidth = vi.hoisted(() => ({ value: 1440 }))
vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ width: mockWidth.value }),
}))

const renderAt = (width: number, props = {}) => {
  mockWidth.value = width
  return render(
    <ScreenHeader
      kicker="Employer view"
      title="Applications"
      tip="Move candidates between stages."
      actions={<span>Post a job</span>}
      {...props}
    />,
  )
}

/** Document order of three texts, as a reader (or screen reader) meets them. */
const order = (...texts: string[]) => {
  const nodes = texts.map((t) => screen.getByText(t))
  return [...nodes].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  ).map((n) => n.textContent)
}

describe('ScreenHeader', () => {
  it('desktop: actions sit on the title row, before the tip', () => {
    renderAt(1440)
    expect(order('Applications', 'Post a job', 'Move candidates between stages.')).toEqual([
      'Applications',
      'Post a job',
      'Move candidates between stages.',
    ])
  })

  it('phone: actions follow the tip, so the header reads title → tip → actions', () => {
    renderAt(390)
    expect(order('Applications', 'Post a job', 'Move candidates between stages.')).toEqual([
      'Applications',
      'Move candidates between stages.',
      'Post a job',
    ])
  })

  it('renders a named back link above the kicker and calls it', () => {
    const onPress = vi.fn()
    renderAt(1440, { back: { label: 'Applications list', onPress } })
    const back = screen.getByLabelText('Back to Applications list')
    expect(order('Applications list', 'Employer view')).toEqual(['Applications list', 'Employer view'])
    fireEvent.click(back)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('draws no back link unless asked', () => {
    renderAt(1440)
    expect(screen.queryByLabelText(/^Back to/)).toBeNull()
  })
})
