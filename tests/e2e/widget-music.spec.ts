import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const widget = (page: Page) => page.locator('[data-widget="music"]')
const widgetPlay = (page: Page) => widget(page).getByTestId('widget-play')
const appSong = (page: Page) => page.locator('[data-window="music"] [data-song="the-way-home"]')

// Windows open at 80% of the screen and cover the widgets; a click on the bare desktop minimizes them.
const showDesktop = async (page: Page) => {
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  await expect(page.locator('[data-window]')).toHaveCount(0)
}

test('the widget shows the song and plays it after load', async ({ page }) => {
  await page.goto('/')
  await expect(widget(page).getByTestId('widget-title')).toHaveText('The Way Home')
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
})

test('pause in the widget updates the Music app, and play there updates the widget', async ({ page }) => {
  await page.goto('/music')
  await expect(appSong(page)).toHaveAttribute('data-state', 'playing')
  await showDesktop(page)
  await widgetPlay(page).click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'paused')
  await page.locator('[data-testid="dock"] [data-app="music"]').click()
  await expect(appSong(page)).toHaveAttribute('data-state', 'paused')

  await appSong(page).click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
})

test('the widget keeps showing the playing state after the Music window closes; progress moves', async ({ page }) => {
  await page.goto('/music')
  await expect(appSong(page)).toHaveAttribute('data-state', 'playing')
  await page.locator('[data-window="music"] [data-control="close"]').click()
  await expect(widgetPlay(page)).toHaveAttribute('data-state', 'playing')
  await expect.poll(() => widget(page).getByTestId('widget-progress').evaluate(el => parseFloat((el as HTMLElement).style.width))).toBeGreaterThan(0)
})
