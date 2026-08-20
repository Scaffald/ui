import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

export interface ScreenHeaderPager {
  /** 1-based index of the visible tip. */
  index: number
  /** Total tips available. */
  total: number
  /** Advance to the next tip. Wrapping is the caller's business. */
  onNext: () => void
  /** Optional label for assistive tech; defaults to "Next tip". */
  accessibilityLabel?: string
}

export interface ScreenHeaderProps {
  /**
   * Uppercase letterspaced line above the title — the screen's context, not a
   * repeat of the title. "Employer view — applicant workflow".
   */
  kicker?: string
  /** The screen's name. Should echo its nav label exactly. */
  title: string
  /**
   * One or two sentences saying what the screen is for or how to read it.
   * Optional; omit rather than padding it out.
   */
  tip?: ReactNode
  /**
   * When provided, the title gets a caret that collapses the tip. Controlled:
   * the caller owns `collapsed` so the choice can persist per screen.
   */
  collapsed?: boolean
  onToggleCollapsed?: () => void
  /** Cycles between several tips, rendered as "1 / 5 →" beside the tip. */
  pager?: ScreenHeaderPager
  /** Trailing controls on the title row — "Post a job", view switches. */
  actions?: ReactNode
  /** Rendered full-width under the tip: transparency banners, stat strips. */
  children?: ReactNode
  style?: ViewStyle
  testID?: string
}
