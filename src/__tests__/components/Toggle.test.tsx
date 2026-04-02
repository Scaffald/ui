import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-native-svg', () => {
  const React = require('react')
  const Svg = (props: Record<string, unknown>) => React.createElement('svg', props)
  const Path = (props: Record<string, unknown>) => React.createElement('path', props)
  return { default: Svg, Svg, Path }
})

import { Toggle } from '../../components/Toggle'

describe('Toggle', () => {
  describe('Rendering', () => {
    it('should render off by default', () => {
      const { getByRole } = render(<Toggle />)
      expect(getByRole('switch')).toBeTruthy()
    })

    it('should render on when checked is true', () => {
      const { getByRole } = render(<Toggle checked={true} onChange={vi.fn()} />)
      expect(getByRole('switch')).toBeTruthy()
    })

    it('should render off when checked is false', () => {
      const { getByRole } = render(<Toggle checked={false} onChange={vi.fn()} />)
      expect(getByRole('switch')).toBeTruthy()
    })
  })

  describe('onChange Callback', () => {
    it('should call onChange with true when toggled on', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Toggle checked={false} onChange={onChange} />)

      fireEvent.press(getByRole('switch'))
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('should call onChange with false when toggled off', () => {
      const onChange = vi.fn()
      const { getByRole } = render(<Toggle checked={true} onChange={onChange} />)

      fireEvent.press(getByRole('switch'))
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Disabled State', () => {
    it('should not call onChange when disabled', () => {
      const onChange = vi.fn()
      const { getByRole } = render(
        <Toggle checked={false} onChange={onChange} disabled />
      )

      fireEvent.press(getByRole('switch'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should render disabled toggle', () => {
      const { getByRole } = render(<Toggle disabled />)
      expect(getByRole('switch')).toBeTruthy()
    })
  })

  describe('Label', () => {
    it('should render label text', () => {
      const { getByText } = render(<Toggle label="Dark Mode" />)
      expect(getByText('Dark Mode')).toBeTruthy()
    })

    it('should render optional indicator', () => {
      const { getByText } = render(<Toggle label="Notifications" optional />)
      expect(getByText('Notifications')).toBeTruthy()
      expect(getByText(/optional/)).toBeTruthy()
    })

    it('should render helper text', () => {
      const { getByText } = render(
        <Toggle label="Dark Mode" helperText="Switch to dark theme" />
      )
      expect(getByText('Switch to dark theme')).toBeTruthy()
    })
  })
})
