import { useEffect, useState } from 'react'
import { View, Text, Platform } from 'react-native'
import { Stack } from '../Layout'
import { Row } from '../Layout'
import { Button } from '../Button'
import { Heading } from '../Typography'
import { Paragraph } from '../Typography'
import { useCookieConsent } from './CookieConsentProvider'
import { useBottomBarContext } from '../BottomBar/BottomBarProvider'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { borderRadius } from '../../tokens/borders'
import { shadows } from '../../tokens/shadows'
import { useThemeContext } from '../../theme'

export interface CookieConsentBannerProps {
  /** Privacy policy URL for the link in the description */
  privacyPolicyUrl?: string
  /** Container style (e.g. for maxWidth) */
  style?: { maxWidth?: number; [key: string]: unknown }
}

export function CookieConsentBanner({ privacyPolicyUrl, style: styleProp }: CookieConsentBannerProps) {
  const { shouldShowBanner, acceptAll, rejectAll, openPreferences, isReady, reportBannerHeight } =
    useCookieConsent()
  const [pendingAction, setPendingAction] = useState<'accept' | 'reject' | null>(null)
  const { theme } = useThemeContext()
  // The phone tab bar is absolutely positioned at the bottom too, and this
  // banner's zIndex 1000 puts it on top — so on mobile the consent card sat
  // squarely over the primary navigation until somebody dismissed it. The bar
  // publishes its own height here (0 on desktop, and 0 when no provider is
  // mounted, so this is a no-op everywhere else).
  const { navBarHeight } = useBottomBarContext()
  const [measuredHeight, setMeasuredHeight] = useState(0)

  // What callers offset their content by, so it has to be the space the banner
  // actually occupies measured from the bottom of the screen — which now
  // includes the tab bar it sits above. Reported from an effect rather than
  // straight out of onLayout: onLayout only fires when the card itself
  // re-lays-out, so a nav bar that appears or changes height afterwards would
  // leave the reported figure stale.
  useEffect(() => {
    reportBannerHeight(measuredHeight + spacing[16] + navBarHeight)
  }, [measuredHeight, navBarHeight, reportBannerHeight])

  const isVisible = isReady && shouldShowBanner

  const isWeb = Platform.OS === 'web'
  const maxWidth = styleProp?.maxWidth ?? 500

  const cardBg = colors.bg[theme].default
  const cardBorder = colors.border[theme].default
  const titleColor = colors.text[theme].primary
  const bodyColor = colors.text[theme].secondary
  const linkColor = theme === 'light' ? colors.primary[600] : colors.primary[400]

  return (
    <View
      pointerEvents={isVisible ? 'box-none' : 'none'}
      style={{
        position: 'absolute',
        bottom: spacing[16] + navBarHeight,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: spacing[8],
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <View
        onLayout={(e) => setMeasuredHeight(e.nativeEvent.layout.height)}
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: cardBg,
          borderRadius: borderRadius.xl,
          padding: spacing[16],
          borderWidth: 1,
          borderColor: cardBorder,
          ...shadows.soft,
        }}
      >
        <Stack gap={spacing[12]}>
          <Stack gap={spacing[8]}>
            <Heading level={6} style={{ color: titleColor }}>
              This site uses cookies
            </Heading>
            <Paragraph size="sm" style={{ color: bodyColor }}>
              We use cookies to make things work smoothly and help us learn.
              {privacyPolicyUrl ? (
                <>
                  {' '}
                  <Text
                    style={{ color: linkColor, textDecorationLine: 'underline' }}
                    onPress={() => isWeb && window.open(privacyPolicyUrl, '_blank')}
                  >
                    Review our privacy policy
                  </Text>
                  {' to learn more.'}
                </>
              ) : null}
            </Paragraph>
          </Stack>
          <Row gap={spacing[8]} justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
            <Button variant="outline" color="gray" size="md" onPress={openPreferences}>
              Manage
            </Button>
            <Row gap={spacing[8]}>
              <Button
                color="success"
                variant="filled"
                size="md"
                onPress={async () => {
                  setPendingAction('accept')
                  try {
                    await acceptAll()
                  } finally {
                    setPendingAction(null)
                  }
                }}
                disabled={pendingAction !== null}
              >
                Accept
              </Button>
              <Button
                color="error"
                variant="filled"
                size="md"
                onPress={async () => {
                  setPendingAction('reject')
                  try {
                    await rejectAll()
                  } finally {
                    setPendingAction(null)
                  }
                }}
                disabled={pendingAction !== null}
              >
                Reject
              </Button>
            </Row>
          </Row>
        </Stack>
      </View>
    </View>
  )
}
