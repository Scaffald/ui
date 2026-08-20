/**
 * Border tokens — the SCF prototype's three-step interface radius scale.
 *
 *   INTERFACE  2 (sm) · 4 (md) · 7 (lg)
 *
 * The prototype keeps corners nearly square and separates with hairline rules
 * and whitespace instead. Our app had drifted the other way: ~350 literal
 * `borderRadius:` sites across a dozen values, 8/12/16 most common, so
 * neighbouring cards rounded differently.
 *
 * The iOS-26 radii below are NOT part of that scale and are not drift. They
 * belong to native sheets, alerts and context menus, where the platform sets
 * the shape. Leave them alone; never reach for them to round a card.
 *
 * All values are in pixels.
 */

/**
 * Border radius scale
 */
export const borderRadius = {
  none: 0, // radius-none
  xxxs: 2, // radius-xxxs
  xxs: 2, // radius-xxs  (was 3)
  xs: 4, // radius-xs
  s: 4, // radius-s     (was 5)
  m: 4, // radius-m     (was 6)
  l: 7, // radius-l     (was 8)
  xl: 7, // radius-xl    (was 10)
  xxl: 7, // radius-xxl   (was 12)
  xxxl: 7, // radius-xxxl  (was 16)
  xxxxl: 7, // radius-xxxxl (was 24)
  max: 999, // radius-max (fully rounded/pill shape)

  // iOS 26 specific radii
  /** iOS 26 sheet/alert top corner radius (34px) */
  sheet: 34,
  /** iOS 26 context menu quick action button radius (20px) */
  menuAction: 20,
  /** iOS 26 alert text field container radius (26px) */
  alertField: 26,
  /** iOS 26 context menu container radius (30px) */
  menuContainer: 30,
  /** iOS 26 pill button radius (100px) */
  pill: 100,
} as const

/**
 * Named border radius for semantic usage
 * Provides convenient aliases matching common naming conventions
 */
export const radius = {
  none: borderRadius.none, // 0
  xxxs: borderRadius.xxxs, // 2
  xxs: borderRadius.xxs, // 2
  xs: borderRadius.xs, // 4
  sm: borderRadius.s, // 4  — interface step 1 is `xxxs` (2); sm/md are step 2
  md: borderRadius.m, // 4
  lg: borderRadius.l, // 7
  xl: borderRadius.xl, // 7
  '2xl': borderRadius.xxl, // 7
  '3xl': borderRadius.xxxl, // 7
  '4xl': borderRadius.xxxxl, // 7
  full: borderRadius.max, // 999 (pill shape)

  // iOS 26 aliases
  sheet: borderRadius.sheet, // 34 (action sheet / alert)
  menuAction: borderRadius.menuAction, // 20 (context menu quick action)
  alertField: borderRadius.alertField, // 26 (alert text field)
  menuContainer: borderRadius.menuContainer, // 30 (menu container)
  pill: borderRadius.pill, // 100 (pill button)
} as const

/**
 * Border width scale
 */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
} as const

/**
 * Border style values
 */
export const borderStyle = {
  solid: 'solid' as const,
  dashed: 'dashed' as const,
  dotted: 'dotted' as const,
  none: 'none' as const,
} as const

/**
 * Common border combinations
 */
export const borders = {
  none: {
    borderWidth: borderWidth.none,
    borderStyle: borderStyle.none,
  },
  thin: {
    borderWidth: borderWidth.thin,
    borderStyle: borderStyle.solid,
  },
  medium: {
    borderWidth: borderWidth.medium,
    borderStyle: borderStyle.solid,
  },
  thick: {
    borderWidth: borderWidth.thick,
    borderStyle: borderStyle.solid,
  },
} as const

export type BorderRadiusToken = keyof typeof borderRadius
export type RadiusToken = keyof typeof radius
export type BorderWidthToken = keyof typeof borderWidth
export type BorderStyleToken = keyof typeof borderStyle
