/**
 * NotificationTag – small badge/tag for notification counts or labels.
 */

import { Row } from '../Layout'
import { Text } from '../Typography'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import type { NotificationTagProps } from './NotificationTag.types'

const sizeStyles = {
  sm: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    fontSize: 12 as const,
  },
  md: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    fontSize: 14 as const,
  },
}

export function NotificationTag({
  size = 'sm',
  children,
  style,
}: NotificationTagProps) {
  const { theme: __theme } = useThemeContext()
  const t = __theme === 'dark' ? 'dark' : 'light'
  const s = sizeStyles[size]
  return (
    <Row
      align="center"
      style={{
        backgroundColor: colors.gray[100],
        borderRadius: borderRadius.m,
        paddingHorizontal: s.paddingHorizontal,
        paddingVertical: s.paddingVertical,
        ...style,
      }}
    >
      <Text
        style={{
          fontSize: s.fontSize,
          fontWeight: '600',
          color: colors.text[t].secondary,
        }}
      >
        {children}
      </Text>
    </Row>
  )
}
