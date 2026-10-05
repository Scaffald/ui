/**
 * SegmentedControl — a bordered box of options, one of which is chosen.
 *
 * The SCF prototype's `.seg`: hairline border, hairline between options, the
 * chosen one marked by an inset accent ring and accent text. No thumb, no
 * animation — the choice reads from the ring.
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState(0)
 * <SegmentedControl
 *   segments={['Day', 'Week', 'Month']}
 *   selectedIndex={selected}
 *   onSelectionChange={setSelected}
 * />
 * ```
 */

import type React from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '../Typography'
import type { SegmentedControlProps } from './SegmentedControl.types'
import { getSegmentedControlStyles } from './SegmentedControl.styles'
import { useStyles } from '../../hooks'
import { useThemeContext } from '../../theme'

export function SegmentedControl({
  segments,
  selectedIndex,
  onSelectionChange,
  disabled = false,
  style,
  testID,
}: SegmentedControlProps): React.ReactElement {
  const { theme } = useThemeContext()
  const styles = useStyles(getSegmentedControlStyles, [theme] as const)

  return (
    <View
      style={[styles.container, disabled && { opacity: 0.5 }, style]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {segments.map((label, index) => {
        const isSelected = index === selectedIndex
        return (
          <Pressable
            key={`${label}-${index}`}
            style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
              styles.segment,
              index > 0 && styles.segmentDivider,
              hovered && !isSelected && !disabled && styles.segmentHovered,
            ]}
            onPress={() => !disabled && onSelectionChange(index)}
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled }}
            aria-selected={isSelected}
            accessibilityLabel={label}
          >
            {isSelected ? <View pointerEvents="none" style={styles.ring} /> : null}
            <Text style={isSelected ? styles.selectedLabel : styles.label} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
