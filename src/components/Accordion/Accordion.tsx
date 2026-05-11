/**
 * Accordion component
 * Compound component for creating collapsible accordion menus.
 *
 * Expand/collapse layout changes are animated via `LayoutAnimation`; on web
 * `LayoutAnimation` is a no-op and the change happens instantly.
 *
 * @example
 * ```tsx
 * <Accordion mode="single">
 *   <Accordion.Item value="item1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content 1</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */

import { createContext, useContext, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import type { AccordionProps, AccordionContextValue } from './Accordion.types'
import { spacing } from '../../tokens/spacing'
import { useAccordion } from './useAccordion'
import { useLayoutAnimation } from '../../animation/useLayoutAnimation'

const AccordionContext = createContext<AccordionContextValue | null>(null)

export function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

export function Accordion({
  value,
  defaultValue,
  onValueChange,
  mode = 'single',
  width = 'constrained',
  disabled = false,
  children,
  containerStyle,
}: AccordionProps) {
  const accordion = useAccordion({
    value,
    defaultValue,
    onValueChange,
    mode,
    width,
    disabled,
  })

  const prepareLayoutAnimation = useLayoutAnimation()

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      ...accordion,
      onValueChange: (itemValue: string) => {
        prepareLayoutAnimation()
        accordion.onValueChange(itemValue)
      },
    }),
    [accordion, prepareLayoutAnimation]
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <View style={[styles.container, containerStyle]}>{children}</View>
    </AccordionContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[12],
  },
})
