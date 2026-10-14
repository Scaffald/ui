/**
 * Input Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../../../components/Input'
import { View, StyleSheet } from 'react-native'
import { spacing } from '../../../tokens/spacing'
import { useState } from 'react'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input component for text input fields.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={styles.container}>
        <Input label="Email" placeholder="Enter your email" value={value} onChangeText={setValue} />
      </View>
    )
  },
}

export const States: Story = {
  render: () => {
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState('')
    const [_value3, setValue3] = useState('')
    return (
      <View style={styles.container}>
        <Input label="Default" placeholder="Enter text" value={value1} onChangeText={setValue1} />
        <Input
          label="Disabled"
          placeholder="Cannot edit"
          value={value2}
          onChangeText={setValue2}
          disabled
        />
        <Input
          label="With Value"
          placeholder="Enter text"
          value="Some text value"
          onChangeText={setValue3}
        />
      </View>
    )
  },
}

export const Validation: Story = {
  render: () => {
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState('')
    return (
      <View style={styles.container}>
        <Input
          label="Required Field"
          placeholder="This field is required"
          value={value1}
          onChangeText={setValue1}
          required
        />
        <Input
          label="Email"
          placeholder="Enter email"
          value={value2}
          onChangeText={setValue2}
          error="Please enter a valid email address"
        />
      </View>
    )
  },
}

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={styles.container}>
        <Input
          label="Password"
          placeholder="Enter password"
          value={value}
          onChangeText={setValue}
          helperText="Must be at least 8 characters"
          secureTextEntry
        />
      </View>
    )
  },
}

// An external addon (a URL prefix) beside the field. The field must take the
// rest of the row at any width, and a long value must clip with an ellipsis
// rather than collapse (iOS) or stop at its content width (web)
// (Scaffald/SaaS#1089). The narrow column is a 390pt phone's card.
export const WithExternalAddon: Story = {
  render: () => {
    const [value, setValue] = useState('zach')
    return (
      <View style={styles.container}>
        <Input label="Your Profile URL" value="https://scaffald.com/users/zach" editable={false} />
        <Input
          label="Profile Vanity URL"
          externalAddon="scaffald.com/users/"
          value={value}
          onChangeText={setValue}
        />
        <Input
          label="Long value"
          externalAddon="scaffald.com/users/"
          value="a-very-long-vanity-slug-that-overflows-the-field"
          editable={false}
        />
        <View style={styles.narrow}>
          <Input
            label="Phone width"
            externalAddon="scaffald.com/users/"
            value="zach-sullivan-construction"
            editable={false}
          />
        </View>
      </View>
    )
  },
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[16],
    padding: spacing[16],
    width: 400,
  },
  narrow: {
    width: 300,
  },
})
