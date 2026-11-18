import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'

test.use({ viewport: { width: 1280, height: 820 } })

const widget = (page: import('@playwright/test').Page) => page.locator('[data-widget="notes"]')
// The notes in content/notes, so adding or removing a note does not break these tests.
const NOTE_COUNT = readdirSync('content/notes').filter(f => f.endsWith('.md')).length

test('the notes widget lists the notes with title and date, and the count', async ({ page }) => {
  await page.goto('/')
  await expect(widget(page).locator('[data-note]')).toHaveCount(NOTE_COUNT)
  await expect(widget(page).getByTestId('notes-count')).toHaveText(String(NOTE_COUNT))
  await expect(widget(page).locator('[data-note="about-me"]')).toContainText('About me')
  await expect(widget(page).locator('[data-note="about-me"]')).toContainText('Jan 1, 2026')
  await expect(widget(page).locator('hr')).toHaveCount(NOTE_COUNT - 1)
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
  await widget(page).locator('[data-note="god-i-love-being-young"]').click()
  await expect(page.getByTestId('note-body').getByRole('heading', { name: /God, I love being young/ })).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/notes/god-i-love-being-young')
})
