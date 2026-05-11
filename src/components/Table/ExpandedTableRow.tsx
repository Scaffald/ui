/**
 * ExpandedTableRow component
 * Expandable row component with detailed content. The surrounding
 * mount/unmount and layout shift are animated by `LayoutAnimation`,
 * configured by the parent table before the row is added/removed.
 *
 * @example
 * ```tsx
 * <ExpandedTableRow
 *   variant="default"
 *   fields={[
 *     { label: 'Name', placeholder: 'Enter name', value: name },
 *     { label: 'Email', placeholder: 'Enter email', value: email },
 *   ]}
 *   onFieldChange={(type, value) => console.log(type, value)}
 * />
 * ```
 */

import { Text, View } from 'react-native'
import type { ExpandedTableRowProps } from './ExpandedTableRow.types'
import { getExpandedTableRowStyles } from './ExpandedTableRow.styles'
import { useThemeContext } from '../../theme'
import { Input } from '../Input'
import { TableCell } from './TableCell'
import { spacing } from '../../tokens/spacing'

export function ExpandedTableRow({
  variant = 'default',
  children,
  fields,
  infoItems,
  title,
  onFieldChange,
  style,
  contentStyle,
  columns = 3,
}: ExpandedTableRowProps) {
  const { theme } = useThemeContext()
  const styles = getExpandedTableRowStyles(variant, theme)

  if (children) {
    return (
      <View style={[styles.container, style]}>
        <TableCell type="guideline-vertical-half" width={40} />
        <View style={[styles.contentArea, contentStyle]}>{children}</View>
      </View>
    )
  }

  if (variant === 'variant2') {
    return (
      <View style={[styles.container, style]}>
        <TableCell type="guideline-vertical-f-h" width={40} />

        <View style={[styles.contentArea, contentStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}

          {infoItems && (
            <View style={{ gap: spacing[12] }}>
              {infoItems.map((item, index) => (
                <View key={index} style={{ gap: spacing[4] }}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    )
  }

  const fieldsPerColumn = Math.ceil((fields?.length || 0) / columns)

  return (
    <View style={[styles.container, style]}>
      <TableCell type="guideline-vertical-full" width={40} />

      <View style={[styles.contentArea, contentStyle]}>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const startIndex = colIndex * fieldsPerColumn
          const columnFields = fields?.slice(startIndex, startIndex + fieldsPerColumn) || []

          return (
            <View
              key={colIndex}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {columnFields.map((field, fieldIndex) => (
                <View key={fieldIndex} style={{ marginBottom: spacing[20] }}>
                  <Input
                    label={field.label}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChangeText={(value) => onFieldChange?.(field.type || field.label, value)}
                    required={field.required}
                    helperText={field.helperText}
                    error={field.error}
                    errorMessage={field.errorMessage}
                  />
                </View>
              ))}
            </View>
          )
        })}
      </View>
    </View>
  )
}
