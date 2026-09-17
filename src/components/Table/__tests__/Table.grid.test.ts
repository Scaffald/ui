import { describe, expect, it } from 'vitest'
import { DEFAULT_COLUMN_WIDTH, columnSizing } from '../Table'
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
