import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

export interface LaneGroupProps {
  /** Stage name — "New", "Screening", "Order Review". */
  title: string
  /** How many rows are in this stage. Rendered beside the title. */
  count: number
  /**
   * What the stage means, in the reader's terms: "untouched — the first-response
   * clock is running". Sets expectations that a bare stage name cannot.
   */
  hint?: string
  /**
   * Dot colour beside the title. Use the stage's own colour; `attention` marks
   * a stage that is behind.
   */
  tone?: 'neutral' | 'active' | 'attention'
  /** Trailing control on the stage header — "Select lane", a collapse toggle. */
  action?: ReactNode
  /** The rows. */
  children?: ReactNode
  /**
   * Shown instead of the rows when the stage is empty. A stage with nothing in
   * it should say what would put something there, not repeat "No applications"
   * once per stage — which is what the current board does seven times over.
   */
  emptyState?: ReactNode
  style?: ViewStyle
  testID?: string
}

export interface LaneProps {
  /**
   * The staleness figure — days in THIS stage, not days since applied. It leads
   * the row because it is the number that says "act on this".
   */
  age?: string
  /** Marks the age as past its promise; renders it in the attention hue. */
  overdue?: boolean
  /** Primary identity for the row — a name, a case number. */
  title: ReactNode
  /** Secondary line under the title. */
  subtitle?: ReactNode
  /**
   * Middle columns. Each is a self-contained cell; on a wide row they sit side
   * by side, and below `stackBelow` they collapse into a vertical list.
   *
   * Cells carry their own label. A `Lane` row has no column headings, so a
   * bare `88 | Scaffald | — | Unassigned` says what none of its values are —
   * the caller composes "Score 88" and decides what to show at which width.
   *
   * This was briefly a union of `ReactNode | { label, value }`, discriminated
   * at render time. Do not reintroduce that: the guard evaluated differently
   * under the app and under vitest, and the raw descriptor reached React as a
   * child ("Objects are not valid as a React child"). A render path is the
   * wrong place to be guessing what a value is.
   */
  columns?: ReactNode[]
  /** Right-aligned controls — a Move menu, an overflow button. */
  actions?: ReactNode
  /** Why this row is where it is: "Denver County backlog — chase runner". */
  note?: ReactNode
  onPress?: () => void
  /** Width under which the row stacks instead of scrolling sideways. */
  stackBelow?: number
  selected?: boolean
  style?: ViewStyle
  testID?: string
}
