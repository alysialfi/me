import { expect, test } from '@playwright/test'

test('apps are windows at lg and full-screen below; open apps survive a resize', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 820 })
  await page.goto('/')
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await page.locator('[data-testid="dock"] [data-app="music"]').click()
  await expect(page.locator('[data-presentation="window"]')).toHaveCount(3) // notes, finder, music

  // narrow below lg: only the focused app (music), full-screen
  await page.setViewportSize({ width: 800, height: 1024 })
  await expect(page.locator('[data-window]')).toHaveCount(1)
  const sheet = page.locator('[data-window="music"]')
  await expect(sheet).toHaveAttribute('data-presentation', 'sheet')
  expect(await sheet.boundingBox()).toMatchObject({ x: 0, y: 0, width: 800, height: 1024 })

  // widen again: the extra windows return
  await page.setViewportSize({ width: 1280, height: 820 })
  await expect(page.locator('[data-presentation="window"]')).toHaveCount(3)
  await expect(page.locator('[data-window="finder"]')).toBeVisible()
  await expect(page.locator('[data-window="notes"]')).toBeVisible()
})

test('a later app opened below lg is full-screen and closing returns home', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 800 })
  await page.goto('/')
  await page.locator('[data-testid="dock"] [data-app="photos"]').click()
  await expect(page.locator('[data-window]')).toHaveCount(1)
  await expect(page.locator('[data-window="photos"]')).toHaveAttribute('data-presentation', 'sheet')
  await page.locator('[data-window="photos"] [data-control="close"]').click()
  await expect(page.locator('[data-window]')).toHaveCount(0)
  await expect(page.getByTestId('touch-home')).toBeVisible()
})
