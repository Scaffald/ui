import { describe, expect, it } from 'vitest'
import { getAppearanceThemeCardStyles } from '../../components/AppearanceThemeCard/AppearanceThemeCard.styles'

describe('getAppearanceThemeCardStyles (Scaffald/SaaS#1090)', () => {
  const styles = getAppearanceThemeCardStyles('light', 'system', false)

  it('insets the label from the card edges', () => {
    expect(styles.label.paddingHorizontal).toBe(12)
    expect(styles.label.paddingVertical).toBe(8)
  })

  it('lets a caller narrow the card: the preview fills it and the height follows content', () => {
    expect(styles.container.width).toBe(160)
    expect(styles.container.height).toBeUndefined()
    expect(styles.preview.width).toBe('100%')
  })

  it('keeps the selected border', () => {
    expect(getAppearanceThemeCardStyles('light', 'light', true).container.borderWidth).toBe(2)
    expect(styles.container.borderWidth).toBe(1)
  })
})
