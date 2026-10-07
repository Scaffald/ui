import { View } from 'react-native'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import type { KanbanCardProps } from './Kanban.types'

export function KanbanCard({ id, isDragging = false, children }: KanbanCardProps) {
  const { theme: __theme } = useThemeContext()
  const t = __theme === 'dark' ? 'dark' : 'light'
  return (
    <View
      style={{
        padding: spacing[4],
        backgroundColor: colors.bg[t].default,
        borderRadius: borderRadius.m,
        borderWidth: 1,
        borderColor: colors.border[t].default,
        opacity: isDragging ? 0.6 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
      testID={`kanban-card-${id}`}
    >
      {children}
    </View>
  )
}
