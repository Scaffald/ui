import { describe, expect, it } from 'vitest'
import { stackedDataColumns } from '../Table'
import type { TableColumn } from '../Table.types'

/**
 * Which columns survive into a stacked row.
 *
 * Below `stackBelow` a table row becomes a labelled card instead of a slice of
 * a sideways-scrolling grid. Measured on the screening queue at 390px before
 * the change: 1,050px of columns inside a 342px viewport, so 708px of every
 * row sat off-frame behind a gesture nothing advertised.
 *
 * ─── Why this tests a function and not a render ────────────────────────────
 *
 * `Table`'s rows come from a `FlatList`, which needs a measured layout. jsdom
 * gives it height 0, so it renders ZERO rows — in grid mode as much as stacked
 * mode. A render test here does not fail because the stacking is wrong; it
 * fails because nothing renders at all, which is worse than no test: it looks
 * like coverage and asserts nothing about the feature.
 *
 * So the column rule is pinned here, and the rendered result is measured
 * against the real app by scripts/audit/smoke-wide-tables.mjs — which asserts
 * the overflow is gone rather than that some text exists.
 */

const col = (over: Partial<TableColumn>): TableColumn => ({ id: 'x', title: 'X', ...over })

describe('stackedDataColumns', () => {
  it('keeps every column that carries a heading', () => {
    const columns = [
      col({ id: 'worker', title: 'Worker' }),
      col({ id: 'org', title: 'Organization' }),
      col({ id: 'status', title: 'Status' }),
    ]
    expect(stackedDataColumns(columns).map((c) => c.id)).toEqual(['worker', 'org', 'status'])
  })

  it('drops a headerless column — it would print a blank label', () => {
    const columns = [col({ id: 'worker', title: 'Worker' }), col({ id: 'expander', title: '' })]
    expect(stackedDataColumns(columns).map((c) => c.id)).toEqual(['worker'])
  })

  it('drops a headerEmpty spacer', () => {
    const columns = [
      col({ id: 'worker', title: 'Worker' }),
      col({ id: 'gap', title: 'Gap', headerEmpty: true }),
    ]
    expect(stackedDataColumns(columns).map((c) => c.id)).toEqual(['worker'])
  })

  it('drops the selection checkbox when rows are selectable', () => {
    const columns = [
      col({ id: 'sel', title: 'Select', showCheckbox: true }),
      col({ id: 'worker', title: 'Worker' }),
    ]
    expect(stackedDataColumns(columns, true).map((c) => c.id)).toEqual(['worker'])
  })

  it('keeps a checkbox column when rows are NOT selectable', () => {
    // `showCheckbox` alone does not make it chrome — the table has to be in
    // selection mode for that column to be a control rather than data.
    const columns = [
      col({ id: 'sel', title: 'Select', showCheckbox: true }),
      col({ id: 'worker', title: 'Worker' }),
    ]
    expect(stackedDataColumns(columns, false).map((c) => c.id)).toEqual(['sel', 'worker'])
  })

  it('preserves column order', () => {
    const columns = [
      col({ id: 'c', title: 'C' }),
      col({ id: 'a', title: 'A' }),
      col({ id: 'b', title: 'B' }),
    ]
    expect(stackedDataColumns(columns).map((c) => c.id)).toEqual(['c', 'a', 'b'])
  })

  it('returns nothing when a table is all chrome', () => {
    expect(stackedDataColumns([col({ id: 'gap', title: '' })])).toEqual([])
  })
})
