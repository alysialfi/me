import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('the calendar groups entries by year with an accent bar, title and period', async ({ page }) => {
  await page.goto('/')
  const widget = page.locator('[data-widget="calendar"]')
  await expect(widget.locator('[data-year]')).toHaveCount(5)
  const years = await widget.locator('[data-year]').evaluateAll(els => els.map(e => e.getAttribute('data-year')))
  expect(years).toEqual(['2024', '2023', '2022', '2021', '2016']) // newest first

  const current = widget.locator('[data-year="2024"]').getByTestId('calendar-entry').filter({ hasText: 'Work at Lunash' })
  await expect(current).toContainText('Work at Lunash')
  await expect(current.getByTestId('calendar-period')).toHaveText('2024 – now')
  await expect(current.getByTestId('calendar-bar')).toBeVisible()

  const school = widget.locator('[data-year="2016"]').getByTestId('calendar-entry')
  await expect(school.getByTestId('calendar-period')).toHaveText('2016 – 2019')
  const award = widget.locator('[data-year="2023"]').getByTestId('calendar-entry').filter({ hasText: 'Best Mentor' })
  await expect(award.getByTestId('calendar-period')).toHaveText('2023')
})

test('clicking a calendar entry expands its description and details; clicking again collapses it', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  const entry = page.locator('[data-widget="calendar"]').getByTestId('calendar-entry').filter({ hasText: 'Work at Lunash' })
  await expect(entry.getByTestId('calendar-details')).toHaveCount(0)
  await entry.getByTestId('calendar-toggle').click()
  await expect(entry.getByTestId('calendar-details')).toContainText('Full Stack Developer (freelance)')
  await expect(entry.getByTestId('calendar-details').locator('li')).toHaveCount(3)
  await entry.getByTestId('calendar-toggle').click()
  await expect(entry.getByTestId('calendar-details')).toHaveCount(0)
})
