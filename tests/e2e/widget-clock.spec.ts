import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('the clock widget shows hh:mm and the date, and ticks', async ({ page }) => {
  await page.clock.install({ time: new Date(2024, 5, 9, 13, 51, 0) })
  await page.goto('/')
  const widget = page.locator('[data-widget="clock"]')
  await expect(widget.getByTestId('clock-time')).toHaveText('13:51')
  await expect(widget.getByTestId('clock-date')).toHaveText('Sun, Jun 9')
  await page.clock.runFor(61_000)
  await expect(widget.getByTestId('clock-time')).toHaveText('13:52')
})
