/**
 * Tab labels carry counts ("Draft · 0", "Closed · 1"). The folder tabs set them
 * in the serif, whose old-style figures made 0 read as "o" and 1 as a dotless
 * "ı" (Scaffald/SaaS#1101). Every trigger asks for lining, tabular figures.
 */

import { describe, expect, it } from 'vitest'
import { getTabTriggerStyles } from '../Tabs.styles'
import type { TabType } from '../Tabs.types'

const TYPES: TabType[] = ['default', 'line', 'shadow', 'folder']

describe('tab trigger numerals', () => {
  it.each(TYPES)('%s labels use lining, tabular figures', (type) => {
    for (const selected of [false, true]) {
      for (const theme of ['light', 'dark'] as const) {
        const { text } = getTabTriggerStyles(
          type,
          'gray',
          'md',
          'horizontal',
          selected,
          false,
          false,
          false,
          theme,
        )
        expect(text.fontVariant).toEqual(['lining-nums', 'tabular-nums'])
      }
    }
  })
})
