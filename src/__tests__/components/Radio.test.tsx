import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-native-svg', () => {
  const React = require('react')
  const Svg = (props: Record<string, unknown>) => React.createElement('svg', props)
  const Path = (props: Record<string, unknown>) => React.createElement('path', props)
  return { default: Svg, Svg, Path }
})

import { Radio } from '../../components/Radio'

describe('Radio', () => {
  describe('Rendering', () => {
    it('should render unselected by default', () => {
      const { getByRole } = render(<Radio />)
      expect(getByRole('radio')).toBeTruthy()
    })

    it('should render selected when checked is true', () => {
      const { getByRole } = render(<Radio checked={true} onChange={vi.fn()} />)
      expect(getByRole('radio')).toBeTruthy()
    })

    it('should render unselected when checked is false', () => {
      const { getByRole } = render(<Radio checked={false} onChange={vi.fn()} />)
      expect(getByRole('radio')).toBeTruthy()
    })
  })

  describe('onChange Callback', () => {
    it('should call onChange with true when unselected radio is pressed', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Radio checked={false} onChange={onChange} />)

      fireEvent.press(getByRole('radio'))
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should call onChange with false when selected radio is pressed', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Radio checked={true} onChange={onChange} />)

      fireEvent.press(getByRole('radio'))
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Disabled State', () => {
    it('should not call onChange when disabled', () => {
      const onChange = vi.fn()
      const { getByRole } = render(
        <Radio checked={false} onChange={onChange} disabled />
      )

      fireEvent.press(getByRole('radio'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should render disabled radio', () => {
      const { getByRole } = render(<Radio disabled />)
      expect(getByRole('radio')).toBeTruthy()
    })
  })

  describe('Label', () => {
    it('should render label text', () => {
      const { getByText } = render(<Radio label="Option A" />)
      expect(getByText('Option A')).toBeTruthy()
    })

    it('should render optional indicator', () => {
      const { getByText } = render(<Radio label="Option B" optional />)
      expect(getByText('Option B')).toBeTruthy()
      expect(getByText(/optional/)).toBeTruthy()
    })
  })
})
