/**
 * Lane / LaneGroup stories.
 *
 * A `Lane` row leads with the staleness figure because that is the number that
 * says "act on this". Its middle cells carry their own labels — the row has no
 * column headings, so a bare `88 | Scaffald | — | Unassigned` says what none of
 * its values are.
 *
 * `LaneGroup`'s empty state is the one most worth looking at: a stage with
 * nothing in it should say what would put something there, rather than
 * repeating "No applications" once per stage.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'
import { Lane, LaneGroup } from '../../../components/Lane'
import { Button } from '../../../components/Button'
import { Text } from '../../../components/Typography/Text'
import { useThemeContext } from '../../../theme'
import { colors } from '../../../tokens/colors'
import { spacing } from '../../../tokens/spacing'
import { fontSize, fontWeight } from '../../../tokens/typography'

const meta = {
  title: 'Components/Lane',
  component: Lane,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'desktopWide' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Lane>

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <View style={[styles.frame, { backgroundColor: colors.bg[theme].default }]}>{children}</View>
  )
}

/** A labelled cell. The caller composes these — the row does not. */
function Cell({ label, value }: { label: string; value: string }) {
  const { theme } = useThemeContext()
  return (
    <View>
      <Text
        style={{
          fontSize: fontSize.h6,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.text[theme].tertiary,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: fontSize.sm, color: colors.text[theme].primary }}>{value}</Text>
    </View>
  )
}

function EmptyStage({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <Text style={{ fontSize: fontSize.sm, color: colors.text[theme].tertiary }}>{children}</Text>
  )
}

/** The least a row can be: a title. */
export const Minimal: Story = {
  args: { title: 'Marcus Rivera' },
  render: (args) => (
    <Frame>
      <Lane {...args} />
    </Frame>
  ),
}

/** Age leads, with the label that says what it counts. */
export const WithAge: Story = {
  args: { title: 'Marcus Rivera', age: '2d', subtitle: 'Journeyman Electrician · Tulsa, OK' },
  render: (args) => (
    <Frame>
      <Lane {...args} />
    </Frame>
  ),
}

/**
 * `ageLabel` defaults to "in stage", which is right for a pipeline row and
 * wrong for an employer's job list — where the same row counts days a posting
 * has been open and used to read "11d in stage" (#835).
 */
export const AgeLabel: Story = {
  args: { title: 'Journeyman Electrician' },
  render: (args) => (
    <Frame>
      <Lane {...args} age="2d" subtitle="Pipeline row — the default" />
      <Lane {...args} age="11d" ageLabel="open" subtitle="Job list row — same component" />
    </Frame>
  ),
}

/** Overdue puts the figure in the attention hue. */
export const Overdue: Story = {
  args: { title: 'Carlos Gutierrez' },
  render: (args) => (
    <Frame>
      <Lane {...args} age="2d" subtitle="Within the first-response promise" />
      <Lane {...args} age="9d" overdue title="Jake Hendricks" subtitle="Past it" />
    </Frame>
  ),
}

/** The full row — cells, note, actions, selection. */
export const Everything: Story = {
  args: { title: 'Marcus Rivera' },
  render: (args) => (
    <Frame>
      <Lane
        {...args}
        age="9d"
        overdue
        subtitle="Journeyman Electrician · Tulsa, OK"
        columns={[
          <Cell key="score" label="Match" value="88" />,
          <Cell key="src" label="Source" value="Scaffald" />,
          <Cell key="cert" label="Certs" value="OSHA 30, NFPA 70E" />,
          <Cell key="owner" label="Owner" value="Unassigned" />,
        ]}
        note="Denver County backlog — chase runner"
        actions={<Button size="sm" variant="outline">Move</Button>}
        onPress={() => {}}
      />
      <Lane
        {...args}
        age="2d"
        title="Carlos Gutierrez"
        subtitle="Apprentice Electrician · Broken Arrow, OK"
        columns={[
          <Cell key="score" label="Match" value="74" />,
          <Cell key="src" label="Source" value="Referral" />,
        ]}
        selected
        onPress={() => {}}
      />
    </Frame>
  ),
}

/** A stage with rows in it. */
export const Group: Story = {
  args: { title: 'Marcus Rivera' },
  render: () => (
    <Frame>
      <LaneGroup
        title="Screening"
        count={2}
        hint="untouched — the first-response clock is running"
        tone="active"
        action={<Button size="sm" variant="outline">Select lane</Button>}
      >
        <Lane
          age="9d"
          overdue
          title="Marcus Rivera"
          subtitle="Journeyman Electrician · Tulsa, OK"
          columns={[<Cell key="s" label="Match" value="88" />]}
        />
        <Lane
          age="2d"
          title="Carlos Gutierrez"
          subtitle="Apprentice Electrician · Broken Arrow, OK"
          columns={[<Cell key="s" label="Match" value="74" />]}
        />
      </LaneGroup>
    </Frame>
  ),
}

/**
 * The empty stage. It says what would put something here — not "No
 * applications" for the seventh time down the board.
 */
export const GroupEmpty: Story = {
  args: { title: 'Marcus Rivera' },
  render: () => (
    <Frame>
      <LaneGroup
        title="Offer out"
        count={0}
        hint="waiting on the candidate"
        emptyState={
          <EmptyStage>
            Nothing here yet. Move someone from Screening once you have agreed terms.
          </EmptyStage>
        }
      />
    </Frame>
  ),
}

/** Tones. `attention` marks a stage that is behind, not a stage that is busy. */
export const GroupTones: Story = {
  args: { title: 'Marcus Rivera' },
  render: () => (
    <Frame>
      <LaneGroup title="New" count={4} tone="neutral" hint="nobody has looked yet" />
      <LaneGroup title="Screening" count={2} tone="active" hint="in progress" />
      <LaneGroup title="Order review" count={3} tone="attention" hint="two are past the promise" />
    </Frame>
  ),
}

/** A board: several stages, one of them empty. */
export const Board: Story = {
  args: { title: 'Marcus Rivera' },
  render: () => (
    <Frame>
      <LaneGroup title="New" count={1} tone="neutral" hint="nobody has looked yet">
        <Lane age="1d" title="Dana Whitfield" subtitle="Plumber · Jenks, OK" />
      </LaneGroup>
      <LaneGroup title="Screening" count={2} tone="attention" hint="one is past the promise">
        <Lane age="9d" overdue title="Marcus Rivera" subtitle="Journeyman Electrician" />
        <Lane age="2d" title="Carlos Gutierrez" subtitle="Apprentice Electrician" />
      </LaneGroup>
      <LaneGroup
        title="Offer out"
        count={0}
        hint="waiting on the candidate"
        emptyState={<EmptyStage>Nothing here yet. Move someone from Screening.</EmptyStage>}
      />
    </Frame>
  ),
}

/**
 * At 375 the middle cells collapse into a vertical list rather than scrolling
 * sideways. `stackBelow` sets the width that happens at.
 */
export const Mobile: Story = {
  ...Everything,
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

/** The whole board at 375 — the layout the pipeline is read on most. */
export const BoardMobile: Story = {
  ...Board,
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

const styles = StyleSheet.create({
  frame: {
    padding: spacing[6],
    gap: spacing[4],
  },
})
