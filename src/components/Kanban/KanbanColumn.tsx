import { View, Text } from 'react-native'
import { Plus, MoreHorizontal } from 'lucide-react-native'
import { Stack } from '../Layout'
import { Row } from '../Layout'
import { Button } from '../Button'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import type { KanbanColumnProps } from './Kanban.types'

export function KanbanColumn({
  id,
  title,
  color,
  count,
  onAdd,
  onMenuClick,
  emptyMessage = 'No items',
  children,
}: KanbanColumnProps) {
  const { theme: __theme } = useThemeContext()
  const t = __theme === 'dark' ? 'dark' : 'light'
  const accentColor = color ?? colors.primary[500]
  const childArray = Array.isArray(children) ? children : children ? [children] : []
  const hasItems = childArray.length > 0

  return (
    <View
      style={{
        width: 320,
        minHeight: 200,
        backgroundColor: colors.bg[t].subtle,
        borderRadius: borderRadius.l,
        padding: spacing[4],
        gap: spacing[4],
      }}
      testID={`kanban-column-${id}`}
    >
      <Row justify="space-between" align="center">
        <Row align="center" gap={spacing[2]}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: accentColor,
            }}
          />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text[t].primary }}>
            {title}
          </Text>
          {count !== undefined && (
            <View
              style={{
                backgroundColor: colors.bg[t].muted,
                paddingHorizontal: spacing[2],
                paddingVertical: 2,
                borderRadius: borderRadius.s,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.text[t].secondary }}>{count}</Text>
            </View>
          )}
        </Row>
        <Row gap={spacing[2]}>
          {onAdd && (
            <Button variant="text" color="gray" size="sm" onPress={onAdd} iconStart={Plus} />
          )}
          {onMenuClick && (
            <Button
              variant="text"
              color="gray"
              size="sm"
              onPress={onMenuClick}
              iconStart={MoreHorizontal}
            />
          )}
        </Row>
      </Row>
      <Stack gap={spacing[2]} style={{ flex: 1, minHeight: 120 }}>
        {hasItems ? children : (
          <View
            style={{
              flex: 1,
              minHeight: 120,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: borderRadius.m,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.gray[300],
            }}
          >
            <Text style={{ fontSize: 14, color: colors.text[t].secondary }}>{emptyMessage}</Text>
          </View>
        )}
      </Stack>
    </View>
  )
}
