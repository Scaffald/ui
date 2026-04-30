/**
 * Onboarding step navigation: prev/next, skip, continue/get started
 */

import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { Row, Stack } from '../Layout'
import { Button } from '../Button'
import type { OnboardingControlsProps } from './Onboarding.types'

export function OnboardingControls({
  currentIdx,
  onChange,
  stepsCount,
  onFinish,
  skipLabel = 'Skip',
  continueLabel = 'Continue',
  getStartedLabel = 'Get Started',
  overlay = 'light',
}: OnboardingControlsProps) {
  const isLastStep = currentIdx === stepsCount - 1
  const dark = overlay === 'dark'

  const handleGoNext = () => {
    if (isLastStep) {
      onFinish?.()
      return
    }
    onChange(currentIdx + 1)
  }

  const handleGoPrev = () => {
    if (currentIdx > 0) {
      onChange(currentIdx - 1)
    }
  }

  const darkIconColor = 'rgba(255,255,255,0.85)'
  const darkTextStyle = { color: 'rgba(255,255,255,0.85)' } as const
  const darkCtaStyle = {
    flex: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  } as const
  const darkCtaFilledStyle = { flex: 1 } as const

  return (
    <Stack padding={20} gap={16}>
      <Row justify="space-between" align="center">
        <Button
          variant="text"
          onPress={handleGoPrev}
          iconStart={ChevronLeft}
          iconColor={dark ? darkIconColor : undefined}
        />
        <Button
          variant="text"
          onPress={handleGoNext}
          iconEnd={ChevronRight}
          iconColor={dark ? darkIconColor : undefined}
        />
      </Row>
      <Row justify="space-between" align="center" gap={16}>
        <Button
          variant="text"
          onPress={() => onFinish?.()}
          textStyle={dark ? darkTextStyle : undefined}
        >
          {skipLabel}
        </Button>
        <Button
          color="primary"
          variant={isLastStep ? 'filled' : 'outline'}
          onPress={handleGoNext}
          style={dark ? (isLastStep ? darkCtaFilledStyle : darkCtaStyle) : { flex: 1 }}
          textStyle={dark && !isLastStep ? darkTextStyle : undefined}
          iconColor={dark && !isLastStep ? darkIconColor : undefined}
          iconEnd={ChevronRight}
        >
          {isLastStep ? getStartedLabel : continueLabel}
        </Button>
      </Row>
    </Stack>
  )
}
