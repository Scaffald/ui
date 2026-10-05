import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'
import { TextLink } from '../../components/TextLink'

vi.mock('../../theme', () => ({
  useThemeContext: () => ({ theme: 'light' }),
}))

describe('TextLink', () => {
  it('renders its text as a link and presses through', () => {
    const onPress = vi.fn()
    const { getByText, getByRole } = render(<TextLink onPress={onPress}>See all</TextLink>)
    expect(getByRole('link')).toBeTruthy()
    fireEvent.press(getByText('See all'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('names itself after its text for assistive tech', () => {
    const { getByLabelText } = render(<TextLink onPress={() => {}}>Open profile</TextLink>)
    expect(getByLabelText('Open profile')).toBeTruthy()
  })
})
