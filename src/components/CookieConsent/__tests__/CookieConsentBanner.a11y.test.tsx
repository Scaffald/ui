/**
 * The consent card must be out of the accessibility tree when it is not
 * showing, and must not be a heading when it is (#774, #452).
 *
 * The banner is rendered unconditionally for hydration parity, so "hidden"
 * has to mean hidden to assistive tech and the tab order too — `display:
 * none` plus `aria-hidden` — not `opacity: 0`, which left three focusable
 * buttons and an <h6> on every page after consent.
 */
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CookieConsentBanner } from '../CookieConsentBanner'
import { CookieConsentProvider } from '../CookieConsentProvider'

vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native')
  return { ...(actual as object), Platform: { OS: 'web', select: (o: { web?: unknown }) => o.web } }
})

const storage = (initial: string | null) => ({
  getItem: async () => initial,
  setItem: async () => {},
  removeItem: async () => {},
})

const container = () => screen.getByTestId('cookie-consent-banner')
// react-native-web omits `aria-hidden` when it is false.
const hidden = () => container().getAttribute('aria-hidden') === 'true'

describe('CookieConsentBanner accessibility', () => {
  it('is hidden from assistive tech and layout until consent is known, then shown', async () => {
    render(
      <CookieConsentProvider storage={storage(null)}>
        <CookieConsentBanner />
      </CookieConsentProvider>
    )
    // Before the storage read resolves the card is present but hidden.
    expect(hidden()).toBe(true)
    expect(getComputedStyle(container()).display).toBe('none')
    await waitFor(() => expect(hidden()).toBe(false))
    expect(getComputedStyle(container()).display).not.toBe('none')
  })

  it('stays hidden when consent was already given', async () => {
    const given = JSON.stringify({ version: '1', updatedAt: 'x', selections: { 'strictly-necessary': true } })
    render(
      <CookieConsentProvider storage={storage(given)}>
        <CookieConsentBanner />
      </CookieConsentProvider>
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(hidden()).toBe(true)
    expect(getComputedStyle(container()).display).toBe('none')
  })

  it('titles the card without a heading element', async () => {
    render(
      <CookieConsentProvider storage={storage(null)}>
        <CookieConsentBanner />
      </CookieConsentProvider>
    )
    await waitFor(() => expect(hidden()).toBe(false))
    expect(screen.queryByRole('heading', { name: /cookies/i })).toBeNull()
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeTruthy()
  })
})
