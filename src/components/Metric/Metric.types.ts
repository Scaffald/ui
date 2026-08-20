import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

/**
 * How a delta reads. `up` is not automatically good — a rising ghost rate is
 * bad — so tone is stated rather than inferred from direction.
 */
export type MetricTone = 'neutral' | 'positive' | 'attention'

export interface MetricBlockProps {
  /** Uppercase letterspaced label. Always ABOVE the figure. */
  label: string
  /** The figure itself. Pre-formatted — this component does not format. */
  value: ReactNode
  /** One short line under the figure: "▲ 8%", "3 this week", "Both new". */
  delta?: ReactNode
  /** Colours the delta. Defaults to neutral. */
  tone?: MetricTone
  /** Renders the figure in the attention hue — for an over-SLA count. */
  emphasis?: boolean
  style?: ViewStyle
  testID?: string
}

export interface MetricRowProps {
  /** The blocks, left to right. Hairline-divided, equal width. */
  children: ReactNode
  /**
   * Wrap to a second line under this width instead of squeezing. The prototype's
   * audit flagged a five-up row dropping a lone sixth stat with a stray divider;
   * wrapping whole columns avoids the orphan.
   */
  minColumnWidth?: number
  /** Draw a hairline above and below the row. */
  bordered?: boolean
  style?: ViewStyle
  testID?: string
}
