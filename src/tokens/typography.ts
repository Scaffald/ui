/**
 * Typography tokens — the SCF prototype's six-step interface scale.
 *
 * The old scale was Apple iOS/iPadOS 26 HIG Dynamic Type: thirteen names over
 * thirteen distinct sizes. In practice that licensed thirteen more, and the app
 * accumulated 699 literal `fontSize:` sites across 15 values, with 12 and 13 px
 * used interchangeably for the same job. The prototype's design audit named
 * this ("no type scale") and prescribed the fix: six steps, every existing size
 * mapped to its nearest one.
 *
 *   INTERFACE  11 · 12.5 · 14 · 17 · 22 · 30
 *   DISPLAY    42                              (page titles only)
 *
 * Every token name survives, so nothing breaks at once — but several now share
 * a step, which is the point. `xs`/`sm` are both 12.5; `h5` sits at body size
 * and is differentiated by weight, exactly as Apple's Headline was; `h6` is
 * smaller than body because its job is the uppercase letterspaced kicker.
 *
 * 12.5 is deliberate, not a stray half-step: it is a step of the scale rather
 * than an accident between two. React Native accepts fractional sizes; native
 * rounds to the nearest physical pixel at render, web does not.
 *
 * Weights: Regular (400), Medium (500), Semi Bold (600), Bold (700)
 */

/**
 * Font family definitions
 *
 * `heading` is a separate face from `body` so the two can diverge per platform.
 * See Typography.styles.ts — web headings resolve to the display serif; native
 * headings stay on Roboto until the serif is proven legible on a device.
 */
export const fontFamily = {
  heading: 'Scaffald Display',
  body: 'Roboto',
  serif: 'Roboto Serif',
  mono: 'Roboto Mono',
  sans: 'Roboto',
} as const

/**
 * The scale itself. Prefer these when adding new type; the named tokens below
 * are aliases onto these six steps plus the display size.
 */
export const fontScale = {
  step1: 11,
  step2: 12.5,
  step3: 14,
  step4: 17,
  step5: 22,
  step6: 30,
  display: 42,
} as const

/**
 * Font size scale — names preserved, values snapped to `fontScale`.
 */
export const fontSize = {
  // Text sizes
  xxs: fontScale.step1, // 11
  xs: fontScale.step2, // 12.5 (was 12)
  sm: fontScale.step2, // 12.5 (was 13 — the 12/13 split was never meaningful)
  md: fontScale.step3, // 14  (was 16) body base
  lg: fontScale.step4, // 17
  xl: fontScale.step5, // 22  (was 20)
  '2xl': fontScale.step5, // 22

  // Heading sizes
  h6: fontScale.step1, // 11  (was 15) uppercase kicker — below body on purpose
  h5: fontScale.step3, // 14  (was 17) body size, carried by weight
  h4: fontScale.step4, // 17  (was 20)
  h3: fontScale.step5, // 22
  h2: fontScale.step6, // 30  (was 28)
  h1: fontScale.display, // 42  (was 34) — page titles get real display size
} as const

/**
 * Font weight scale
 */
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const

/**
 * Line height scale
 *
 * Two ratios, chosen by role rather than by size — the prototype sets body at
 * 1.55 for a comfortable measure and headings at ~1.15, so the same 14 px is
 * leaded differently as `md` body text than as an `h5` heading.
 */
export const lineHeight = {
  // Text line heights — ~1.55
  xxs: 17, // 11
  xs: 19, // 12.5
  sm: 19, // 12.5
  md: 22, // 14
  lg: 26, // 17
  xl: 34, // 22

  // Heading line heights — ~1.15
  h6: 16, // 11
  h5: 18, // 14
  h4: 20, // 17
  h3: 26, // 22
  h2: 34, // 30
  h1: 47, // 42
} as const

/**
 * Letter spacing
 * Per-size values from Apple iOS/iPadOS 26 HIG (exact pixel values)
 * React Native uses numbers (pixels), not em units
 */
export const letterSpacing = {
  // Per-size values (loosened from Apple HIG for dashboard readability)
  largeTitle: 0.4,
  title1: 0.38,
  title2: 0,
  title3: -0.1,
  headline: -0.1,
  body: -0.2,
  callout: -0.15,
  subheadline: -0.1,
  footnote: 0,
  caption1: 0.1,
  caption2: 0.1,

  // Legacy aliases (backward compat)
  tighter: -0.2,
  tight: -0.1,
  normal: 0,
  wide: 0.38,
  wider: 0.4,
} as const

/**
 * Text decoration
 */
export const textDecoration = {
  none: 'none',
  underline: 'underline',
  lineThrough: 'line-through',
} as const

/**
 * Text transform
 */
export const textTransform = {
  none: 'none',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
} as const

/**
 * Complete typography variants aligned with Apple iOS/iPadOS 26 HIG
 */
