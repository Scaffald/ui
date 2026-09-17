import { describe, expect, it } from 'vitest'
import { shouldStackTable } from '../Table'
import { resolveColumnWidth } from '../TableCell.styles'
import { resolveColumnWidth as resolveHeaderWidth } from '../TableColumnHeader.styles'

/**
 * The two facts behind #768, pinned as functions for the same reason as
 * Table.stacked.test.tsx: a FlatList renders nothing under jsdom, so the
 * decision is tested, and the rendering is checked on a simulator.
 */
describe('shouldStackTable', () => {
  it('stacks on native at every width — the grid mode is a web layout', () => {
    for (const width of [0, 390, 768, 820, 1024, 1366]) {
      expect(shouldStackTable('ios', width, 768)).toBe(true)
      expect(shouldStackTable('android', width, 768)).toBe(true)
    }
  })

  it('on web, stacks strictly below stackBelow and not at zero', () => {
    expect(shouldStackTable('web', 390, 768)).toBe(true)
    expect(shouldStackTable('web', 767, 768)).toBe(true)
    expect(shouldStackTable('web', 768, 768)).toBe(false)
    expect(shouldStackTable('web', 1440, 768)).toBe(false)
    expect(shouldStackTable('web', 0, 768)).toBe(false)
  })
})

describe('resolveColumnWidth', () => {
  it('keeps a percentage a percentage instead of 20px', () => {
    expect(resolveColumnWidth('20%')).toBe('20%')
    expect(resolveHeaderWidth('33.3%')).toBe('33.3%')
  })

  it('treats other strings as pixel numbers, and numbers as themselves', () => {
    expect(resolveColumnWidth('120')).toBe(120)
    expect(resolveColumnWidth('120px')).toBe(120)
    expect(resolveColumnWidth(96)).toBe(96)
    expect(resolveColumnWidth('auto')).toBeUndefined()
  })
})
