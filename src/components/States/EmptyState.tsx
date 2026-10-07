/**
 * EmptyState – centered empty state with optional icon and actions
 * Use when lists, search results, or data views have no content.
 */

import { View } from 'react-native'
import { Stack, Row } from '../Layout'
import { Paragraph, Text } from '../Typography'
import { Button } from '../Button'
import { spacing } from '../../tokens/spacing'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'
import { borderRadius } from '../../tokens/borders'
import type { EmptyStateProps } from './States.types'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  children,
}: EmptyStateProps) {
  // The icon disc was gray-100 with a gray-600 glyph in both themes: a white
  // circle on the dark ground (Scaffald/SaaS#1024 captures).
  const { theme } = useThemeContext()
  const t = theme === 'dark' ? 'dark' : 'light'
  return (
    <Stack
      align="center"
      style={{ paddingVertical: spacing[12], paddingHorizontal: spacing[4] }}
    >
      {Icon && (
        <Row justify="center" style={{ marginBottom: spacing[4] }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: borderRadius.max,
              backgroundColor: colors.bg[t].muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={32} color={colors.icon[t].muted} />
          </View>
        </Row>
      )}
      <Text
        size="lg"
        weight="semibold"
        color="secondary"
        align="center"
        style={{ marginBottom: spacing[2] }}
      >
        {title}
      </Text>
      {description && (
        <Paragraph
          color="tertiary"
          align="center"
          style={{ marginBottom: spacing[6], maxWidth: 448 }}
        >
          {description}
        </Paragraph>
      )}
      {children}
      {(action || secondaryAction) && (
        <Row
          align="center"
          justify="center"
          gap={spacing[4]}
          style={{ marginTop: spacing[6] }}
        >
          {action && (
            <Button
              onPress={action.onPress}
              variant={action.variant ?? 'filled'}
              size={action.size ?? 'md'}
              color={action.color ?? 'primary'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onPress={secondaryAction.onPress}
              variant={secondaryAction.variant ?? 'outline'}
              size={secondaryAction.size ?? 'md'}
              color={secondaryAction.color ?? 'gray'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Row>
      )}
    </Stack>
  )
}
