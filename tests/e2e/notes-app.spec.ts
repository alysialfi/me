import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readdirSync } from 'node:fs'

test.use({ viewport: { width: 1280, height: 820 } })

const body = (page: Page) => page.locator('[data-window="notes"] [data-testid="note-body"]')

// The notes in content/notes, so adding or removing a note does not break these tests.
const NOTE_COUNT = readdirSync('content/notes').filter(f => f.endsWith('.md')).length

test('Notes opens on About me and lists every note', async ({ page }) => {
  await page.goto('/')
  await expect(body(page).getByRole('heading', { name: 'About me' })).toBeVisible()
  await expect(page.locator('[data-window="notes"] [data-note]')).toHaveCount(NOTE_COUNT)
})

test('selecting a note shows its content with images, and updates the URL', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-note="god-i-love-being-young"]').click()
  await expect(body(page).getByRole('heading', { name: /God, I love being young/ })).toBeVisible()
  await expect(body(page).locator('img').first()).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/notes/god-i-love-being-young')
})

test('a link to an app opens that app', async ({ page }) => {
  await page.goto('/')
  await body(page).getByRole('link', { name: 'projects' }).click()
  await expect(page.locator('[data-window="finder"]')).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/finder')
})

test('an external link opens in a new tab and the portfolio stays open', async ({ page, context }) => {
  await page.goto('/')
  const link = body(page).getByRole('link', { name: 'GitHub' })
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', /noopener/)
  await context.route('https://github.com/**', route => route.fulfill({ body: 'ok' }))
  const [popup] = await Promise.all([context.waitForEvent('page'), link.click()])
  expect(popup.url()).toContain('github.com')
  await expect(page.locator('[data-window="notes"]')).toBeVisible()
})
