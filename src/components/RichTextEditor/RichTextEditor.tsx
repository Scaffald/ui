/**
 * RichTextEditor – minimal plain-text editor by default.
 * No TipTap dependency. For full rich text, render a TipTap editor as children.
 */

import { View, TextInput, Text } from 'react-native'
import type { RichTextEditorProps } from './RichTextEditor.types'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'

const DEFAULT_MIN_HEIGHT = 120

export function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  minHeight = DEFAULT_MIN_HEIGHT,
  error,
  errorMessage,
  showCharacterCount = false,
  maxLength,
  style,
  children,
}: RichTextEditorProps) {
  const { theme } = useThemeContext()
  if (children != null) {
    return <View style={style}>{children}</View>
  }

  const displayError = typeof error === 'string' ? error : errorMessage
  const count = value.length

  return (
    <View style={[{ minHeight }, style]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled && !readOnly}
        multiline
        maxLength={maxLength}
        style={{
          minHeight,
          padding: 12,
          fontSize: 14,
          color: colors.text[theme].primary,
          backgroundColor: colors.bg[theme].default,
          borderWidth: 1,
          borderColor: displayError ? colors.border[theme].error : colors.border[theme].default,
          borderRadius: 8,
          textAlignVertical: 'top',
        }}
      />
      {(showCharacterCount && maxLength != null) && (
        <Text style={{ fontSize: 12, color: colors.text[theme].tertiary, marginTop: 4 }}>
          {count} / {maxLength}
        </Text>
      )}
      {displayError && (
        <Text style={{ fontSize: 12, color: colors.text[theme].error, marginTop: 4 }}>{displayError}</Text>
      )}
    </View>
  )
}
