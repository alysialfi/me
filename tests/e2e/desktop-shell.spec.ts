import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('desktop shows menu bar and dock; a window opens and closes', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('menu-bar')).toBeVisible()
  await expect(page.getByTestId('dock')).toBeVisible()
  await expect(page.getByTestId('dock').locator('[data-app]')).toHaveCount(6)

  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  const win = page.locator('[data-window="finder"]')
  await expect(win).toBeVisible()
  await expect(page.getByTestId('desktop')).toBeVisible()

  await win.locator('[data-control="close"]').click()
  await expect(win).toHaveCount(0)
})

test('widget grid sits on 12 columns below the menu bar', async ({ page }) => {
  await page.goto('/')
  const grid = page.getByTestId('widget-grid')
  await expect(grid).toBeVisible()
  expect(await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(12)
  const box = await page.locator('[data-widget="clock"]').boundingBox()
  expect(Math.round(box!.x)).toBe(32)
  expect(Math.round(box!.y)).toBe(60)
})
