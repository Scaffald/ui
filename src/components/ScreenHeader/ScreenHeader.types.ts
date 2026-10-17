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

export interface ScreenHeaderBack {
  /** The parent screen's name, as the nav calls it: "Applications". */
  label: string
  /** Navigate to the parent. A named parent, not history-back. */
  onPress: () => void
}

export interface ScreenHeaderProps {
  /**
   * A drill-in's way back: "← Applications" above the kicker. The prototype
   * uses this on every detail and flow screen instead of a breadcrumb
   * (#1163); top-level screens leave it out, because the nav already says
   * where you are.
   */
  back?: ScreenHeaderBack
  /**
   * Drawn beside the kicker, title and tip — a candidate's or worker's avatar
   * on their detail screen, as the prototype's candidate header does. Leave it
   * out on list and top-level screens.
   */
  leading?: ReactNode
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
  /**
   * Trailing controls on the title row — "Post a job", view switches. On a
   * phone they move below the tip, so the header still reads kicker → title →
   * tip (#1161).
   */
  actions?: ReactNode
  /** Rendered full-width under the tip: transparency banners, stat strips. */
  children?: ReactNode
  style?: ViewStyle
  testID?: string
}
