import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const audio = (page: Page) => page.locator('[data-testid="shared-audio"]')
const paused = (page: Page) => audio(page).evaluate((a: HTMLAudioElement) => a.paused)
const song = (page: Page) => page.locator('[data-window="music"] [data-song="the-way-home"]')

// The site starts the song itself once the page has loaded.
const autoplayed = async (page: Page) => {
  await page.goto('/music')
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
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

test('the song starts by itself after load', async ({ page }) => {
  await autoplayed(page)
  expect(await paused(page)).toBe(false)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0)
  expect(await page.locator('audio').count()).toBe(1)
})

test('the header play button pauses and resumes the song', async ({ page }) => {
  await autoplayed(page)
  await page.getByTestId('music-play').click()
  await expect(song(page)).toHaveAttribute('data-state', 'paused')
  expect(await paused(page)).toBe(true)
  await page.getByTestId('music-play').click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
})

test('clicking the song pauses and resumes it', async ({ page }) => {
  await autoplayed(page)
  await song(page).click()
  await expect(song(page)).toHaveAttribute('data-state', 'paused')
  await song(page).click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
})

test('playback continues after the Music window closes', async ({ page }) => {
  await autoplayed(page)
  await page.locator('[data-window="music"] [data-control="close"]').click()
  await expect(page.locator('[data-window="music"]')).toHaveCount(0)
  expect(await paused(page)).toBe(false)
  const t1 = await audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)
  await expect.poll(() => audio(page).evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(t1)

  // reopening shows the same state
  await page.locator('[data-testid="dock"] [data-app="music"]').click()
  await expect(song(page)).toHaveAttribute('data-state', 'playing')
})

test('when the browser blocks autoplay, the first click starts the song', async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play
    let blocked = true
    addEventListener('click', () => { blocked = false }, true)
    HTMLMediaElement.prototype.play = function () {
      return blocked ? Promise.reject(new DOMException('blocked', 'NotAllowedError')) : play.call(this)
    }
  })
  await page.goto('/music')
  await expect(song(page)).toBeVisible()
  await expect(song(page)).toHaveAttribute('data-state', 'paused')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  await expect(page.locator('[data-window]')).toHaveCount(0)
  await expect(page.locator('[data-widget="music"]').getByTestId('widget-play')).toHaveAttribute('data-state', 'playing')
})
