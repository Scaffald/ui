import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-native-svg', () => {
  const React = require('react')
  const Svg = (props: Record<string, unknown>) => React.createElement('svg', props)
  const Path = (props: Record<string, unknown>) => React.createElement('path', props)
  return { default: Svg, Svg, Path }
})

import { Checkbox } from '../../components/Checkbox'

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('should render unchecked by default', () => {
      const { getByRole } = render(<Checkbox />)
      expect(getByRole('checkbox')).toBeTruthy()
    })

    it('should render checked when checked prop is true', () => {
      const { getByRole } = render(<Checkbox checked={true} onChange={vi.fn()} />)
      expect(getByRole('checkbox')).toBeTruthy()
    })

    it('should render unchecked when checked prop is false', () => {
      const { getByRole } = render(<Checkbox checked={false} onChange={vi.fn()} />)
      expect(getByRole('checkbox')).toBeTruthy()
    })
  })

  describe('onChange Callback', () => {
    it('should call onChange with true when unchecked checkbox is pressed', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Checkbox checked={false} onChange={onChange} />)

      fireEvent.press(getByRole('checkbox'))
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should call onChange with false when checked checkbox is pressed', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Checkbox checked={true} onChange={onChange} />)

      fireEvent.press(getByRole('checkbox'))
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Disabled State', () => {
    it('should not call onChange when disabled', () => {
      const onChange = vi.fn()
      const { getByRole } = render(
        <Checkbox checked={false} onChange={onChange} disabled />
      )

      fireEvent.press(getByRole('checkbox'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should render disabled checkbox', () => {
      const { getByRole } = render(<Checkbox disabled />)
      expect(getByRole('checkbox')).toBeTruthy()
    })
  })

  describe('Label', () => {
    it('should render label text', () => {
      const { getByText } = render(<Checkbox label="Accept terms" />)
      expect(getByText('Accept terms')).toBeTruthy()
    })

    it('should render without label', () => {
      const { getByRole } = render(<Checkbox />)
      expect(getByRole('checkbox')).toBeTruthy()
    })

    it('should render optional indicator', () => {
      const { getByText } = render(<Checkbox label="Newsletter" optional />)
      expect(getByText('Newsletter')).toBeTruthy()
      expect(getByText(/optional/)).toBeTruthy()
    })
  })

  describe('Error State', () => {
    it('should render error message', () => {
      const { getByText } = render(
        <Checkbox error errorMessage="This field is required" />
      )
      expect(getByText('This field is required')).toBeTruthy()
    })
  })
})
