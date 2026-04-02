import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-native-svg', () => {
  const React = require('react')
  const Svg = (props: Record<string, unknown>) => React.createElement('svg', props)
  const Path = (props: Record<string, unknown>) => React.createElement('path', props)
  return { default: Svg, Svg, Path }
})

import { Input } from '../../components/Input'

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('should render with placeholder', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" />
      )
      expect(getByPlaceholderText('Enter text')).toBeTruthy()
    })

    it('should render without crashing when no props provided', () => {
      const { container } = render(<Input />)
      expect(container).toBeTruthy()
    })
  })

  describe('Controlled Value', () => {
    it('should display controlled value', () => {
      const { getByDisplayValue } = render(
        <Input value="hello" onChangeText={vi.fn()} />
      )
      expect(getByDisplayValue('hello')).toBeTruthy()
    })

    it('should call onChangeText when text changes', () => {
      const onChangeText = vi.fn()
      const { getByPlaceholderText } = render(
        <Input placeholder="Type here" value="" onChangeText={onChangeText} />
      )

      fireEvent.changeText(getByPlaceholderText('Type here'), 'new value')
      expect(onChangeText).toHaveBeenCalledWith('new value')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Disabled" disabled />
      )
      const input = getByPlaceholderText('Disabled')
      expect(input).toBeTruthy()
    })
  })

  describe('Error State', () => {
    it('should render error message when error is true', () => {
      const { getByText } = render(
        <Input error errorMessage="This field is required" />
      )
      expect(getByText('This field is required')).toBeTruthy()
    })

    it('should render helper text when no error', () => {
      const { getByText } = render(
        <Input helperText="Enter your email address" />
      )
      expect(getByText('Enter your email address')).toBeTruthy()
    })

    it('should show error message instead of helper text when error is true', () => {
      const { getByText, queryByText } = render(
        <Input
          error
          errorMessage="Invalid email"
          helperText="Enter your email address"
        />
      )
      expect(getByText('Invalid email')).toBeTruthy()
      expect(queryByText('Enter your email address')).toBeNull()
    })
  })

  describe('Label', () => {
    it('should render label text', () => {
      const { getByText } = render(
        <Input label="Email" placeholder="Enter email" />
      )
      expect(getByText('Email')).toBeTruthy()
    })

    it('should not render label when not provided', () => {
      const { queryByText } = render(
        <Input placeholder="No label" />
      )
      expect(queryByText('Email')).toBeNull()
    })
  })
})
