import { describe, expect, it } from 'vitest'
import { DEFAULT_COLUMN_WIDTH, columnSizing, gridFill, totalColumnWidth } from '../Table'
import { getTableStyles } from '../Table.styles'

/**
 * How the web grid takes its widths and its height (#799).
 *
 * The rendered grid is measured against the real app by
 * scripts/audit/smoke-wide-tables.mjs; the rules it is built from are pinned
 * here.
 */
describe('columnSizing', () => {
  it('gives an undeclared column a share of the row and the default minimum', () => {
    expect(columnSizing(undefined)).toEqual({
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      minWidth: DEFAULT_COLUMN_WIDTH,
    })
  })

  it('fixes a numeric width and stops it shrinking', () => {
    expect(columnSizing(200)).toEqual({ flexGrow: 0, flexShrink: 0, width: 200, minWidth: 200 })
  })

  it('keeps a percentage a percentage', () => {
    expect(columnSizing(' 20% ')).toEqual({ flexGrow: 0, flexShrink: 0, width: '20%' })
  })

  it('treats a non-percentage string as undeclared rather than as NaN pixels', () => {
    expect(columnSizing('auto')).toEqual(columnSizing(undefined))
  })
})

describe('table containers', () => {
  it('size to their content — no flex: 1 for a content-sized parent to collapse', () => {
    const styles = getTableStyles('light')
    expect(styles.container).not.toHaveProperty('flex')
    expect(styles.stackedContainer).not.toHaveProperty('flex')
    expect(styles.body).not.toHaveProperty('flex')
    expect(styles.body.flexGrow).toBe(0)
  })
})

/**
 * The grid fills its container without measuring it (#1298).
 *
 * The rows used to take `max(columns, onLayout width)`; when the measurement
 * never arrived the width stayed 0 and CMS Workers drew ~500px of table in a
 * 1076px column. The rows render through a plain map now, but jsdom does no
 * layout, so the rule is pinned here and the rendered result was measured in
 * Chromium (a 3-column table filled 1076px; 12 × 160px columns scrolled at
 * 1920px inside the same 1076px).
 */
describe('gridFill', () => {
  it('makes the scroller content at least as wide as the scroller', () => {
    expect(gridFill(450).content).toEqual({ minWidth: '100%' })
  })

  it('lets the rows grow into that width but never below the columns', () => {
    expect(gridFill(450).rows).toEqual({ flexGrow: 1, minWidth: 450 })
  })

  it('sets no fixed width, so nothing waits on a measurement', () => {
    const { content, rows } = gridFill(1920)
    expect(content).not.toHaveProperty('width')
    expect(rows).not.toHaveProperty('width')
  })
})

describe('totalColumnWidth', () => {
  it('adds declared pixel widths and counts anything else at the default', () => {
    expect(totalColumnWidth([{ width: 200 }, {}, { width: '20%' }])).toBe(
      200 + DEFAULT_COLUMN_WIDTH * 2,
    )
  })

  it('is 0 with no columns', () => {
    expect(totalColumnWidth([])).toBe(0)
  })
})
