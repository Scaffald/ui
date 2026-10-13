import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'
import { describe, expect, it, vi } from 'vitest'
import { Table, hasTableToolbar } from '../Table'
import type { TableColumn } from '../Table.types'

/**
 * An empty table (Storage, Transactions, Violations…) opened on a ~90px blank
 * band and a hairline above its "No … found" message: the toolbar rendered
 * whenever `showHeader` was on, with nothing in it (Scaffald/SaaS#1102). The
 * populated path already required a search box or an action (#768); the empty
 * path now shares the rule.
 *
 * The empty path renders no row list, so unlike the grid it can be rendered
 * here and asserted on.
 */

vi.mock('../../../theme', () => ({
  useThemeContext: () => ({ theme: 'light' }),
}))

const columns: TableColumn[] = [
  { id: 'name', title: 'Name' },
  { id: 'size', title: 'Size' },
]

describe('hasTableToolbar', () => {
  it('is off with nothing to put in it', () => {
    expect(hasTableToolbar(true, false, 0)).toBe(false)
  })

  it('is on for a search box or an action', () => {
    expect(hasTableToolbar(true, true, 0)).toBe(true)
    expect(hasTableToolbar(true, false, 1)).toBe(true)
  })

  it('is off when the caller hides the header', () => {
    expect(hasTableToolbar(false, true, 2)).toBe(false)
  })
})

describe('empty Table', () => {
  it('shows the empty message', () => {
    const { getByText } = render(
      <Table columns={columns} data={[]} emptyMessage="No files found" />,
    )
    expect(getByText('No files found')).toBeTruthy()
  })

  it('keeps the search box, so a search with no results can be cleared', () => {
    const { getByPlaceholderText, getByText } = render(
      <Table columns={columns} data={[]} searchable searchPlaceholder="Search files" />,
    )
    expect(getByPlaceholderText('Search files')).toBeTruthy()
    expect(getByText('No data available')).toBeTruthy()
  })

  it('renders a custom empty state in place of the message', () => {
    const { getByText, queryByText } = render(
      <Table columns={columns} data={[]} renderEmpty={() => <Text>Nothing yet</Text>} />,
    )
    expect(getByText('Nothing yet')).toBeTruthy()
    expect(queryByText('No data available')).toBeNull()
  })
})
