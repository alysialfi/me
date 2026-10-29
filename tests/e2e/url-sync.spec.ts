import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const dock = (page: Page, app: string) => page.locator(`[data-testid="dock"] [data-app="${app}"]`)
const win = (page: Page, app: string) => page.locator(`[data-window="${app}"]`)
const url = (page: Page) => { const u = new URL(page.url()); return u.pathname + u.search }
const front = (page: Page) => page.evaluate(() => document.elementFromPoint(300, 300)?.closest('[data-window]')?.getAttribute('data-window'))

test('the URL stays / until another app opens, then follows the focused app with a with list', async ({ page }) => {
  await page.goto('/')
  expect(url(page)).toBe('/')
  await dock(page, 'finder').click()
  await expect.poll(() => url(page)).toBe('/finder?with=notes')
  await dock(page, 'music').click()
  await expect.poll(() => url(page)).toBe('/music?with=notes,finder')
  await win(page, 'notes').locator('[data-testid="title-bar"]').click({ position: { x: 60, y: 10 } })
  await expect.poll(() => url(page)).toBe('/notes?with=finder,music')
})

test('back and forward move between app states', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await expect.poll(() => url(page)).toBe('/finder?with=notes')
  await page.goBack()
  await expect.poll(() => url(page)).toBe('/')
  await expect(win(page, 'finder')).toHaveCount(0)
  await expect(win(page, 'notes')).toBeVisible()
  await page.goForward()
  await expect.poll(() => url(page)).toBe('/finder?with=notes')
  await expect(win(page, 'finder')).toBeVisible()
})

test('closing the focused window focuses the next; closing the last returns to /', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await expect.poll(() => url(page)).toBe('/finder?with=notes')
  await win(page, 'finder').locator('[data-control="close"]').click()
  await expect.poll(() => url(page)).toBe('/')
  expect(await front(page)).toBe('notes')
  await win(page, 'notes').locator('[data-control="close"]').click()
  await expect(page.locator('[data-window]')).toHaveCount(0)
  expect(url(page)).toBe('/')
})

test('dragging does not change the URL or add history', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await expect.poll(() => url(page)).toBe('/finder?with=notes')
  const before = await page.evaluate(() => history.length)
  const bar = (await win(page, 'finder').locator('[data-testid="title-bar"]').boundingBox())!
  await page.mouse.move(bar.x + 300, bar.y + 20)
  await page.mouse.down()
  await page.mouse.move(bar.x + 380, bar.y + 80, { steps: 4 })
  await page.mouse.up()
  expect(url(page)).toBe('/finder?with=notes')
  expect(await page.evaluate(() => history.length)).toBe(before)
})

test('a direct link opens that app and the with list, not the first-load Notes', async ({ page }) => {
  await page.goto('/finder/project-x?with=music,bogus')
  await expect(win(page, 'finder')).toBeVisible()
  await expect(win(page, 'music')).toBeVisible()
  await expect(win(page, 'notes')).toHaveCount(0)
  await expect(page.locator('[data-window]')).toHaveCount(2)
  expect(await front(page)).toBe('finder')
  expect(url(page)).toBe('/finder/project-x?with=music')
})

test('minimized apps are not in the URL', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await win(page, 'finder').locator('[data-control="minimize"]').click()
  await expect.poll(() => url(page)).toBe('/')
  await page.reload()
  await expect(win(page, 'finder')).toHaveCount(0)
})

test('below lg only the focused app is in the path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await dock(page, 'finder').click()
  await expect.poll(() => url(page)).toBe('/finder')
})
