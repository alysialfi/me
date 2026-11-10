import { expect, test } from '@playwright/test'

const sheetFillsScreen = async (page: import('@playwright/test').Page, w: number, h: number) => {
  const box = await page.locator('[data-presentation="sheet"]').boundingBox()
  expect(box).toMatchObject({ x: 0, y: 0, width: w, height: h })
}

test.describe('iOS (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows status bar, widgets and a 6-icon dock that fits the screen; apps open full-screen', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('status-bar')).toBeVisible()
    await expect(page.getByTestId('app-grid')).toHaveCount(0)
    await expect(page.locator('[data-testid="dock"] [data-app]:visible')).toHaveCount(6)
    const dock = await page.getByTestId('dock').boundingBox()
    expect(dock!.x).toBeGreaterThanOrEqual(0)
    expect(dock!.x + dock!.width).toBeLessThanOrEqual(390)
    await expect(page.getByTestId('menu-bar')).toHaveCount(0)

    await page.locator('[data-testid="dock"] [data-app="music"]').click()
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

    await page.locator('[data-testid="dock"] [data-app="finder"]').click()
    await sheetFillsScreen(page, 768, 1024)
    await page.locator('[data-presentation="sheet"] [data-control="close"]').click()
    await expect(page.locator('[data-presentation="sheet"]')).toHaveCount(0)
  })
})

test.describe('status bar (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows the real time', async ({ page }) => {
    await page.clock.install({ time: new Date(2026, 10, 9, 17, 5, 0) })
    await page.goto('/')
    await expect(page.getByTestId('status-time')).toHaveText(/^(5|17):05$/)
    await page.clock.runFor(60_000)
    await expect(page.getByTestId('status-time')).toHaveText(/^(5|17):06$/)
  })

  const withConnection = (conn: object) => (page: import('@playwright/test').Page) =>
    page.addInitScript((c) => {
      Object.defineProperty(navigator, 'connection', { value: Object.assign(new EventTarget(), c), configurable: true })
    }, conn)

  test('a wifi connection shows wifi arcs matched to its quality', async ({ page }) => {
    await withConnection({ type: 'wifi', effectiveType: '3g', downlink: 1 })(page)
    await page.goto('/')
    await expect(page.getByTestId('signal-wifi')).toHaveAttribute('data-arcs', '2')
    await expect(page.getByTestId('signal-bars')).toHaveCount(0)
  })

  test('a mobile data connection shows signal bars matched to its quality', async ({ page }) => {
    await withConnection({ type: 'cellular', effectiveType: '4g', downlink: 20 })(page)
    await page.goto('/')
    await expect(page.getByTestId('signal-bars')).toHaveAttribute('data-bars', '4')
    await expect(page.getByTestId('signal-wifi')).toHaveCount(0)
  })

  test('without the Network Information API no made-up signal is shown', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: undefined, configurable: true }))
    await page.goto('/')
    await expect(page.getByTestId('status-bar')).toBeVisible()
    await expect(page.locator('[data-testid="signal-bars"], [data-testid="signal-wifi"]')).toHaveCount(0)
  })
})
