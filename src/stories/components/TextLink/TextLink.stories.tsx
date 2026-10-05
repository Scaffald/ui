import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../../../components/Layout'
import { TextLink } from '../../../components/TextLink'

const meta: Meta<typeof TextLink> = {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: {
    docs: {
      description: {
        component:
          'The one text link: accent, semibold, a trailing arrow, underlined on hover. Replaces the five hand-rolled "See all" links.',
      },
    },
  },
}

export default meta

export const Default: StoryObj<typeof TextLink> = {
  args: { children: 'See all', onPress: () => {} },
}

export const Variants: StoryObj = {
  render: () => (
    <Stack gap={12}>
      <TextLink onPress={() => {}}>See all</TextLink>
      <TextLink onPress={() => {}} size="md">
        Open profile
      </TextLink>
      <TextLink onPress={() => {}} arrow={false}>
        Edit
      </TextLink>
      <TextLink onPress={() => {}} tone="muted">
        Not now
      </TextLink>
    </Stack>
  ),
}
