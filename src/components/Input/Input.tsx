/**
 * Input component
 * Fully-featured input component mapped from Figma Forsured Design System
 *
 * Can be used as a complete component or composed from sub-components for maximum flexibility.
 *
 * @example
 * ```tsx
 * import { Input } from '@scaffald/ui'
 *
 * // Basic input (complete component)
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * // Input with error
 * <Input
 *   label="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   error="Password must be at least 8 characters"
 *   required
 * />
 *
 * // Input with external addon
 * <Input
 *   label="Website"
 *   externalAddon="https://"
 *   placeholder="example.com"
 *   value={website}
 *   onChangeText={setWebsite}
 * />
 * ```
 *
 * @example Composable usage
 * ```tsx
 * import {
 *   InputLabel,
 *   InputExternalAddon,
 *   InputLeftSide,
 *   InputRightSide,
 *   InputHelperText
 * } from '@scaffald/ui'
 *
 * // Compose manually for maximum control
 * <View>
 *   <InputLabel required note="(optional)">Custom Label</InputLabel>
 *   <View style={{ flexDirection: 'row' }}>
 *     <InputExternalAddon>https://</InputExternalAddon>
 *     <View style={inputContainerStyle}>
 *       <InputLeftSide icon={MyIcon} />
 *       <TextInput {...props} />
 *       <InputRightSide icon={InfoIcon} />
 *     </View>
 *   </View>
 *   <InputHelperText error>Custom error message</InputHelperText>
 * </View>
 * ```
 */

import { useState, forwardRef, useCallback, useRef } from 'react'
import { Animated, View, TextInput, Platform } from 'react-native'
import type { TextInputProps as RNTextInputProps, TextInput as TextInputType } from 'react-native'
import type { InputProps } from './Input.types'
import { getInputStyles, getFocusBoxShadow, getFocusShadowStyle } from './Input.styles'
import { memo } from 'react'
import { InputLabel } from './InputLabel'
import { InputHelperText } from './InputHelperText'
import { InputExternalAddon, InputLeftSide, InputRightSide } from './InputAddon'

// Memoize InputLeftSide to prevent SVG icon re-renders during focus
// state changes, which causes iOS to drop the TextInput first responder.
const MemoizedInputLeftSide = memo(InputLeftSide)
import { PasswordStrength } from '../PasswordStrength/PasswordStrength'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { useThemeContext } from '../../theme'
import { useStyles } from '../../hooks'

