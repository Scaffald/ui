/**
 * Onboarding step navigation: vertically stacked Continue (primary) over Skip.
 * Step-back is handled by tapping the pagination dots in Onboarding.tsx.
 */

import { ChevronRight } from 'lucide-react-native'
import { Stack } from '../Layout'
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

  const darkIconColor = 'rgba(255,255,255,0.85)'
  const darkTextStyle = { color: 'rgba(255,255,255,0.85)' } as const
  const darkCtaStyle = {
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  } as const

  return (
    <Stack padding={20} gap={12}>
      <Button
        color="primary"
        variant={isLastStep ? 'filled' : 'outline'}
        onPress={handleGoNext}
        style={dark && !isLastStep ? darkCtaStyle : undefined}
        textStyle={dark && !isLastStep ? darkTextStyle : undefined}
        iconColor={dark && !isLastStep ? darkIconColor : undefined}
        iconEnd={ChevronRight}
      >
        {isLastStep ? getStartedLabel : continueLabel}
      </Button>
      <Button
        variant="text"
        onPress={() => onFinish?.()}
        textStyle={dark ? darkTextStyle : undefined}
      >
        {skipLabel}
      </Button>
    </Stack>
  )
}
