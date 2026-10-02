/**
 * ListToolbar stories.
 *
 * The toolbar exists because the prototype's audit found four phrasings of the
 * result count and two competing filter idioms across the app. So the stories
 * lean on the slots that drift: the count at 0 / 1 / many, and the difference
 * between the filter flyout (where you set filters) and the chip strip (where
 * you remove ones you already set).
 */

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'
import { ListToolbar } from '../../../components/ListToolbar'
import type { ListToolbarFilterChip } from '../../../components/ListToolbar'
import { Button } from '../../../components/Button'
import { Text } from '../../../components/Typography/Text'
import { useThemeContext } from '../../../theme'
import { colors } from '../../../tokens/colors'
import { spacing } from '../../../tokens/spacing'
import { fontSize } from '../../../tokens/typography'

const meta = {
  title: 'Components/ListToolbar',
  component: ListToolbar,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'desktopWide' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ListToolbar>

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <View style={[styles.frame, { backgroundColor: colors.bg[theme].default }]}>{children}</View>
  )
}

/** Search only — the least a list screen can have. */
export const SearchOnly: Story = {
  args: {},
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <Frame>
        <ListToolbar
          {...args}
          searchValue={value}
          onSearchChange={setValue}
          searchPlaceholder="Search applicants"
        />
      </Frame>
    )
  },
}

/**
 * The count is one template everywhere: "{n} {noun}". These three are the cases
 * that used to be phrased differently on different screens — note that zero
 * still reads as a count, not as an empty state.
 */
export const ResultCountZero: Story = {
  args: { resultCount: 0, resultNoun: 'applicant' },
  render: (args) => (
    <Frame>
      <ListToolbar {...args} searchPlaceholder="Search applicants" />
    </Frame>
  ),
}

export const ResultCountOne: Story = {
  args: { resultCount: 1, resultNoun: 'applicant' },
  render: (args) => (
    <Frame>
      <ListToolbar {...args} searchPlaceholder="Search applicants" />
    </Frame>
  ),
}

export const ResultCountMany: Story = {
  args: { resultCount: 248, resultNoun: 'applicant' },
  render: (args) => (
    <Frame>
      <ListToolbar {...args} searchPlaceholder="Search applicants" />
    </Frame>
  ),
}

/** An irregular plural, which is why `resultNounPlural` exists. */
export const IrregularPlural: Story = {
  args: { resultCount: 12, resultNoun: 'company', resultNounPlural: 'companies' },
  render: (args) => (
    <Frame>
      <ListToolbar {...args} searchPlaceholder="Search companies" />
    </Frame>
  ),
}

/** The flyout trigger carries the active count: "Filters & sort · 5". */
export const WithActiveFilterCount: Story = {
  args: { resultCount: 37, resultNoun: 'applicant', activeFilterCount: 5 },
  render: (args) => {
    const { theme } = useThemeContext()
    const [open, setOpen] = useState(false)
    return (
      <Frame>
        <ListToolbar
          {...args}
          searchPlaceholder="Search applicants"
          filtersOpen={open}
          onFiltersOpenChange={setOpen}
          filterContent={
            <View style={styles.flyout}>
              <Text style={{ color: colors.text[theme].secondary, fontSize: fontSize.sm }}>
                Stage, trade, distance, certifications, availability — one flyout per
                screen.
              </Text>
            </View>
          }
        />
        <Text style={styles.hint}>filtersOpen = {String(open)}</Text>
      </Frame>
    )
  },
}

/**
 * The chip strip is for filters already applied, so they can be removed without
 * reopening the flyout. It is deliberately NOT a second place to set them.
 */
export const WithChips: Story = {
  args: { resultCount: 37, resultNoun: 'applicant' },
  render: (args) => {
    const [chips, setChips] = useState<ListToolbarFilterChip[]>([
      { id: 'stage', label: 'Stage', value: 'Screening', onPress: () => {}, active: true },
      { id: 'trade', label: 'Trade', value: 'Electrician', onPress: () => {}, active: true },
      { id: 'within', label: 'Within', value: '50 mi', onPress: () => {}, active: true },
    ])
    const withClear = chips.map((c) => ({
      ...c,
      onClear: () => setChips((rest) => rest.filter((x) => x.id !== c.id)),
    }))
    return (
      <Frame>
        <ListToolbar
          {...args}
          searchPlaceholder="Search applicants"
          activeFilterCount={chips.length}
          chips={withClear}
          onClearAll={() => setChips([])}
        />
        <Text style={styles.hint}>
          {chips.length === 0 ? 'all cleared' : `${chips.length} chip(s) — × removes one`}
        </Text>
      </Frame>
    )
  },
}

/** Trailing actions — a view switch, a primary action. */
export const WithActions: Story = {
  args: { resultCount: 248, resultNoun: 'applicant' },
  render: (args) => (
    <Frame>
      <ListToolbar
        {...args}
        searchPlaceholder="Search applicants"
        actions={<Button size="sm">Post a job</Button>}
      />
    </Frame>
  ),
}

/** Everything at once — search, flyout with a count, chips, result count, actions. */
export const Everything: Story = {
  args: {},
  render: (args) => {
    const { theme } = useThemeContext()
    const [value, setValue] = useState('')
    const [open, setOpen] = useState(false)
    const [chips, setChips] = useState<ListToolbarFilterChip[]>([
      { id: 'stage', label: 'Stage', value: 'Screening', onPress: () => {}, active: true },
      { id: 'trade', label: 'Trade', value: 'Electrician', onPress: () => {}, active: true },
    ])
    return (
      <Frame>
        <ListToolbar
          {...args}
          searchValue={value}
          onSearchChange={setValue}
          searchPlaceholder="Search applicants"
          activeFilterCount={chips.length}
          filtersOpen={open}
          onFiltersOpenChange={setOpen}
          filterContent={
            <View style={styles.flyout}>
              <Text style={{ color: colors.text[theme].secondary, fontSize: fontSize.sm }}>
                Stage, trade, distance, certifications, availability.
              </Text>
            </View>
          }
          chips={chips.map((c) => ({
            ...c,
            onClear: () => setChips((rest) => rest.filter((x) => x.id !== c.id)),
          }))}
          onClearAll={() => setChips([])}
          resultCount={37}
          resultNoun="applicant"
          actions={<Button size="sm">Post a job</Button>}
        />
      </Frame>
    )
  },
}

/**
 * At 375 the toolbar stacks. Nothing should scroll sideways — the chip strip is
 * the part most likely to, so it is loaded here.
 */
export const Mobile: Story = {
  ...Everything,
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

const styles = StyleSheet.create({
  frame: {
    padding: spacing[6],
    gap: spacing[4],
  },
  flyout: {
    padding: spacing[3],
    maxWidth: 320,
  },
  hint: {
    fontSize: fontSize.xs,
    opacity: 0.7,
  },
})