export const Input = forwardRef<TextInputType, InputProps>(function Input(
  {
    label,
    required = false,
    helperText,
    error = false,
    errorMessage,
    showError = true,
    validateOnBlur = false,
    state: controlledState,
    type = 'classic',
    externalAddon,
    iconStart: IconStart,
    iconEnd: IconEnd,
    iconEndOnPress,
    iconEndAccessibilityLabel,
    disabled = false,
    fullWidth = true,
    style,
    contentStyle,
    labelStyle,
    helperTextStyle,
    showPasswordStrength = false,
    passwordStrength = 'too-weak',
    passwordRequirements,
    onFocus,
    onBlur,
    value,
    ...textInputProps
  },
  ref
) {
  // On iOS, avoid useState for focus — a React re-render that changes
  // parent View styles (border, shadow) during the focus transition
  // causes the native UITextField to resign first responder.
  // Instead, drive visual changes through Animated (no re-render).
  const [internalFocused, setInternalFocused] = useState(false)
  const focusAnim = useRef(new Animated.Value(0)).current
  const { theme } = useThemeContext()

  // Resolve error display
  const shouldShowError = showError && error

  // Determine actual state (controlled or derived)
  // On iOS, internalFocused is never set — focus visuals are Animated-driven
  const isFocused = controlledState === 'focused' || internalFocused
  const isError = error || controlledState === 'error'
  const isFilled = controlledState === 'filled' || (!!value && value.length > 0)

  let actualState: InputProps['state'] = controlledState
  if (!controlledState) {
    if (isError) {
      actualState = 'error'
    } else if (isFocused) {
      actualState = 'focused'
    } else if (isFilled) {
      actualState = 'filled'
    } else {
      actualState = 'default'
    }
  }

  const hasExternalAddon = !!externalAddon
  const styles = useStyles(getInputStyles, [actualState || 'default', type, disabled, hasExternalAddon, theme] as const)

  const handleFocus: RNTextInputProps['onFocus'] = useCallback((e) => {
    if (!disabled) {
      onFocus?.(e)
      if (Platform.OS === 'ios') {
        // Animate border colour without triggering a React re-render.
        Animated.timing(focusAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }).start()
      } else {
        setInternalFocused(true)
      }
    }
  }, [disabled, onFocus, focusAnim])

  const handleBlur: RNTextInputProps['onBlur'] = useCallback((e) => {
    if (Platform.OS === 'ios') {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start()
    } else {
      setInternalFocused(false)
    }
    onBlur?.(e)
  }, [onBlur, focusAnim])

  // Get focus shadow for web
  const focusBoxShadow = getFocusBoxShadow(actualState || 'default')
  const focusShadowStyle = getFocusShadowStyle(actualState || 'default')

  // On iOS, derive an animated border colour so focus feedback happens
  // without a React re-render (which drops first responder).
  const defaultBorderColor = isError
    ? colors.border[theme].error
    : colors.border[theme].default
  const focusBorderColor = colors.primary[600]

  const animatedBorderColor = Platform.OS === 'ios'
    ? focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [defaultBorderColor, focusBorderColor],
      })
    : undefined

  const animatedShadowOpacity = Platform.OS === 'ios'
    ? focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [type === 'classic' && !disabled ? 0.039 : 0, 0],
      })
    : undefined

  // Choose View vs Animated.View for the input container
  const InputContainerView = Platform.OS === 'ios' ? Animated.View : View

  return (
    <View
      style={[
        styles.container,
        fullWidth && {
          width: '100%',
          minWidth: '100%',
          maxWidth: '100%',
          alignSelf: 'stretch',
          flexShrink: 0,
          flexGrow: 1,
        },
        style,
      ]}
    >
      {/* Label */}
      {label && (
        <InputLabel
          type={shouldShowError ? 'error' : disabled ? 'disabled' : 'default'}
          required={required}
          labelStyle={labelStyle}
        >
          {label}
        </InputLabel>
      )}

      {/* Input Container */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '100%',
          minWidth: '100%',
          maxWidth: '100%',
          flexShrink: 0,
        }}
      >
        {/* External Addon (Prefix) */}
        {hasExternalAddon && externalAddon && (
          <InputExternalAddon
            type={type}
            borderColor={
              (styles.input.borderColor as string | undefined) || colors.border.light.default
            }
          >
            {externalAddon}
          </InputExternalAddon>
        )}

        {/* Main Input — Animated.View on iOS to avoid re-render on focus */}
        <InputContainerView
          style={[
            styles.input,
            !hasExternalAddon && {
              flex: 1,
              width: '100%',
              minWidth: '100%',
              maxWidth: '100%',
            },
            focusBoxShadow && Platform.OS === 'web' && { boxShadow: focusBoxShadow },
            focusShadowStyle,
            // iOS animated overrides — applied on top of static styles
            Platform.OS === 'ios' && animatedBorderColor != null && {
              borderColor: animatedBorderColor as unknown as string,
            },
            Platform.OS === 'ios' && animatedShadowOpacity != null && {
              shadowOpacity: animatedShadowOpacity as unknown as number,
            },
          ]}
        >
          {/* Left Side - Leading Icon or Text */}
          {IconStart && <MemoizedInputLeftSide icon={IconStart} color={styles.iconColor} />}

          {/* Text Input */}
          <TextInput
            ref={ref}
            {...textInputProps}
            value={value}
            editable={!disabled}
            style={[
              styles.inputText,
              // Remove default browser outline on web
              Platform.OS === 'web' && ({ outlineStyle: 'none' } as object),
              contentStyle,
            ]}
            placeholderTextColor={colors.text[theme].tertiary}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Right Side - Trailing Icon (pressable when iconEndOnPress provided) */}
          {IconEnd && (
            <InputRightSide
              icon={IconEnd}
              color={styles.iconColor}
              onPress={iconEndOnPress}
              accessibilityLabel={
                iconEndOnPress ? (iconEndAccessibilityLabel ?? 'Toggle visibility') : undefined
              }
            />
          )}
        </InputContainerView>
      </View>

      {/* Helper Text / Error Message */}
      {(helperText || errorMessage) && !showPasswordStrength && (
        <InputHelperText type={shouldShowError ? 'error' : 'default'} textStyle={helperTextStyle}>
          {shouldShowError && errorMessage ? errorMessage : helperText || ''}
        </InputHelperText>
      )}

      {/* Password Strength Indicator */}
      {showPasswordStrength && !shouldShowError && (
        <View style={{ marginTop: spacing[8] }}>
          {passwordRequirements && passwordRequirements.length > 0 ? (
            <PasswordStrength variant="checklist" requirements={passwordRequirements} />
          ) : (
            <PasswordStrength variant="bar" strength={passwordStrength} />
          )}
        </View>
      )}

      {/* Error message when password strength is shown */}
      {showPasswordStrength && error && errorMessage && (
        <InputHelperText type="error" textStyle={helperTextStyle}>
          {errorMessage}
        </InputHelperText>
      )}
    </View>
  )
})

Input.displayName = 'Input'

// Export types
export type { InputProps, InputState, InputType } from './Input.types'
