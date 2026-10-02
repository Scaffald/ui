/**
 * ScreenHeader stories.
 *
 * Every part except `title` is optional, and the point of the component is that
 * a screen using only the title looks right next to one using all of it. So the
 * stories are mostly combinations, not variants: Minimal through Everything.
 */

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'
import { ScreenHeader } from '../../../components/ScreenHeader'
import { Button } from '../../../components/Button'
import { Text } from '../../../components/Typography/Text'
import { useThemeContext } from '../../../theme'
import { colors } from '../../../tokens/colors'
import { spacing } from '../../../tokens/spacing'
import { borderRadius } from '../../../tokens/borders'
import { fontSize } from '../../../tokens/typography'

const meta = {
  title: 'Components/ScreenHeader',
  component: ScreenHeader,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'desktopWide' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScreenHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Stories render full-bleed, so give them the gutter a real screen has. */
function Frame({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext()
  return (
    <View style={[styles.frame, { backgroundColor: colors.bg[theme].default }]}>{children}</View>
  )
}

const TIP =
  'Move candidates between stages with the arrows — the worker sees each move as honest progress, not silence.'

/** Title only. A screen that needs nothing else renders this and nothing moves. */
export const Minimal: Story = {
  args: { title: 'Applications' },
  render: (args) => (
    <Frame>
      <ScreenHeader {...args} />
    </Frame>
  ),
}

/** The kicker is the screen's context, not a second title. */
export const WithKicker: Story = {
  args: { kicker: 'Employer view — applicant workflow', title: 'Applications' },
  render: (args) => (
    <Frame>
      <ScreenHeader {...args} />
    </Frame>
  ),
}

export const WithTip: Story = {
  args: { kicker: 'Employer view — applicant workflow', title: 'Applications', tip: TIP },
  render: (args) => (
    <Frame>
      <ScreenHeader {...args} />
    </Frame>
  ),
}

/**
 * Actions sit on the title row. At 375 they drop below the title rather than
 * squeezing it — switch the viewport to Mobile to see that.
 */
export const WithActions: Story = {
  args: {
    kicker: 'Employer view — applicant workflow',
    title: 'Applications',
    tip: TIP,
  },
  render: (args) => (
    <Frame>
      <ScreenHeader {...args} actions={<Button size="sm">Post a job</Button>} />
    </Frame>
  ),
}

/**
 * The collapse caret only appears when there is a tip to collapse AND an
 * `onToggleCollapsed` to handle it — a caret that hides nothing would be a
 * control that does nothing. Collapsed is controlled so a screen can persist
 * the choice.
 */
export const Collapsible: Story = {
  args: { title: 'Applications' },
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <Frame>
        <ScreenHeader
          {...args}
          kicker="Employer view — applicant workflow"
          tip={TIP}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
        <Text style={styles.hint}>
          collapsed = {String(collapsed)} — the caret is the only way to toggle it
        </Text>
      </Frame>
    )
  },
}

/** Pre-collapsed, which is what a returning reader sees once they have hidden the tip. */
export const Collapsed: Story = {
  args: { title: 'Applications' },
  render: (args) => (
    <Frame>
      <ScreenHeader
        {...args}
        kicker="Employer view — applicant workflow"
        tip={TIP}
        collapsed
        onToggleCollapsed={() => {}}
      />
    </Frame>
  ),
}

/** The pager cycles several tips. Wrapping is the caller's business, so this wraps. */
export const WithPager: Story = {
  args: { title: 'Applications' },
  render: (args) => {
    const tips = [
      TIP,
      'A candidate sitting in Screening past two days is the one to look at first.',
      'Declining with a reason is what turns a rejection into a reference.',
    ]
    const [index, setIndex] = useState(0)
    return (
      <Frame>
        <ScreenHeader
          {...args}
          kicker="Employer view — applicant workflow"
          tip={tips[index]}
          pager={{
            index: index + 1,
            total: tips.length,
            onNext: () => setIndex((i) => (i + 1) % tips.length),
          }}
        />
      </Frame>
    )
  },
}

/** `children` render full-width beneath the tip — transparency banners, stat strips. */
export const WithSlot: Story = {
  args: { title: 'Applications' },
  render: (args) => {
    const { theme } = useThemeContext()
    return (
      <Frame>
        <ScreenHeader {...args} kicker="Employer view — applicant workflow" tip={TIP}>
          <View
            style={[
              styles.slot,
              {
                backgroundColor: colors.bg[theme].subtle,
                borderColor: colors.border[theme].default,
              },
            ]}
          >
            <Text style={{ color: colors.text[theme].secondary, fontSize: fontSize.sm }}>
              Your response time is visible to applicants. Median so far: 1 day.
            </Text>
          </View>
        </ScreenHeader>
      </Frame>
    )
  },
}

/** Every optional part at once — the widest the header ever gets. */
export const Everything: Story = {
  args: { title: 'Applications' },
  render: (args) => {
    const { theme } = useThemeContext()
    const [collapsed, setCollapsed] = useState(false)
    return (
      <Frame>
        <ScreenHeader
          {...args}
          kicker="Employer view — applicant workflow"
          tip={TIP}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          pager={{ index: 1, total: 5, onNext: () => {} }}
          actions={<Button size="sm">Post a job</Button>}
        >
          <View
            style={[
              styles.slot,
              {
                backgroundColor: colors.bg[theme].subtle,
                borderColor: colors.border[theme].default,
              },
            ]}
          >
            <Text style={{ color: colors.text[theme].secondary, fontSize: fontSize.sm }}>
              Your response time is visible to applicants. Median so far: 1 day.
            </Text>
          </View>
        </ScreenHeader>
      </Frame>
    )
  },
}

/**
 * The same header at 375. Nothing should overflow sideways — the title row
 * wraps rather than scrolling, which is the failure this story exists to catch.
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
  slot: {
    borderWidth: 1,
    borderRadius: borderRadius.l,
    padding: spacing[3],
  },
  hint: {
    fontSize: fontSize.xs,
    opacity: 0.7,
  },
})
