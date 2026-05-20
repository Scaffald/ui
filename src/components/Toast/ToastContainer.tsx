/**
 * ToastContainer component
 * Renders all active toasts in the specified position
 */

import type React from 'react'
import { useMemo } from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context'
import { spacing } from '../../tokens/spacing'
import { useToast } from './ToastContext'
import { Toast } from './Toast'
import type { ToastContainerProps, ToastPosition } from './Toast.types'

// ============================================================================
// Constants
// ============================================================================

const buildPositionStyles = (insets: EdgeInsets): Record<ToastPosition, ViewStyle> => {
  const top = insets.top + spacing[16]
  const bottom = insets.bottom + spacing[16]
  const left = insets.left + spacing[16]
  const right = insets.right + spacing[16]
  return {
    top: { top, left: 0, right: 0, alignItems: 'center' },
    'top-left': { top, left },
    'top-right': { top, right },
    bottom: { bottom, left: 0, right: 0, alignItems: 'center' },
    'bottom-left': { bottom, left },
    'bottom-right': { bottom, right },
  }
}

// ============================================================================
// ToastContainer Component
// ============================================================================

/**
 * ToastContainer - Renders all active toasts
 *
 * Place this component at the root of your app, after ToastProvider.
 *
 * @example
 * <ToastProvider>
 *   <App />
 *   <ToastContainer position="top-right" />
 * </ToastProvider>
 */
export function ToastContainer({
  position = 'top-right',
  maxToasts = 5,
  gap = 8,
  style,
}: ToastContainerProps): React.ReactElement | null {
  const { toasts, dismiss } = useToast()
  const insets = useSafeAreaInsets()

  const positionStyle = useMemo<ViewStyle>(
    () => buildPositionStyles(insets)[position],
    [insets, position],
  )

  // Limit visible toasts
  const visibleToasts = useMemo(() => {
    return toasts.slice(-maxToasts)
  }, [toasts, maxToasts])

  if (visibleToasts.length === 0) {
    return null
  }

  // Reverse order for bottom positions so newest appears at the bottom
  const orderedToasts = position.startsWith('bottom')
    ? [...visibleToasts].reverse()
    : visibleToasts

  return (
    <View style={[styles.container, positionStyle, style, { pointerEvents: 'box-none' }]}>
      <View style={[styles.inner, { gap }]}>
        {orderedToasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            dismissible={toast.dismissible}
            icon={toast.icon}
            action={toast.action}
            onDismiss={() => {
              toast.onDismiss?.()
              dismiss(toast.id)
            }}
            testID={`toast-${toast.id}`}
          />
        ))}
      </View>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  inner: {
    width: 360,
    maxWidth: '100%',
  },
})
