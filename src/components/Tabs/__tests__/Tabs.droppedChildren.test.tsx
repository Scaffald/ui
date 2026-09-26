/**
 * What `Tabs` does with a child it cannot turn into a tab (#906).
 *
 * `TabContentProps` used to declare a `value` prop, documented as associating a
 * panel with a trigger "for Radix-style API". Nothing read it: `TabContent`
 * decides purely on `useTabItemContext().isSelected`. So a panel written in that
 * shape — a sibling of the triggers rather than nested in its `Tabs.Item` —
 * rendered nothing.
 *
 * It was silent, too. `Tabs` walks its direct children looking for a
 * `TabTrigger` among each one's children and keeps the child only `if (trigger)`,
 * so a bare `Tabs.Content` was discarded before `TabContent` ever ran — which is
 * why `useTabItemContext`'s own "must be used within a TabItem" throw never
 * fired. Four screens shipped with a tab strip over empty space (#896).
 *
 * The prop is gone, so that mistake is now a type error. These tests cover the
 * runtime half: a dropped child says so, and the supported shape still works.
 */

import { render } from '@testing-library/react-native'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Tabs } from '../index'

vi.mock('../../../theme', () => ({
  useThemeContext: () => ({ theme: 'light' }),
}))

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
})

/** Every warning `Tabs` emitted, joined, for substring assertions. */
const warnings = () => warn.mock.calls.map((c) => String(c[0])).join('\n')

describe('Tabs: a child it cannot turn into a tab', () => {
  it('warns instead of silently dropping a bare Tabs.Content', () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.Item value="a">
          <Tabs.Trigger>A</Tabs.Trigger>
        </Tabs.Item>
        {/* The #896 shape: a panel as a sibling of the triggers. */}
        <Tabs.Content>panel A</Tabs.Content>
      </Tabs>,
    )

    expect(warn).toHaveBeenCalled()
    expect(warnings()).toContain('[Tabs]')
    expect(warnings()).toContain('Tabs.Content')
    // The warning has to say what to do, not just that something went wrong.
    expect(warnings()).toContain('Tabs.Item')
  })

  it('still does not render the dropped panel — the warning is the only change', () => {
    const { queryByText } = render(
      <Tabs defaultValue="a">
        <Tabs.Item value="a">
          <Tabs.Trigger>A</Tabs.Trigger>
        </Tabs.Item>
        <Tabs.Content>panel A</Tabs.Content>
      </Tabs>,
    )

    expect(queryByText('panel A')).toBeNull()
  })

  it('names a dropped child that is not a Tabs.Content', () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.Item value="a">
          <Tabs.Trigger>A</Tabs.Trigger>
        </Tabs.Item>
        {/* A Tabs.Item with no trigger cannot become a tab either. */}
        <Tabs.Item value="b">
          <Tabs.Content>panel B</Tabs.Content>
        </Tabs.Item>
      </Tabs>,
    )

    expect(warn).toHaveBeenCalled()
    expect(warnings()).toContain('[Tabs]')
  })

  it('says nothing when every child is a well-formed Tabs.Item', () => {
    const { getByText, queryByText } = render(
      <Tabs defaultValue="a">
        <Tabs.Item value="a">
          <Tabs.Trigger>A</Tabs.Trigger>
          <Tabs.Content>panel A</Tabs.Content>
        </Tabs.Item>
        <Tabs.Item value="b">
          <Tabs.Trigger>B</Tabs.Trigger>
          <Tabs.Content>panel B</Tabs.Content>
        </Tabs.Item>
      </Tabs>,
    )

    // The supported shape: selected panel renders, the other does not, silently.
    expect(getByText('panel A')).toBeTruthy()
    expect(queryByText('panel B')).toBeNull()
    expect(warn).not.toHaveBeenCalled()
  })

  it('does not warn about a conditional child that evaluated to nothing', () => {
    const showSecond = false
    render(
      <Tabs defaultValue="a">
        <Tabs.Item value="a">
          <Tabs.Trigger>A</Tabs.Trigger>
          <Tabs.Content>panel A</Tabs.Content>
        </Tabs.Item>
        {showSecond && (
          <Tabs.Item value="b">
            <Tabs.Trigger>B</Tabs.Trigger>
          </Tabs.Item>
        )}
      </Tabs>,
    )

    // `{cond && <…>}` yields false, not an element. Warning on that would make
    // the warning useless noise in every conditionally-built tab strip.
    expect(warn).not.toHaveBeenCalled()
  })
})
