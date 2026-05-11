/**
 * AccordionContent component
 * Collapsible content area for accordion items. Mount/unmount is driven by
 * the item's `isExpanded` flag; the surrounding layout shift is animated by
 * `LayoutAnimation` (configured at the Accordion root before the state
 * change).
 */

import { StyleSheet, Text, View } from 'react-native'
import type { AccordionContentProps } from './Accordion.types'
import { useAccordionItemContext } from './AccordionItem'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { useThemeContext } from '../../theme'

export function AccordionContent({
  children,
  containerStyle,
  contentStyle,
}: AccordionContentProps) {
  const itemContext = useAccordionItemContext()
  const { theme } = useThemeContext()

  if (!itemContext.isExpanded) {
    return null
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.border[theme].default,
          },
        ]}
      />

      {typeof children === 'string' ? (
        <Text
          style={[
            styles.content,
            {
              color: colors.text[theme].secondary,
            },
            contentStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        <View style={styles.customContent}>{children}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[12],
    gap: spacing[12],
  },
  divider: {
    height: 1,
    width: '100%',
  },
  content: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.small.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.small.lineHeight,
  },
  customContent: {},
})
