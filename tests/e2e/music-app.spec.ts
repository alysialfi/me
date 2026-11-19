import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const audio = (page: Page) => page.locator('[data-testid="shared-audio"]')
const paused = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => a.paused)
const song = (page: Page) => page.locator('[data-window="music"] [data-song="the-way-home"]')

const open = async (page: Page) => {
  await page.goto('/music')
  await expect(song(page)).toBeVisible()
}

test('the song is listed with genre, duration and a credit; the header shows it', async ({ page }) => {
  await page.goto('/music')
  await expect(page.locator('[data-window="music"] [data-song]')).toHaveCount(1)
  await expect(page.getByTestId('featured-title')).toHaveText('The Way Home')
  await expect(song(page).getByTestId('genre-tag')).toHaveText('Lo-fi')
  await expect(song(page)).toContainText('2:10')
  await expect(page.getByTestId('song-credit')).toHaveAttribute('href', 'https://soundcloud.com/lofivelvet/the-way-home')
})

test('the genre filter narrows the list; All shows everything again', async ({ page }) => {
  await page.goto('/music')
  await page.locator('[data-window="music"] [data-genre="lo-fi"]').click()
  await expect(page.locator('[data-window="music"] [data-song]')).toHaveCount(1)
  await page.locator('[data-window="music"] [data-genre="all"]').click()
  await expect(page.locator('[data-window="music"] [data-song]')).toHaveCount(1)
})

test('nothing plays until the visitor presses play; play then pause', async ({ page }) => {
  await open(page)
  expect(await paused(page)).toBe(true)
  await expect(song(page)).toHaveAttribute('data-state', 'paused')

  await song(page).click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
  expect(await paused(page)).toBe(false)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0)
  expect(await page.locator('audio').count()).toBe(1)

  await song(page).click()
  await expect(song(page)).toHaveAttribute('data-state', 'paused')
  expect(await paused(page)).toBe(true)
})

test('the header play button plays and pauses the song', async ({ page }) => {
  await open(page)
  await page.getByTestId('music-play').click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
  await page.getByTestId('music-play').click()
  await expect(song(page)).toHaveAttribute('data-state', 'paused')
})

test('playback continues after the Music window closes', async ({ page }) => {
  await open(page)
  await song(page).click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
  await page.locator('[data-window="music"] [data-control="close"]').click()
  await expect(page.locator('[data-window="music"]')).toHaveCount(0)
  expect(await paused(page)).toBe(false)
  const t1 = await audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(t1)

  // reopening shows the same state
  await page.locator('[data-testid="dock"] [data-app="music"]').click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
})
