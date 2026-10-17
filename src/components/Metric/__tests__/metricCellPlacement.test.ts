import { describe, expect, it } from 'vitest'
import { metricCellPlacement } from '../Metric'

/**
 * MetricRow's phone grid (#1164). It used to put every figure on its own
 * full-width row below 640px — three zeros filled a phone screen on Home and
 * Office — while its comment claimed that was the prototype's phone layout.
 * The prototype's is two-up (`statCols: s.mobile ? '1fr 1fr'`).
 */
const place = (count: number, width: number) =>
  Array.from({ length: count }, (_, i) => metricCellPlacement(i, count, width))

describe('metricCellPlacement', () => {
  it('desktop: one row, a rule before every cell but the first', () => {
    expect(place(3, 1440).map((p) => [p.span, p.ruleLeft, p.ruleTop])).toEqual([
      ['row', false, false],
      ['row', true, false],
      ['row', true, false],
    ])
  })

  it('phone, four figures: two pairs, a rule inside each pair and between the pairs', () => {
    expect(place(4, 390).map((p) => [p.span, p.side, p.ruleLeft, p.ruleTop])).toEqual([
      ['half', 'left', false, false],
      ['half', 'right', true, false],
      ['half', 'left', false, true],
      ['half', 'right', true, true],
    ])
  })

  it('phone, three figures: a pair, then the last on its own full row with no orphan rule', () => {
    expect(place(3, 390).map((p) => [p.span, p.ruleLeft, p.ruleTop])).toEqual([
      ['half', false, false],
      ['half', true, false],
      ['full', false, true],
    ])
  })

  it('phone, one figure: full width, no rules', () => {
    expect(place(1, 390)).toEqual([{ span: 'full', side: null, ruleLeft: false, ruleTop: false }])
  })

  it('very narrow: one per row', () => {
    expect(place(2, 280).map((p) => [p.span, p.ruleTop])).toEqual([
      ['full', false],
      ['full', true],
    ])
  })

  it('unmeasured width (0) renders the desktop row rather than guessing a phone', () => {
    expect(place(2, 0).map((p) => p.span)).toEqual(['row', 'row'])
  })
})
