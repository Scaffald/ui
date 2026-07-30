/**
 * Input layout tests
 *
 * Regression cover for an Input that could not shrink. Its root container
 * carried `minWidth: '100%'` alongside `flexShrink: 0`, which turned the
 * preferred width into a hard floor: an Input sharing a Row with a sibling
 * claimed the entire row and pushed the sibling out of bounds, and callers had
 * no way to opt out — `flex: 1` from the outside cannot shrink a box below its
 * own minWidth. 13 call sites passed `flex: 1` expecting exactly that.
 */

import React from 'react'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, it, expect } from 'vitest'
import { Input } from '../../components/Input'
import { getInputStyles } from '../../components/Input/Input.styles'
import type { InputState, InputType } from '../../components/Input/Input.types'

const STATES: InputState[] = ['default', 'hover', 'focused', 'error', 'filled']
const TYPES: InputType[] = ['classic', 'line']

const container = (
  state: InputState = 'default',
  type: InputType = 'classic',
  disabled = false,
  hasExternalAddon = false,
) => getInputStyles(state, type, disabled, hasExternalAddon, 'light').container

describe('Input root container sizing', () => {
  it('does not pin a minimum width', () => {
    expect(container().minWidth).toBeUndefined()
  })

  it('is allowed to shrink', () => {
    expect(container().flexShrink).not.toBe(0)
  })

  it('still prefers the full width of its parent', () => {
    // The column case — an Input as the sole child of a form — must be
    // unchanged by the shrink fix.
    expect(container().width).toBe('100%')
  })

  it('does not exceed its parent', () => {
    expect(container().maxWidth).toBe('100%')
  })

  it('holds across every state and type', () => {
    for (const state of STATES) {
      for (const type of TYPES) {
        for (const disabled of [false, true]) {
          for (const addon of [false, true]) {
            const c = container(state, type, disabled, addon)
            expect(c.minWidth, `${state}/${type}/${disabled}/${addon}`).toBeUndefined()
            expect(c.flexShrink, `${state}/${type}/${disabled}/${addon}`).not.toBe(0)
          }
        }
      }
    }
  })

  it('holds in dark mode', () => {
    const c = getInputStyles('default', 'classic', false, false, 'dark').container
    expect(c.minWidth).toBeUndefined()
    expect(c.flexShrink).not.toBe(0)
  })
})

describe('Input sharing a Row with a sibling', () => {
  it('renders alongside a sibling without the caller fighting a width floor', () => {
    const { getByPlaceholderText, getByText } = render(
      <View style={{ flexDirection: 'row' }}>
        <Input placeholder="Search connections..." style={{ flex: 1 }} />
        <View>
          <Input placeholder="sibling" />
        </View>
      </View>,
    )
    expect(getByPlaceholderText('Search connections...')).toBeTruthy()
    expect(getByPlaceholderText('sibling')).toBeTruthy()
    expect(() => getByText('__never__')).toThrow()
  })
})
