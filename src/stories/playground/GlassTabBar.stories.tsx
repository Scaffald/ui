/**
 * GlassTabBar Playground
 *
 * Visual fidelity sandbox for the floating mobile bottom-nav pill used by
 * scaffald-app's MobileBottomNav. Lets us iterate on glass treatment,
 * active-indicator animation, and tab proportions without auth or the
 * full app context.
 *
 * Once styling is settled, port the visual changes into
 * `packages/scf-core/features/drawer/MobileBottomNav.tsx`.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Bookmark, Briefcase, Home } from 'lucide-react-native'
import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent, Pressable, View } from 'react-native'
import { GlassSurface } from '../../components/GlassSurface'
import { Stack } from '../../components/Layout'
import { Text } from '../../components/Typography'
import { useThemeContext } from '../../theme'
import { colors, glassVibrantColors } from '../../tokens'

// ── Constants (mirror MobileBottomNav.tsx) ──

const PILL_HEIGHT = 56
const TAB_VERTICAL_PAD = 6
const ICON_SIZE = 22
const LABEL_FONT_SIZE = 11
const ACTIVE_INDICATOR_RADIUS = 22
const PILL_HORIZONTAL_PAD = 6

type IconLike = ComponentType<{ size?: number; color?: string }>

type Tab = { key: string; label: string; icon: IconLike }

const DEFAULT_TABS: Tab[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'jobs', label: 'Jobs', icon: Briefcase },
  { key: 'community', label: 'Community', icon: Bookmark },
]

type GlassTabBarProps = {
  tabs?: Tab[]
  activeIndex?: number
  onChangeActive?: (index: number) => void
  showLabels?: boolean
  width?: number
}

function GlassTabBar({
  tabs = DEFAULT_TABS,
  activeIndex = 0,
  onChangeActive,
  showLabels = true,
  width = 358,
}: GlassTabBarProps) {
  const { theme } = useThemeContext()
  const resolvedTheme: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light'
  const vibrant = glassVibrantColors[resolvedTheme]
  const inactiveText = vibrant.tertiaryText
  const activeText = colors.primary[600]
  const activeBg =
    resolvedTheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.06)'

  const indicatorX = useRef(new Animated.Value(0)).current
  const indicatorWidth = useRef(new Animated.Value(0)).current
  const tabLayoutsRef = useRef<Array<{ x: number; width: number } | null>>(
    tabs.map(() => null)
  )

  useEffect(() => {
    const layout = tabLayoutsRef.current[activeIndex]
    if (!layout) return
    Animated.parallel([
      Animated.timing(indicatorX, {
        toValue: layout.x,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(indicatorWidth, {
        toValue: layout.width,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start()
  }, [activeIndex, indicatorX, indicatorWidth])

  const handleTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width: w } = event.nativeEvent.layout
    const next = { x, width: w }
    const prev = tabLayoutsRef.current[index]
    tabLayoutsRef.current[index] = next
    if (index === activeIndex && (!prev || prev.x !== x || prev.width !== w)) {
      indicatorX.setValue(x)
      indicatorWidth.setValue(w)
    }
  }

  return (
    <View style={{ width, paddingHorizontal: 16, paddingVertical: 8 }}>
      <GlassSurface
        material="regular"
        radius="3xl"
        elevated
        style={{ height: PILL_HEIGHT }}
      >
        <View
          style={{
            height: PILL_HEIGHT,
            flexDirection: 'row',
            alignItems: 'stretch',
            paddingHorizontal: PILL_HORIZONTAL_PAD,
            position: 'relative',
          }}
        >
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: TAB_VERTICAL_PAD,
              bottom: TAB_VERTICAL_PAD,
              left: 0,
              transform: [{ translateX: indicatorX }],
              width: indicatorWidth,
              borderRadius: ACTIVE_INDICATOR_RADIUS,
              backgroundColor: activeBg,
            }}
          />
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = index === activeIndex
            return (
              <Pressable
                key={tab.key}
                onPress={() => onChangeActive?.(index)}
                onLayout={handleTabLayout(index)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: TAB_VERTICAL_PAD,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Icon size={ICON_SIZE} color={isActive ? activeText : inactiveText} />
                {showLabels ? (
                  <Text
                    size="xs"
                    weight={isActive ? 'semibold' : 'medium'}
                    style={{
                      marginTop: 2,
                      fontSize: LABEL_FONT_SIZE,
                      color: isActive ? activeText : inactiveText,
                    }}
                  >
                    {tab.label}
                  </Text>
                ) : null}
              </Pressable>
            )
          })}
        </View>
      </GlassSurface>
    </View>
  )
}

// ── Storybook ──

const meta: Meta<typeof GlassTabBar> = {
  title: 'Playground/GlassTabBar',
  component: GlassTabBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Floating glass-pill bottom navigation. Mirrors the MobileBottomNav used in scaffald-app for visual iteration. Use the controls to change active tab, toggle labels, or test against varied widths.',
      },
    },
  },
  argTypes: {
    activeIndex: {
      control: { type: 'number', min: 0, max: 2, step: 1 },
    },
    showLabels: { control: 'boolean' },
    width: { control: { type: 'number', min: 280, max: 480, step: 8 } },
  },
}

export default meta

type Story = StoryObj<typeof GlassTabBar>

/**
 * Default 3-tab glass pill with Home active. Tap a tab to animate the
 * active-indicator pill between positions.
 */
export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeIndex ?? 0)
    return (
      <GlassTabBar
        {...args}
        activeIndex={active}
        onChangeActive={setActive}
      />
    )
  },
  args: {
    activeIndex: 0,
    showLabels: true,
    width: 358,
  },
}

/** Tabs without labels (icons-only). Useful for compact viewports. */
export const IconsOnly: Story = {
  ...Default,
  args: { ...Default.args, showLabels: false },
}

/** Render against a content background to gauge glass material legibility. */
export const OverContent: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeIndex ?? 0)
    return (
      <View style={{ width: 390, height: 600 }}>
        {/* Mock page content */}
        <Stack
          gap={12}
          style={{ padding: 16, flex: 1 }}
        >
          <View
            style={{
              height: 220,
              borderRadius: 16,
              backgroundColor: '#d4c5a9',
            }}
          />
          <View
            style={{
              height: 120,
              borderRadius: 16,
              backgroundColor: '#9bb5a3',
            }}
          />
          <View
            style={{
              height: 80,
              borderRadius: 16,
              backgroundColor: '#3a2f2a',
            }}
          />
          <View style={{ flex: 1 }} />
        </Stack>
        {/* Floating bar pinned bottom */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 8,
          }}
        >
          <GlassTabBar
            {...args}
            activeIndex={active}
            onChangeActive={setActive}
          />
        </View>
      </View>
    )
  },
  args: { ...Default.args },
}

/** Wide viewport — verifies tab proportions don't break at tablet width. */
export const WideViewport: Story = {
  ...Default,
  args: { ...Default.args, width: 480 },
}

/** Narrow viewport — verifies icon + label still legible on small phones. */
export const NarrowViewport: Story = {
  ...Default,
  args: { ...Default.args, width: 320 },
}
