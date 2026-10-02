/**
 * MetricBlock / MetricRow stories.
 *
 * Two things here are worth looking at rather than reading about: the tone of a
 * delta is stated, not inferred from direction (a rising ghost rate is bad),
 * and the row wraps whole columns below 640 rather than squeezing — the orphan
 * with a stray divider is the bug the prototype's audit flagged.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'
import { MetricBlock, MetricRow } from '../../../components/Metric'
import { Text } from '../../../components/Typography/Text'
import { useThemeContext } from '../../../theme'
import { colors } from '../../../tokens/colors'
import { spacing } from '../../../tokens/spacing'
import { fontSize } from '../../../tokens/typography'

const meta = {
  title: 'Components/Metric',
  component: MetricBlock,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'desktopWide' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricBlock>

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <View style={[styles.frame, { backgroundColor: colors.bg[theme].default }]}>{children}</View>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <Text style={{ fontSize: fontSize.xs, color: colors.text[theme].tertiary }}>{children}</Text>
  )
}

/** The figure alone. The label is always above it. */
export const Block: Story = {
  args: { label: 'Open roles', value: '12' },
  render: (args) => (
    <Frame>
      <MetricBlock {...args} />
    </Frame>
  ),
}

/**
 * Tone is explicit. `up` is not automatically good, which is why these two read
 * the same shape and mean opposite things.
 */
export const Tones: Story = {
  args: { label: 'Open roles', value: '12' },
  render: () => (
    <Frame>
      <MetricRow>
        <MetricBlock label="Open roles" value="12" delta="3 this week" />
        <MetricBlock label="Time to first response" value="1.2d" delta="▼ 18%" tone="positive" />
        <MetricBlock label="Ghosted after apply" value="9%" delta="▲ 4%" tone="attention" />
      </MetricRow>
      <Caption>
        The middle figure falling is good; the right figure rising is bad. Both are deltas
        — only `tone` says which.
      </Caption>
    </Frame>
  ),
}

/** `emphasis` puts the figure itself in the attention hue — for an over-SLA count. */
export const Emphasis: Story = {
  args: { label: 'Over SLA', value: '4' },
  render: () => (
    <Frame>
      <MetricRow>
        <MetricBlock label="In screening" value="18" />
        <MetricBlock label="Over SLA" value="4" delta="needs a decision today" emphasis tone="attention" />
      </MetricRow>
    </Frame>
  ),
}

/** Hairlines above and below, which is how the row reads inside a card. */
export const Bordered: Story = {
  args: { label: 'Open roles', value: '12' },
  render: () => (
    <Frame>
      <MetricRow bordered>
        <MetricBlock label="Open roles" value="12" />
        <MetricBlock label="Applicants" value="248" />
        <MetricBlock label="In screening" value="18" />
        <MetricBlock label="Hired this month" value="3" delta="▲ 1" tone="positive" />
      </MetricRow>
    </Frame>
  ),
}

/**
 * Six blocks. At 1440 they sit in one hairline-divided row; below 640 they stack
 * and separate horizontally instead, because a vertical rule on the first cell
 * of a second line reads as a stray divider hanging off the edge.
 *
 * Switch the viewport between Desktop wide and Mobile to see the two layouts.
 * The threshold is the window width, not the container.
 */
export const WrapAt640: Story = {
  args: { label: 'Open roles', value: '12' },
  render: () => (
    <Frame>
      <MetricRow bordered>
        <MetricBlock label="Open roles" value="12" />
        <MetricBlock label="Applicants" value="248" />
        <MetricBlock label="In screening" value="18" />
        <MetricBlock label="Offers out" value="5" />
        <MetricBlock label="Hired" value="3" delta="▲ 1" tone="positive" />
        <MetricBlock label="Over SLA" value="4" emphasis tone="attention" />
      </MetricRow>
      <Caption>
        Six-up. The sixth is the one that used to orphan onto a second line with a stray
        divider.
      </Caption>
    </Frame>
  ),
}

/** The same six at 375, stacked. */
export const WrapAt640Mobile: Story = {
  ...WrapAt640,
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

/**
 * `minColumnWidth` decides how early columns give up on sharing a line. The
 * default is 140; a row of long figures wants more.
 */
export const MinColumnWidth: Story = {
  args: { label: 'Open roles', value: '12' },
  render: () => (
    <Frame>
      <MetricRow bordered minColumnWidth={220}>
        <MetricBlock label="Median time to first response" value="1.2 days" />
        <MetricBlock label="Applications per open role" value="20.7" />
        <MetricBlock label="Offer acceptance rate" value="78%" delta="▲ 6%" tone="positive" />
      </MetricRow>
      <Caption>minColumnWidth = 220, for figures that carry their units.</Caption>
    </Frame>
  ),
}

const styles = StyleSheet.create({
  frame: {
    padding: spacing[6],
    gap: spacing[4],
  },
})
