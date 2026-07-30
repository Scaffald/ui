/**
 * Typography color-resolution tests
 *
 * Regression cover for two defects that shipped together:
 *
 *  1. All five Typography components resolved their colors against
 *     `colors.text.light` regardless of the active theme, so any component
 *     without an explicit color rendered near-black in dark mode. That is why
 *     roughly half the app's `<Text>` call sites pass a manual
 *     `colors.text[theme]` override.
 *  2. `color="inherit"` returned a concrete color instead of emitting none, so
 *     a Typography component nested inside a colored parent (a filled Button's
 *     label) could not pick up that parent's contrast color — which is how
 *     community post buttons ended up black-on-black.
 *
 * These assert the resolver directly rather than introspecting rendered styles:
 * this package's tests alias react-native to react-native-web, so styles land
 * in CSS classes that jsdom will not resolve back to a color value.
 */

import React from 'react'
import { render } from '@testing-library/react-native'
import { describe, it, expect } from 'vitest'
import { Heading, Paragraph, Label, Text, Caption } from '../../components/Typography'
import { resolveTypographyColor } from '../../components/Typography/Typography.styles'
import { ThemeProvider } from '../../theme'
import { colors } from '../../tokens/colors'

describe('resolveTypographyColor', () => {
  describe('follows the active theme', () => {
    it('resolves the default against light', () => {
      expect(resolveTypographyColor(undefined, 'light')).toBe(colors.text.light.primary)
    })

    it('resolves the default against dark', () => {
      expect(resolveTypographyColor(undefined, 'dark')).toBe(colors.text.dark.primary)
    })

    it.each(['primary', 'secondary', 'tertiary', 'disabled'] as const)(
      'resolves %s per theme rather than always light',
      (name) => {
        expect(resolveTypographyColor(name, 'light')).toBe(colors.text.light[name])
        expect(resolveTypographyColor(name, 'dark')).toBe(colors.text.dark[name])
        // The regression: dark used to come back with the light value.
        expect(resolveTypographyColor(name, 'dark')).not.toBe(colors.text.light[name])
      },
    )
  })

  describe('fallback', () => {
    it('defaults to primary', () => {
      expect(resolveTypographyColor(undefined, 'dark')).toBe(colors.text.dark.primary)
    })

    it('honours a secondary fallback, which is what Caption asks for', () => {
      expect(resolveTypographyColor(undefined, 'dark', 'secondary')).toBe(
        colors.text.dark.secondary,
      )
    })

    it('ignores the fallback once an explicit color is given', () => {
      expect(resolveTypographyColor('primary', 'dark', 'secondary')).toBe(
        colors.text.dark.primary,
      )
    })
  })

  describe("color='inherit'", () => {
    it('emits no color at all so the enclosing Text wins', () => {
      expect(resolveTypographyColor('inherit', 'light')).toBeUndefined()
      expect(resolveTypographyColor('inherit', 'dark')).toBeUndefined()
    })

    it('ignores the fallback too', () => {
      expect(resolveTypographyColor('inherit', 'dark', 'secondary')).toBeUndefined()
    })
  })

  describe('non-theme colors', () => {
    it.each([
      ['error', colors.error[500]],
      ['success', colors.success[500]],
      ['warning', colors.warning[500]],
    ] as const)('passes %s through unchanged in both themes', (name, expected) => {
      expect(resolveTypographyColor(name, 'light')).toBe(expected)
      expect(resolveTypographyColor(name, 'dark')).toBe(expected)
    })

    it('passes a custom color string through', () => {
      expect(resolveTypographyColor('#abcdef', 'dark')).toBe('#abcdef')
      expect(resolveTypographyColor('rgba(1, 2, 3, 0.5)', 'light')).toBe('rgba(1, 2, 3, 0.5)')
    })
  })
})

describe('Typography components under a theme', () => {
  const themes = ['light', 'dark'] as const

  it.each(themes)('render without crashing in %s', (theme) => {
    const { getByText } = render(
      <ThemeProvider theme={theme} onThemeChange={() => {}}>
        <>
          <Heading level={2}>heading</Heading>
          <Paragraph>paragraph</Paragraph>
          <Label>label</Label>
          <Text>text</Text>
          <Caption>caption</Caption>
        </>
      </ThemeProvider>,
    )
    for (const label of ['heading', 'paragraph', 'label', 'text', 'caption']) {
      expect(getByText(label)).toBeTruthy()
    }
  })

  it('renders with no ThemeProvider at all', () => {
    // useThemeContext falls back to light rather than throwing; Typography must
    // not be the thing that breaks an unwrapped tree.
    const { getByText } = render(<Text>bare</Text>)
    expect(getByText('bare')).toBeTruthy()
  })

  it('accepts color="inherit" on every component', () => {
    const { getByText } = render(
      <ThemeProvider theme="dark" onThemeChange={() => {}}>
        <>
          <Heading level={3} color="inherit">
            h
          </Heading>
          <Paragraph color="inherit">p</Paragraph>
          <Label color="inherit">l</Label>
          <Text color="inherit">t</Text>
          <Caption color="inherit">c</Caption>
        </>
      </ThemeProvider>,
    )
    for (const label of ['h', 'p', 'l', 't', 'c']) {
      expect(getByText(label)).toBeTruthy()
    }
  })
})
