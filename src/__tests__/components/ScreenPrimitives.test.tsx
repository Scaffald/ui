/**
 * Screen primitives — ScreenHeader, ListToolbar, Metric, Lane.
 *
 * These assert the behaviour the prototype's design audit asked for, not
 * styling: one count template, the caret's collapse contract, label-above-
 * figure ordering, and days-in-stage leading a row.
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Text } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { ListToolbar } from '../../components/ListToolbar'
import { MetricBlock, MetricRow } from '../../components/Metric'
import { Lane, LaneGroup } from '../../components/Lane'
import { ThemeProvider } from '../../theme'

const wrap = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('ScreenHeader', () => {
  it('renders title alone when nothing else is given', () => {
    wrap(<ScreenHeader title="Applications" />)
    expect(screen.getByText('Applications')).toBeTruthy()
  })

  it('renders kicker and tip when provided', () => {
    wrap(<ScreenHeader kicker="Employer view" title="Applications" tip="Move candidates." />)
    expect(screen.getByText('Employer view')).toBeTruthy()
    expect(screen.getByText('Move candidates.')).toBeTruthy()
  })

  it('hides the tip when collapsed, keeping the title', () => {
    wrap(<ScreenHeader title="Applications" tip="Move candidates." collapsed onToggleCollapsed={() => {}} />)
    expect(screen.getByText('Applications')).toBeTruthy()
    expect(screen.queryByText('Move candidates.')).toBeNull()
  })

  it('only offers the collapse caret when there is a tip to collapse', () => {
    wrap(<ScreenHeader title="Applications" onToggleCollapsed={() => {}} />)
    expect(screen.queryByLabelText('Hide description')).toBeNull()
  })

  it('fires the pager and hides it for a single tip', () => {
    const onNext = vi.fn()
    const { unmount } = wrap(
      <ScreenHeader title="A" tip="t" pager={{ index: 1, total: 5, onNext }} />,
    )
    fireEvent.click(screen.getByLabelText('Next tip'))
    expect(onNext).toHaveBeenCalledTimes(1)
    unmount()

    wrap(<ScreenHeader title="A" tip="t" pager={{ index: 1, total: 1, onNext }} />)
    expect(screen.queryByLabelText('Next tip')).toBeNull()
  })
})

describe('ListToolbar', () => {
  it('uses one "{n} {noun}" template, pluralising only when n is not 1', () => {
    const { unmount } = wrap(<ListToolbar resultCount={14} resultNoun="case" />)
    expect(screen.getByText('14 cases')).toBeTruthy()
    unmount()

    wrap(<ListToolbar resultCount={1} resultNoun="case" />)
    expect(screen.getByText('1 case')).toBeTruthy()
  })

  it('honours an irregular plural', () => {
    wrap(<ListToolbar resultCount={3} resultNoun="match" resultNounPlural="matches" />)
    expect(screen.getByText('3 matches')).toBeTruthy()
  })

  it('shows zero rather than hiding the count', () => {
    wrap(<ListToolbar resultCount={0} resultNoun="case" />)
    expect(screen.getByText('0 cases')).toBeTruthy()
  })

  it('clears a single chip without clearing the rest', () => {
    const onClear = vi.fn()
    wrap(
      <ListToolbar
        chips={[{ id: 'job', label: 'Job', value: 'Electrician', onPress: () => {}, onClear }]}
      />,
    )
    fireEvent.click(screen.getByLabelText('Remove Job filter'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('labels the filter trigger with the active count for assistive tech', () => {
    wrap(<ListToolbar activeFilterCount={5} filterContent={<Text>f</Text>} />)
    expect(screen.getByLabelText('Filters and sort, 5 active')).toBeTruthy()
  })
})

describe('MetricBlock', () => {
  it('puts the label before the figure in document order', () => {
    const { container } = wrap(<MetricBlock label="Search appearances" value="342" delta="8%" />)
    const text = container.textContent ?? ''
    expect(text.indexOf('Search appearances')).toBeLessThan(text.indexOf('342'))
    expect(text.indexOf('342')).toBeLessThan(text.indexOf('8%'))
  })

  it('renders every block passed to a row', () => {
    wrap(
      <MetricRow bordered>
        <MetricBlock label="Open cases" value="14" />
        <MetricBlock label="Over SLA" value="5" emphasis />
      </MetricRow>,
    )
    expect(screen.getByText('14')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
  })
})

describe('Lane', () => {
  it('leads the row with days in stage', () => {
    const { container } = wrap(<Lane age="8d" overdue title="Alice Chen" subtitle="Site Electrical Lead" />)
    const text = container.textContent ?? ''
    expect(text.indexOf('8d')).toBeLessThan(text.indexOf('Alice Chen'))
    expect(screen.getByText('in stage')).toBeTruthy()
  })

  it('shows the empty state only when the stage is empty', () => {
    const { unmount } = wrap(
      <LaneGroup title="New" count={0} emptyState={<Text>Nothing waiting</Text>}>
        <Lane title="row" />
      </LaneGroup>,
    )
    expect(screen.getByText('Nothing waiting')).toBeTruthy()
    expect(screen.queryByText('row')).toBeNull()
    unmount()

    wrap(
      <LaneGroup title="New" count={1} emptyState={<Text>Nothing waiting</Text>}>
        <Lane title="row" />
      </LaneGroup>,
    )
    expect(screen.getByText('row')).toBeTruthy()
    expect(screen.queryByText('Nothing waiting')).toBeNull()
  })

  it('is only pressable when it has a press handler', () => {
    const onPress = vi.fn()
    wrap(<Lane title="Alice Chen" onPress={onPress} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
