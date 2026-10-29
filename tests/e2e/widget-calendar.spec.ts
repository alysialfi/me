import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('the calendar groups entries by year with an accent bar, title and period', async ({ page }) => {
  await page.goto('/')
  const widget = page.locator('[data-widget="calendar"]')
  await expect(widget.locator('[data-year]')).toHaveCount(4)
  const years = await widget.locator('[data-year]').evaluateAll(els => els.map(e => e.getAttribute('data-year')))
  expect(years).toEqual(['2024', '2022', '2019', '2015']) // newest first

  const current = widget.locator('[data-year="2024"]').getByTestId('calendar-entry')
  await expect(current).toContainText('Placeholder Current Role')
  await expect(current.getByTestId('calendar-period')).toHaveText('2024 – now')
  await expect(current.getByTestId('calendar-bar')).toBeVisible()

  const school = widget.locator('[data-year="2015"]').getByTestId('calendar-entry')
  await expect(school.getByTestId('calendar-period')).toHaveText('2015 – 2019')
})
