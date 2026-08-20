/**
 * Screen primitives — the prototype-parity set, shown together.
 *
 * Composed rather than isolated: these four are meant to stack into one screen
 * header, and the thing worth reviewing is whether they read as one system.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ScreenHeader } from '../../../components/ScreenHeader'
import { ListToolbar } from '../../../components/ListToolbar'
import { MetricBlock, MetricRow } from '../../../components/Metric'
import { Lane, LaneGroup } from '../../../components/Lane'
import { SegmentedControl } from '../../../components/SegmentedControl'
import { Text } from '../../../components/Typography/Text'
import { colors } from '../../../tokens/colors'
import { spacing } from '../../../tokens/spacing'

const meta: Meta = {
  title: 'Components/Screen primitives',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const Frame = ({ children }: { children: React.ReactNode }) => (
  <View style={{ padding: spacing[32], backgroundColor: colors.bg.light.subtle, minHeight: 600 }}>
    {children}
  </View>
)

const muted = { fontSize: 14, color: colors.text.light.tertiary }

/** The employer pipeline, as the prototype draws it. */
export const EmployerPipeline: Story = {
  render: () => (
    <Frame>
      <ScreenHeader
        kicker="Employer view — applicant workflow"
        title="Applications"
        tip="Move candidates between stages with the arrows — the worker sees each move as honest progress, not silence."
        pager={{ index: 1, total: 5, onNext: () => {} }}
        onToggleCollapsed={() => {}}
        actions={
          <SegmentedControl
            segments={['Lanes', 'Board', 'Metrics']}
            selectedIndex={0}
            onSelectionChange={() => {}}
            style={{ width: 260 }}
          />
        }
      >
        <MetricRow bordered>
          <MetricBlock label="Response rate" value="84%" delta="▲ 6%" tone="positive" />
          <MetricBlock label="Median first response" value="1.8d" delta="target 3d" />
          <MetricBlock label="Ghost rate" value="9%" delta="down from 14%" tone="positive" />
          <MetricBlock label="Over SLA" value="5" emphasis delta="3 due today" tone="attention" />
        </MetricRow>

        <View style={{ marginTop: spacing[16] }}>
          <ListToolbar
            searchValue=""
            onSearchChange={() => {}}
            searchPlaceholder="Search candidates..."
            activeFilterCount={2}
            filterContent={<Text>Filter controls go here</Text>}
            chips={[
              { id: 'job', label: 'Job', value: 'Site Electrical Lead', onPress: () => {}, onClear: () => {}, active: true },
              { id: 'src', label: 'Source', value: 'Referral', onPress: () => {}, onClear: () => {} },
            ]}
            onClearAll={() => {}}
            resultCount={14}
            resultNoun="application"
          />
        </View>
      </ScreenHeader>

      <View style={{ marginTop: spacing[32] }}>
        <LaneGroup
          title="New"
          count={3}
          hint="untouched — the first-response clock is running"
          tone="attention"
        >
          <Lane
            age="8d"
            overdue
            title="Alice Chen"
            subtitle="Site Electrical Lead"
            note="Overdue — no first response yet"
            columns={[
              <Text key="s" style={muted}>score 88</Text>,
              <Text key="src" style={muted}>Scaffald</Text>,
              <Text key="u" style={muted}>IBEW 48 · journeyman</Text>,
              <Text key="a" style={muted}>Unassigned</Text>,
            ]}
            onPress={() => {}}
          />
          <Lane
            age="2d"
            title="Priya Nair"
            subtitle="Site Electrical Lead"
            columns={[
              <Text key="s" style={muted}>score 77</Text>,
              <Text key="src" style={muted}>Referral</Text>,
              <Text key="u" style={muted}>IBEW 48 · apprentice</Text>,
              <Text key="a" style={muted}>Assigned</Text>,
            ]}
            onPress={() => {}}
          />
          <Lane
            age="<1d"
            title="Elena Vasquez"
            subtitle="Site Electrical Lead"
            columns={[
              <Text key="s" style={muted}>score 91</Text>,
              <Text key="src" style={muted}>Scaffald</Text>,
              <Text key="u" style={muted}>—</Text>,
              <Text key="a" style={muted}>Unassigned</Text>,
            ]}
            onPress={() => {}}
          />
        </LaneGroup>

        <LaneGroup
          title="Interview"
          count={0}
          hint="scheduled or in progress"
          emptyState={<Text style={muted}>No interviews booked.</Text>}
        />
      </View>
    </Frame>
  ),
}

/** Header alone, with every part optional turned off. */
export const MinimalHeader: Story = {
  render: () => (
    <Frame>
      <ScreenHeader title="Jobs" />
    </Frame>
  ),
}

/** The metric block's ordering contract: label, figure, delta. */
export const Metrics: Story = {
  render: () => (
    <Frame>
      <MetricRow bordered>
        <MetricBlock label="Search appearances" value="342" delta="▲ 8%" tone="positive" />
        <MetricBlock label="Profile views" value="128" delta="▲ 12%" tone="positive" />
        <MetricBlock label="Shortlists" value="9" delta="3 this week" />
        <MetricBlock label="Invitations" value="2" delta="Both new" tone="attention" />
      </MetricRow>
    </Frame>
  ),
}
