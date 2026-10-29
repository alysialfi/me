import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const widgetPlay = (page: Page) => page.locator('[data-widget="music"]').getByTestId('widget-play')
const appSong = (page: Page, id: string) => page.locator(`[data-window="music"] [data-song="${id}"]`)
const audioPaused = (page: Page) => page.locator('[data-testid="shared-audio"]').evaluate((a: HTMLAudioElement) => a.paused)

test('the widget shows the first song while nothing plays', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-widget="music"]').getByTestId('widget-title')).toHaveText('Placeholder Song 1')
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'paused')
  expect(await audioPaused(page)).toBe(true)
})

test('play in the widget updates the Music app, and pause there updates the widget', async ({ page }) => {
  await page.goto('/music')
  await widgetPlay(page).click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
  await expect(appSong(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'playing')

  await widgetPlay(page).click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'paused')
  await expect(appSong(page, '01-placeholder-song-1')).toHaveAttribute('data-state', 'paused')
})

test('play in the Music app updates the widget, including a different track', async ({ page }) => {
  await page.goto('/music')
  await appSong(page, '02-placeholder-song-2').click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
  await expect(page.locator('[data-widget="music"]').getByTestId('widget-title')).toHaveText('Placeholder Song 2')
  await appSong(page, '02-placeholder-song-2').click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'paused')
})

test('the widget keeps showing the playing state after the Music window closes; progress moves', async ({ page }) => {
  await page.goto('/music')
  await appSong(page, '01-placeholder-song-1').click()
  await page.locator('[data-window="music"] [data-control="close"]').click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
  await expect.poll(() => page.locator('[data-widget="music"]').getByTestId('widget-progress').evaluate(el => parseFloat((el as HTMLElement).style.width))).toBeGreaterThan(0)
})

test('next switches songs; only one plays', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-widget="music"]').getByTestId('widget-next').click()
  await expect(page.locator('[data-widget="music"]').getByTestId('widget-title')).toHaveText('Placeholder Song 2')
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
  expect(await page.locator('audio').count()).toBe(1)
})
