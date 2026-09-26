/**
 * Tabs component
 * Compound component for creating tab navigation
 *
 * @example
 * ```tsx
 * import { Tabs } from '@scaffald/ui'
 *
 * // Basic tabs
 * <Tabs defaultValue="tab1">
 *   <Tabs.Item value="tab1">
 *     <Tabs.Trigger>Tab 1</Tabs.Trigger>
 *     <Tabs.Content>Content 1</Tabs.Content>
 *   </Tabs.Item>
 *   <Tabs.Item value="tab2">
 *     <Tabs.Trigger>Tab 2</Tabs.Trigger>
 *     <Tabs.Content>Content 2</Tabs.Content>
 *   </Tabs.Item>
 * </Tabs>
 *
 * // With variants
 * <Tabs
 *   type="line"
 *   color="primary"
 *   size="lg"
 *   orientation="horizontal"
 *   defaultValue="tab1"
 * >
 *   <Tabs.Item value="tab1">
 *     <Tabs.Trigger iconStart={MyIcon}>Tab 1</Tabs.Trigger>
 *     <Tabs.Content>Content 1</Tabs.Content>
 *   </Tabs.Item>
 * </Tabs>
 * ```
 */

import { Children, isValidElement, cloneElement } from 'react'
import { View, ScrollView } from 'react-native'
import { useResponsive } from '../../hooks/useResponsive'
import type { TabsProps, TabItemProps } from './Tabs.types'
import { getTabsStyles, getTabListStyles } from './Tabs.styles'
import { useThemeContext } from '../../theme'
import { TabsContext } from './TabsContext'
import { TabTrigger } from './TabTrigger'
import { TabContent } from './TabContent'
import { useTabs } from './useTabs'

export { useTabsContext } from './TabsContext'

/** The component function behind an element, however it was authored. */
function componentTypeOf(el: React.ReactElement) {
  return el.type as React.FC & { displayName?: string }
}

/** Tolerates the displayName/name variants a bundler may leave behind. */
function isTabContent(t: React.FC & { displayName?: string }) {
  return t === TabContent || t?.displayName === 'TabContent' || t?.name === 'TabContent'
}

/** A readable name for an element, for the dev warning below. */
function nameOf(el: React.ReactElement) {
  const t = componentTypeOf(el)
  return typeof el.type === 'string' ? el.type : t?.displayName || t?.name || 'unknown'
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  type = 'default',
  color = 'gray',
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  fullWidth = false,
  contentVariant = 'default',
  triggerSizing = 'auto',
  scrollable = false,
  wrapBelow = 768,
  children,
  containerStyle,
}: TabsProps) {
  const { theme } = useThemeContext()

  const tabs = useTabs({
    value,
    defaultValue,
    onValueChange,
    type,
    color,
    size,
    orientation,
    disabled,
    fullWidth,
    contentVariant,
    triggerSizing,
  })

  const styles = getTabsStyles(orientation, fullWidth, theme)

  // Below `wrapBelow` a horizontal strip wraps rather than running off the
  // right edge. `scrollable` callers keep their scroller — they asked for one.
  const { width: viewportWidth } = useResponsive()
  const shouldWrap = !scrollable && wrapBelow > 0 && viewportWidth > 0 && viewportWidth < wrapBelow

  // For horizontal layout, separate triggers from content
  // This ensures tab trigger width is independent of content width
  if (orientation === 'horizontal') {
    // Collect TabItems and separate their triggers and content
    const tabItems: Array<{
      value: string
      trigger: React.ReactElement
      content: React.ReactElement | null
      fullItem: React.ReactElement
    }> = []

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const itemValue = (child.props as TabItemProps).value
        const itemChildren = (child.props as TabItemProps).children
        const childrenArray = Children.toArray(itemChildren)

        let trigger: React.ReactElement | null = null
        let content: React.ReactElement | null = null

        childrenArray.forEach((itemChild) => {
          if (isValidElement(itemChild)) {
            const componentType = (itemChild as React.ReactElement).type
            const componentFn = componentType as React.FC & { displayName?: string }
            if (
              componentType === TabTrigger ||
              componentFn?.displayName === 'TabTrigger' ||
              componentFn?.name === 'TabTrigger'
            ) {
              trigger = itemChild as React.ReactElement
            } else if (
              componentType === TabContent ||
              componentFn?.displayName === 'TabContent' ||
              componentFn?.name === 'TabContent'
            ) {
              content = itemChild as React.ReactElement
            }
          }
        })

        if (trigger) {
          tabItems.push({
            value: itemValue,
            trigger,
            content,
            fullItem: child as React.ReactElement,
          })
        } else if (process.env.NODE_ENV !== 'production') {
          // Say so, rather than dropping it (#906).
          //
          // A child with no `TabTrigger` among its own children cannot become a
          // tab, and this branch used to discard it and move on — no render, no
          // warning, no DOM. `TabContent` never ran, so even the
          // "TabItem components must be used within a TabItem" throw inside
          // `useTabItemContext` never fired. That silence is what let four
          // screens ship with a tab strip over empty space (#896).
          const dropped = isTabContent(componentTypeOf(child))
            ? 'a Tabs.Content'
            : `<${nameOf(child)}>`
          console.warn(
            `[Tabs] Ignored ${dropped} passed directly to <Tabs>: it has no ` +
              'Tabs.Trigger among its children, so it cannot become a tab. ' +
              'Nest Tabs.Trigger and Tabs.Content inside a Tabs.Item:\n' +
              '  <Tabs.Item value="x">\n' +
              '    <Tabs.Trigger>X</Tabs.Trigger>\n' +
              '    <Tabs.Content>…</Tabs.Content>\n' +
              '  </Tabs.Item>'
          )
        }
      }
    })

    return (
      <TabsContext.Provider value={tabs}>
        <View style={[{ width: '100%', flexDirection: 'column' }, containerStyle]}>
          {/* Trigger row - scrollable when scrollable prop is true */}
          {scrollable ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
              }}
              style={{ width: '100%' }}
            >
              {tabItems.map((item, index) => {
                return cloneElement(item.fullItem, {
                  key: item.value || `trigger-${index}`,
                  children: item.trigger,
                } as Partial<TabItemProps>)
              })}
            </ScrollView>
          ) : (
            <View style={getTabListStyles(orientation, theme, { wrap: shouldWrap, type })}>
              {tabItems.map((item, index) => {
                return cloneElement(item.fullItem, {
                  key: item.value || `trigger-${index}`,
                  children: item.trigger,
                } as Partial<TabItemProps>)
              })}
            </View>
          )}
          {/* Content area - render content separately while preserving TabItem context */}
          <View style={{ width: '100%' }}>
            {tabItems.map((item, index) => {
              if (!item.content) return null
              return cloneElement(item.fullItem, {
                key: `content-${item.value || index}`,
                children: item.content,
                containerStyle: { alignSelf: 'stretch', flexGrow: 1, flexShrink: 1 },
              } as Partial<TabItemProps>)
            })}
          </View>
        </View>
      </TabsContext.Provider>
    )
  }

  // Vertical layout - keep original structure
  return (
    <TabsContext.Provider value={tabs}>
      <View style={[styles, containerStyle]}>{children}</View>
    </TabsContext.Provider>
  )
}
