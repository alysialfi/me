import { expect, test } from '@playwright/test'

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`
}

test('token page renders each token with the design value', async ({ page }) => {
  await page.goto('/dev/tokens')
  const css = (token: string, prop: string) =>
    page.locator(`[data-token="${token}"]`).first().evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)

  const colors: Record<string, string> = {
    'wallpaper-teal': '#809b98', 'wallpaper-mist': '#d5d4cd', card: '#f4f3f3', 'card-cream': '#fdfae9',
    'accent-pink': '#f1c8cc', 'accent-green': '#cde6c5', ink: '#2f3b3a', 'ink-inverse': '#ffffff'
  }
  for (const [name, hex] of Object.entries(colors)) expect(await css(name, 'background-color')).toBe(rgb(hex))

  expect(await css('card', 'border-top-left-radius')).toBe('24px')
  expect(await css('icon', 'border-top-left-radius')).toBe('20px')
  expect(await css('window', 'border-top-left-radius')).toBe('14px')
  expect(await css('widget', 'border-top-left-radius')).toBe('28px')

  for (const [name, px] of Object.entries({ xs: 8, sm: 16, md: 24, lg: 32 })) {
    expect(await css(name, 'width')).toBe(`${px}px`)
  }
  for (const [name, px] of Object.entries({ '2xs': 10, base: 13, '6xl': 40 })) {
    expect(await css(name, 'font-size')).toBe(`${px}px`)
  }
  expect(await css('2xs', 'font-family')).toContain('Plus Jakarta Sans')
  expect(await css('glass', 'background-color')).toBe('rgba(255, 255, 255, 0.28)')
  expect(await css('glass', 'backdrop-filter')).toContain('blur(20px)')
})
