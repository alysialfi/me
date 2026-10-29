import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const audio = (page: Page) => page.locator('[data-testid="shared-audio"]')
const paused = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => a.paused)
const src = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => new URL(a.src, location.href).pathname)
const song = (page: Page, id: string) => page.locator(`[data-window="music"] [data-song="${id}"]`)

test('songs are listed; a song without cover art shows the default cover', async ({ page }) => {
  await page.goto('/music')
  await expect(page.locator('[data-window="music"] [data-song]')).toHaveCount(2)
  await expect(page.getByTestId('default-cover')).toHaveCount(1)
})

test('nothing plays until the visitor presses play; play then pause', async ({ page }) => {
  await page.goto('/music')
  await expect(song(page, '01-placeholder-song-1')).toBeVisible()
  expect(await paused(page)).toBe(true)

  await song(page, '01-placeholder-song-1').click()
  await expect(song(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'playing')
  expect(await paused(page)).toBe(false)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0)

  await song(page, '01-placeholder-song-1').click()
  await expect(song(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'paused')
  expect(await paused(page)).toBe(true)
})

test('selecting another song stops the first; only one plays', async ({ page }) => {
  await page.goto('/music')
  await song(page, '01-placeholder-song-1').click()
  await song(page, '02-placeholder-song-2').click()
  await expect(song(page, '02-placeholder-song-2')).toHaveAttribute('data-state', 'playing')
  await expect(song(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'paused')
  expect(await src(page)).toBe('/media/songs/placeholder-song-2.wav')
  expect(await page.locator('audio').count()).toBe(1)
})

test('playback continues after the Music window closes', async ({ page }) => {
  await page.goto('/music')
  await song(page, '01-placeholder-song-1').click()
  await expect(song(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'playing')
  await page.locator('[data-window="music"] [data-control="close"]').click()
  await expect(page.locator('[data-window="music"]')).toHaveCount(0)
  expect(await paused(page)).toBe(false)
  const t1 = await audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(t1)

  // reopening shows the same state
  await page.locator('[data-testid="dock"] [data-app="music"]').click()
  await expect(song(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'playing')
})
