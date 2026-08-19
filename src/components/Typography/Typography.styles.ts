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
  /**
   * Headings resolve to the display serif on web. Native stays on Roboto until
   * the serif is proven legible on a real device — see `resolveDisplayFace`.
   */
  heading?: boolean,
): string {
  if (Platform.OS === 'web') {
    // A heading that asks for serif gets the DISPLAY serif, not Roboto Serif —
    // otherwise the app carries two competing serifs with no rule about which
    // is which. Roboto Serif stays the body serif.
    //
    // CSS uses fontWeight to select the variant, so one family name covers all
    // weights. `Scaffald Display` is declared in apps/scaffald/global.css and
    // falls back to Georgia wherever it has not been loaded.
    if (heading) return 'Scaffald Display'
    return serif ? 'Roboto Serif' : 'Roboto'
  }

  if (serif) return 'Roboto Serif'

  // Native: use weight-specific registered font family.
  //
  // Headings deliberately do NOT take the display serif here. Cormorant
  // Garamond is a display face; at 11-14px on a phone in daylight it is worse
  // than Roboto, and the jobsite is the native app's whole context. Revisit
  // once we have looked at it on a device outdoors — the change is this branch
  // plus a font registration in apps/scaffald/utils/useAppFonts.ts.
  if (weight === 'bold') return 'Roboto-Bold'
  if (weight === 'medium' || weight === 'semibold') return 'Roboto-Medium'
  return 'Roboto'
}
