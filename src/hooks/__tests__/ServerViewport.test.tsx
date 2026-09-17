/**
 * The server snapshot `useResponsive` renders against is a constant 1280×900
 * unless a `ServerViewportProvider` says otherwise. These render with
 * react-dom's server renderer, which is exactly the path that reads
 * `getServerSnapshot`.
 */
import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ServerViewportProvider } from '../ServerViewport'
import { useResponsive, useWindowDimensions } from '../useResponsive'

vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native')
  return { ...(actual as object), Platform: { OS: 'web' } }
})

function Probe() {
  const { width, isMobile, isDesktop, breakpoint } = useResponsive()
  const dims = useWindowDimensions()
  return <span>{JSON.stringify({ width, isMobile, isDesktop, breakpoint, dimsWidth: dims.width })}</span>
}

const read = (html: string) => JSON.parse(html.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"'))

describe('ServerViewportProvider', () => {
  it('server-renders as a 1280px desktop when nothing provides a viewport', () => {
    expect(read(renderToString(<Probe />))).toEqual({
      width: 1280,
      isMobile: false,
      isDesktop: true,
      breakpoint: 'lg',
      dimsWidth: 1280,
    })
  })

  it('server-renders the phone layout when the provider says the request is a phone', () => {
    const html = renderToString(
      <ServerViewportProvider viewport={{ width: 390, height: 844 }}>
        <Probe />
      </ServerViewportProvider>
    )
    expect(read(html)).toEqual({
      width: 390,
      isMobile: true,
      isDesktop: false,
      breakpoint: 'base',
      dimsWidth: 390,
    })
  })

  it('falls back to the default when the provider is given nothing', () => {
    const html = renderToString(
      <ServerViewportProvider viewport={undefined}>
        <Probe />
      </ServerViewportProvider>
    )
    expect(read(html).width).toBe(1280)
  })
})
