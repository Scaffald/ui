import { Platform } from 'react-native'
import { colors } from '../../tokens/colors'
import type { ResolvedThemeMode } from '../../tokens/colors'

/**
 * Resolve a Typography `color` prop to a concrete color value.
 *
 * Shared by Text, Heading, Paragraph, Label and Caption. Each of those used to
 * carry its own copy of this logic, and all five copies resolved against
 * `colors.text.light` regardless of the active theme — which is how every
 * unstyled Typography component came to render near-black in dark mode, and why
 * so many call sites pass an explicit `colors.text[theme]` override to work
 * around it. One implementation means that cannot drift back apart.
 *
 * Returns `undefined` for 'inherit' so no color is emitted at all and the value
 * genuinely inherits from an enclosing Text. That is the only way a Typography
 * component nested inside a colored parent — a filled Button's label, say — can
 * pick up that parent's contrast color. Returning a concrete default here, as
 * the old copies did, made 'inherit' a lie.
 *
 * `fallback` is the semantic name to use when no color is given: Caption reads
 * as muted by default, everything else as primary.
 */
export function resolveTypographyColor(
  color: string | undefined,
  theme: ResolvedThemeMode,
  fallback: 'primary' | 'secondary' = 'primary',
): string | undefined {
  if (color === 'inherit') return undefined
  if (!color) return colors.text[theme][fallback]
  if (color === 'primary') return colors.text[theme].primary
  if (color === 'secondary') return colors.text[theme].secondary
  if (color === 'tertiary') return colors.text[theme].tertiary
  if (color === 'disabled') return colors.text[theme].disabled
  if (color === 'error') return colors.error[500]
  if (color === 'success') return colors.success[500]
  if (color === 'warning') return colors.warning[500]
  return color // Custom color string
}

/**
 * Returns the correct font family name for a given weight and style.
 *
 * On web, CSS handles weight-based font selection using a single family name
 * combined with `fontWeight`. On native (iOS), custom fonts must be referenced
 * by their weight-specific registered name because `fontWeight` is ignored for
 * custom loaded fonts.
 *
 * Font registration in _layout.tsx:
 *   'Roboto'         → Roboto_400Regular
 *   'Roboto-Medium'  → Roboto_500Medium
 *   'Roboto-Bold'    → Roboto_700Bold
 *   'Roboto Serif'   → RobotoSerif_400Regular
 *
 * Note: Roboto has no 600-weight variant; semibold maps to 'Roboto-Medium' on native.
 */
export function getFontFamily(
  weight: 'regular' | 'medium' | 'semibold' | 'bold',
  serif?: boolean,
): string {
  if (serif) return 'Roboto Serif'

  if (Platform.OS === 'web') return 'Roboto' // CSS uses fontWeight to select variant

  // Native: use weight-specific registered font family
  if (weight === 'bold') return 'Roboto-Bold'
  if (weight === 'medium' || weight === 'semibold') return 'Roboto-Medium'
  return 'Roboto'
}
