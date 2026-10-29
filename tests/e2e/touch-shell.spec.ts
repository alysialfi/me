import { expect, test } from '@playwright/test'

const sheetFillsScreen = async (page: import('@playwright/test').Page, w: number, h: number) => {
  const box = await page.locator('[data-presentation="sheet"]').boundingBox()
  expect(box).toMatchObject({ x: 0, y: 0, width: w, height: h })
}

test.describe('iOS (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows status bar, widgets, app grid and a 4-icon dock; apps open full-screen', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('status-bar')).toBeVisible()
    await expect(page.getByTestId('app-grid').locator('[data-app]')).toHaveCount(2)
    await expect(page.locator('[data-testid="dock"] [data-app]:visible')).toHaveCount(4)
    await expect(page.getByTestId('menu-bar')).toHaveCount(0)

    await page.locator('[data-testid="app-grid"] [data-app="music"]').click()
    await sheetFillsScreen(page, 390, 844)
    await page.locator('[data-presentation="sheet"] [data-control="close"]').click()
    await expect(page.locator('[data-presentation="sheet"]')).toHaveCount(0)
    await expect(page.getByTestId('dock')).toBeVisible()
  })
})

test.describe('iPadOS (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('shows status bar and a 6-icon dock without the app grid; apps open full-screen', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('status-bar')).toBeVisible()
    await expect(page.locator('[data-testid="dock"] [data-app]:visible')).toHaveCount(6)
    await expect(page.getByTestId('app-grid')).toBeHidden()

    await page.locator('[data-testid="dock"] [data-app="finder"]').click()
    await sheetFillsScreen(page, 768, 1024)
    await page.locator('[data-presentation="sheet"] [data-control="close"]').click()
    await expect(page.locator('[data-presentation="sheet"]')).toHaveCount(0)
  })
})