export const typographyVariants = {
  // H1 - Large Title (Size: 34 / Line-height: 41 / Letter spacing: 0.4)
  h1Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.largeTitle,
  },
  h1SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.largeTitle,
  },
  h1Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.largeTitle,
  },
  h1Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.largeTitle,
  },
  h1Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.largeTitle,
  },

  // H2 - Title 1 (Size: 28 / Line-height: 34 / Letter spacing: 0.38)
  h2Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.title1,
  },
  h2SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.title1,
  },
  h2Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.title1,
  },
  h2Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.title1,
  },
  h2Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.title1,
  },

  // H3 - Title 2 (Size: 22 / Line-height: 28 / Letter spacing: -0.26)
  h3Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.title2,
  },
  h3SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.title2,
  },
  h3Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.title2,
  },
  h3Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.title2,
  },
  h3Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.title2,
  },

  // H4 - Title 3 (Size: 20 / Line-height: 25 / Letter spacing: -0.45)
  h4Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.title3,
  },
  h4SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.title3,
  },
  h4Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.title3,
  },
  h4Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.title3,
  },
  h4Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.title3,
  },

  // H5 - Headline (Size: 17 / Line-height: 22 / Letter spacing: -0.43)
  h5Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.headline,
  },
  h5SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.headline,
  },
  h5Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.headline,
  },
  h5Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.headline,
  },
  h5Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.headline,
  },

  // H6 - Subheadline (Size: 15 / Line-height: 20 / Letter spacing: -0.23)
  h6Bold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.subheadline,
  },
  h6SemiBold: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.subheadline,
  },
  h6Medium: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.subheadline,
  },
  h6Regular: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.subheadline,
  },
  h6Serif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.subheadline,
  },

  // Subtitle - Title 3 size (Size: 20 / Line-height: 25 / Letter spacing: -0.45)
  subtitleBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.title3,
  },
  subtitleSemiBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.title3,
  },
  subtitleMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.title3,
  },
  subtitleRegular: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.title3,
  },
  subtitleSerif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.title3,
  },

  // Paragraph L - Body (Size: 17 / Line-height: 22 / Letter spacing: -0.43)
  paragraphLBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.body,
  },
  paragraphLSemiBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.body,
  },
  paragraphLMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.body,
  },
  paragraphLRegular: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.body,
  },
  paragraphLSerif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.body,
  },

  // Paragraph M - Callout (Size: 16 / Line-height: 21 / Letter spacing: -0.31)
  paragraphMBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.callout,
  },
  paragraphMSemiBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.callout,
  },
  paragraphMMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.callout,
  },
  paragraphMRegular: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.callout,
  },
  paragraphMSerif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.callout,
  },

  // Paragraph S - Footnote (Size: 13 / Line-height: 18 / Letter spacing: -0.08)
  paragraphSBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.footnote,
  },
  paragraphSSemiBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.footnote,
  },
  paragraphSMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.footnote,
  },
  paragraphSRegular: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.footnote,
  },
  paragraphSSerif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.footnote,
  },

  // Caption - Caption 1 (Size: 12 / Line-height: 16 / Letter spacing: 0)
  captionBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.caption1,
  },
  captionSemiBold: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.caption1,
  },
  captionMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.caption1,
  },
  captionRegular: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.caption1,
  },
  captionSerif: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.caption1,
  },
} as const

/**
 * Simplified typography scale for common use
 */
export const typography = {
  // Heading shortcuts
  h1: typographyVariants.h1Bold,
  h2: typographyVariants.h2Bold,
  h3: typographyVariants.h3SemiBold,
  h4: typographyVariants.h4SemiBold,
  h5: typographyVariants.h5SemiBold,
  h6: typographyVariants.h6Medium,

  // Subtitle text
  subtitle: typographyVariants.subtitleRegular,
  subtitleMedium: typographyVariants.subtitleMedium,
  subtitleBold: typographyVariants.subtitleSemiBold,

  // Body shortcuts
  body: typographyVariants.paragraphMRegular,
  bodyMedium: typographyVariants.paragraphMMedium,
  bodyBold: typographyVariants.paragraphMSemiBold,

  // Small text
  small: typographyVariants.paragraphSRegular,
  smallMedium: typographyVariants.paragraphSMedium,
  smallBold: typographyVariants.paragraphSSemiBold,

  // Large text
  large: typographyVariants.paragraphLRegular,
  largeMedium: typographyVariants.paragraphLMedium,
  largeBold: typographyVariants.paragraphLSemiBold,

  // Caption text
  caption: typographyVariants.captionRegular,
  captionMedium: typographyVariants.captionMedium,
  captionBold: typographyVariants.captionBold,

  // Aliases for direct variant access (for backward compatibility)
  paragraphLMedium: typographyVariants.paragraphLMedium,
  paragraphLSemiBold: typographyVariants.paragraphLSemiBold,
  paragraphMMedium: typographyVariants.paragraphMMedium,
  paragraphSMedium: typographyVariants.paragraphSMedium,
  paragraphSRegular: typographyVariants.paragraphSRegular,
  captionRegular: typographyVariants.captionRegular,
  h6Medium: typographyVariants.h6Medium,
} as const

export type FontFamilyToken = keyof typeof fontFamily
export type FontSizeToken = keyof typeof fontSize
export type FontWeightToken = keyof typeof fontWeight
export type LineHeightToken = keyof typeof lineHeight
export type LetterSpacingToken = keyof typeof letterSpacing
export type TypographyVariant = keyof typeof typographyVariants
