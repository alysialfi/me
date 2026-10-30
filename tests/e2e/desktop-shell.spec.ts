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

test('a new window takes 80% of the screen, centered below the menu bar', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect(page.locator('[data-genie]')).toHaveCount(0)
  const box = (await page.locator('[data-window="finder"]').boundingBox())!
  expect(box).toMatchObject({ x: 128, y: 82, width: 1024, height: 656 })
})

test('clicking the bare desktop minimizes every window; the dock restores them', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect(page.locator('[data-window]')).toHaveCount(2)
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  await expect(page.locator('[data-window]')).toHaveCount(0)
  await expect(page.locator('[data-testid="dock"] [data-app="finder"]').getByTestId('running-indicator')).toBeVisible()
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect(page.locator('[data-window="finder"]')).toHaveCount(1)
})

test('a pressed dock icon is covered by a dark overlay', async ({ page }) => {
  await page.goto('/')
  const icon = page.locator('[data-testid="dock"] [data-app="photos"]')
  const press = icon.getByTestId('icon-press')
  await expect(press).toHaveCSS('opacity', '0')
  const b = (await icon.boundingBox())!
  await page.mouse.move(b.x + 20, b.y + 20)
  await page.mouse.down()
  await expect(press).toHaveCSS('opacity', '1')
  await page.mouse.up()
})
