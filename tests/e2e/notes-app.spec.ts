import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const body = (page: Page) => page.locator('[data-window="notes"] [data-testid="note-body"]')

test('Notes opens on About me and lists every note', async ({ page }) => {
  await page.goto('/')
  await expect(body(page).getByRole('heading', { name: 'About me' })).toBeVisible()
  await expect(page.locator('[data-window="notes"] [data-note]')).toHaveCount(3)
})

test('selecting a note shows its content with image and video, and updates the URL', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-note="placeholder-media"]').click()
  await expect(body(page).getByRole('heading', { name: 'Placeholder note with media' })).toBeVisible()
  await expect(body(page).locator('img')).toBeVisible()
  await expect(body(page).locator('video')).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/notes/placeholder-media')
})

test('a video in a note plays inside the note', async ({ page }) => {
  await page.goto('/notes/placeholder-media')
  const video = body(page).locator('video')
  await expect(video).toBeVisible()
  await video.evaluate(v => (v as HTMLVideoElement).play())
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  expect(await video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(false)
})

test('a link to a project opens Finder in that project', async ({ page }) => {
  await page.goto('/')
  await body(page).getByRole('link', { name: 'Placeholder Alpha' }).click()
  await expect(page.locator('[data-window="finder"]')).toBeVisible()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/placeholder-alpha')
})

test('a link to an app opens that app', async ({ page }) => {
  await page.goto('/')
  await body(page).getByRole('link', { name: 'photos' }).click()
  await expect(page.locator('[data-window="photos"]')).toBeVisible()
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
