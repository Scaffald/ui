import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import { Text } from 'react-native'

describe('Dropdown', () => {
  describe('Basic Rendering', () => {
    it('should render with default trigger text', () => {
      const { getByText } = render(
        <Dropdown>
          <Text>Item 1</Text>
        </Dropdown>
      )
      expect(getByText('Select')).toBeTruthy()
    })

    it('should render with custom trigger text', () => {
      const { getByText } = render(
        <Dropdown trigger="Choose option">
          <Text>Item 1</Text>
        </Dropdown>
      )
      expect(getByText('Choose option')).toBeTruthy()
    })

    it('should not show menu by default', () => {
      const { queryByText } = render(
        <Dropdown trigger="Select">
          <Text>Menu Item</Text>
        </Dropdown>
      )
      expect(queryByText('Menu Item')).toBeNull()
    })
  })

  describe('Trigger Interaction', () => {
    it('should show menu when trigger is pressed', () => {
      const { getByText } = render(
        <Dropdown trigger="Select">
          <Text>Menu Item</Text>
        </Dropdown>
      )

      fireEvent.press(getByText('Select'))
      expect(getByText('Menu Item')).toBeTruthy()
    })

    it('should hide menu when trigger is pressed again', () => {
      const { getByText, queryByText } = render(
        <Dropdown trigger="Select">
          <Text>Menu Item</Text>
        </Dropdown>
      )

      fireEvent.press(getByText('Select'))
      expect(getByText('Menu Item')).toBeTruthy()

      fireEvent.press(getByText('Select'))
      expect(queryByText('Menu Item')).toBeNull()
    })
  })

  describe('Disabled State', () => {
    it('should not open menu when disabled', () => {
      const { getByText, queryByText } = render(
        <Dropdown trigger="Select" disabled>
          <Text>Menu Item</Text>
        </Dropdown>
      )

      fireEvent.press(getByText('Select'))
      expect(queryByText('Menu Item')).toBeNull()
    })
  })

  describe('Controlled Mode', () => {
    it('should call onOpenChange when trigger is pressed', () => {
      const onOpenChange = vi.fn()
      const { getByText } = render(
        <Dropdown trigger="Select" open={false} onOpenChange={onOpenChange}>
          <Text>Menu Item</Text>
        </Dropdown>
      )

      fireEvent.press(getByText('Select'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })
})
