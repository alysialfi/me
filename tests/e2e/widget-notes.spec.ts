import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const widget = (page: import('@playwright/test').Page) => page.locator('[data-widget="notes"]')

test('the notes widget lists the notes with title and date, and the count', async ({ page }) => {
  await page.goto('/')
  await expect(widget(page).locator('[data-note]')).toHaveCount(3)
  await expect(widget(page).getByTestId('notes-count')).toHaveText('3')
  await expect(widget(page).locator('[data-note="about-me"]')).toContainText('About me')
  await expect(widget(page).locator('[data-note="about-me"]')).toContainText('Jan 1, 2026')
  await expect(widget(page).locator('hr')).toHaveCount(2)
})

test('activating the header opens Notes', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-control="close"]').click()
  await widget(page).getByTestId('notes-widget-header').click()
  await expect(page.locator('[data-window="notes"]')).toBeVisible()
  await expect(page.getByTestId('note-body').getByRole('heading', { name: 'About me' })).toBeVisible()
})

test('activating a note row opens Notes on that note', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-control="close"]').click()
  await widget(page).locator('[data-note="placeholder-media"]').click()
  await expect(page.getByTestId('note-body').getByRole('heading', { name: 'Placeholder note with media' })).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/notes/placeholder-media')
})
