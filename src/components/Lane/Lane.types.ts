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

/**
 * A labelled cell. The label is what a wide row gets from its column heading
 * and a stacked row has nowhere else to get.
 */
export interface LaneColumn {
  label: string
  value: ReactNode
  /**
   * Treat this cell as empty, so the stacked form omits it. Callers that render
   * their own placeholder ("—") should pass `empty` rather than relying on the
   * component to guess what counts as nothing.
   */
  empty?: boolean
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
   * Middle columns. On a wide row they sit side by side; below `stackBelow`
   * they collapse into a vertical list.
   *
   * Prefer the labelled form. A bare ReactNode works and is kept for callers
   * that bake their own label into the cell ("score 88"), but position is what
   * gives an unlabelled cell its meaning, and stacking destroys position: a
   * pipeline row that read `88 | Scaffald | — | Unassigned` across the page
   * became four orphaned values down a phone, one of which was a lone em dash.
   *
   * Labelled columns render as "label  value" when stacked, and a labelled
   * column with an empty value is dropped from the stack entirely rather than
   * spending a line to say nothing.
   */
  columns?: Array<ReactNode | LaneColumn>
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
