import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const titleBar = (page: import('@playwright/test').Page) => page.locator('[data-window="notes"] [data-testid="title-bar"]')

test('dragging the title bar moves the window and leaves the URL alone', async ({ page }) => {
  await page.goto('/')
  const win = page.locator('[data-window="notes"]')
  const before = (await win.boundingBox())!
  const bar = (await titleBar(page).boundingBox())!
  await page.mouse.move(bar.x + 300, bar.y + 20)
  await page.mouse.down()
  await page.mouse.move(bar.x + 400, bar.y + 90, { steps: 5 })
  await page.mouse.up()
  const after = (await win.boundingBox())!
  expect(Math.round(after.x - before.x)).toBe(100)
  expect(Math.round(after.y - before.y)).toBe(70)
  expect(new URL(page.url()).pathname).toBe('/')
  const historyLength = await page.evaluate(() => history.length)
  expect(historyLength).toBeLessThanOrEqual(2)
})

test('dragging past the screen edge keeps the title bar visible', async ({ page }) => {
  await page.goto('/')
  const bar = (await titleBar(page).boundingBox())!
  await page.mouse.move(bar.x + 300, bar.y + 20)
  await page.mouse.down()
  await page.mouse.move(-400, -300, { steps: 5 })
  await page.mouse.up()
  const moved = (await titleBar(page).boundingBox())!
  expect(moved.y).toBeGreaterThanOrEqual(28)
  expect(moved.x + moved.width).toBeGreaterThanOrEqual(100)

  const bar2 = moved
  await page.mouse.move(bar2.x + bar2.width - 20, bar2.y + 20)
  await page.mouse.down()
  await page.mouse.move(5000, 5000, { steps: 5 })
  await page.mouse.up()
  const far = (await titleBar(page).boundingBox())!
  expect(far.y).toBeLessThanOrEqual(820 - 40)
  expect(far.x).toBeLessThanOrEqual(1280 - 100)
})

test('windows cannot be dragged on a small screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const overlay = page.locator('[data-window="notes"]')
  const before = (await overlay.boundingBox())!
  await page.mouse.move(before.x + 150, before.y + 24)
  await page.mouse.down()
  await page.mouse.move(before.x + 20, before.y + 200, { steps: 5 })
  await page.mouse.up()
  expect(await overlay.boundingBox()).toEqual(before)
})
