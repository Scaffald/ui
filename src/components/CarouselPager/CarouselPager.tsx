/**
 * CarouselPager — small primitives for in-widget carousel controls.
 *
 * Provides two composable pieces used by widgets that page through a small
 * collection of cards:
 *   - <CarouselArrows />  Prev/Next chevron buttons (typically in header row)
 *   - <CarouselDots />    Dot indicator row (typically in footer row)
 *
 * Sizing and spacing are fixed so every widget using them looks identical.
 *
 * @example
 * ```tsx
 * <Row justify="space-between" align="center">
 *   <Text>My widget</Text>
 *   <CarouselArrows
 *     canPrev={index > 0}
 *     canNext={index < cards.length - 1}
 *     onPrev={() => setIndex(index - 1)}
 *     onNext={() => setIndex(index + 1)}
 *   />
 * </Row>
 * ...
 * <CarouselDots count={cards.length} activeIndex={index} onDotPress={setIndex} />
 * ```
 */

import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import { colors } from '../../tokens/colors'
import { useThemeContext } from '../../theme'

const ARROW_ICON_SIZE = 18
const ARROW_HIT_SLOP = 8
const ARROW_PADDING = 4
const ARROW_GAP = 4
const DOT_SIZE = 6
const DOT_GAP = 6

export interface CarouselArrowsProps {
  onPrev: () => void
  onNext: () => void
  /** If false, prev arrow dims and ignores presses. Defaults to true. */
  canPrev?: boolean
  /** If false, next arrow dims and ignores presses. Defaults to true. */
  canNext?: boolean
  /** Override icon color. Defaults to current theme's default icon color. */
  color?: string
}

export function CarouselArrows({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  color,
}: CarouselArrowsProps) {
  const { theme } = useThemeContext()
  const iconColor = color ?? colors.icon[theme].default

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ARROW_GAP }}>
      <Pressable
        onPress={onPrev}
        disabled={!canPrev}
        hitSlop={ARROW_HIT_SLOP}
        style={({ pressed }) => ({
          padding: ARROW_PADDING,
          opacity: !canPrev ? 0.3 : pressed ? 0.4 : 0.7,
        })}
      >
        <ChevronLeft size={ARROW_ICON_SIZE} color={iconColor} />
      </Pressable>
      <Pressable
        onPress={onNext}
        disabled={!canNext}
        hitSlop={ARROW_HIT_SLOP}
        style={({ pressed }) => ({
          padding: ARROW_PADDING,
          opacity: !canNext ? 0.3 : pressed ? 0.4 : 0.7,
        })}
      >
        <ChevronRight size={ARROW_ICON_SIZE} color={iconColor} />
      </Pressable>
    </View>
  )
}

export interface CarouselDotsProps {
  count: number
  activeIndex: number
  onDotPress?: (index: number) => void
  /** Active dot color. Defaults to primary.500 */
  activeColor?: string
  /** Inactive dot color. Defaults to border.default */
  inactiveColor?: string
}

export function CarouselDots({
  count,
  activeIndex,
  onDotPress,
  activeColor,
  inactiveColor,
}: CarouselDotsProps) {
  const { theme } = useThemeContext()
  const on = activeColor ?? colors.primary[500]
  const off = inactiveColor ?? colors.border[theme].default

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: DOT_GAP }}>
      {Array.from({ length: count }).map((_, i) => (
        <Pressable
          key={i}
          onPress={onDotPress ? () => onDotPress(i) : undefined}
          disabled={!onDotPress}
          hitSlop={6}
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: i === activeIndex ? on : off,
          }}
        />
      ))}
    </View>
  )
}
