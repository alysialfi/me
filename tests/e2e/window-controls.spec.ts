import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const win = (page: Page, app: string) => page.locator(`[data-window="${app}"]`)
const dock = (page: Page, app: string) => page.locator(`[data-testid="dock"] [data-app="${app}"]`)
const control = (page: Page, app: string, name: string) => win(page, app).locator(`[data-control="${name}"]`)

test('close removes the window and its dock indicator', async ({ page }) => {
  await page.goto('/')
  await expect(dock(page, 'notes').getByTestId('running-indicator')).toBeVisible()
  await control(page, 'notes', 'close').click()
  await expect(win(page, 'notes')).toHaveCount(0)
  await expect(dock(page, 'notes').getByTestId('running-indicator')).toHaveCount(0)
})

test('minimize hides the window, keeps the dock indicator and focuses the next window', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await control(page, 'finder', 'minimize').click()
  await expect(win(page, 'finder')).toHaveCount(0)
  await expect(dock(page, 'finder').getByTestId('running-indicator')).toBeVisible()
  expect(await page.evaluate(() => document.elementFromPoint(300, 300)?.closest('[data-window]')?.getAttribute('data-window'))).toBe('notes')
})

test('dock click restores a minimized window in front, and never opens a second one', async ({ page }) => {
  await page.goto('/')
  await dock(page, 'finder').click()
  await control(page, 'finder', 'minimize').click()
  await dock(page, 'finder').click()
  await expect(win(page, 'finder')).toHaveCount(1)
  expect(await page.evaluate(() => document.elementFromPoint(300, 300)?.closest('[data-window]')?.getAttribute('data-window'))).toBe('finder')

  await dock(page, 'finder').click()
  await dock(page, 'notes').click()
  await expect(win(page, 'finder')).toHaveCount(1)
  await expect(win(page, 'notes')).toHaveCount(1)
  expect(await page.evaluate(() => document.elementFromPoint(300, 300)?.closest('[data-window]')?.getAttribute('data-window'))).toBe('notes')
})

test('green control toggles full screen and restores the previous size', async ({ page }) => {
  await page.goto('/')
  const before = (await win(page, 'notes').boundingBox())!
  await control(page, 'notes', 'fullscreen').click()
  expect(await win(page, 'notes').boundingBox()).toMatchObject({ x: 0, y: 28, width: 1280, height: 792 })
  await expect(control(page, 'notes', 'fullscreen')).toHaveAttribute('aria-label', 'Exit full screen')
  await control(page, 'notes', 'fullscreen').click()
  expect(await win(page, 'notes').boundingBox()).toEqual(before)
})

test('hovering the controls shows each symbol', async ({ page }) => {
  await page.goto('/')
  const symbols = win(page, 'notes').locator('[data-symbol]')
  for (const s of await symbols.all()) await expect(s).toHaveCSS('opacity', '0')
  await win(page, 'notes').getByTestId('window-controls').hover()
  for (const s of await symbols.all()) await expect(s).toHaveCSS('opacity', '1')
  await expect(symbols).toHaveCount(3)
})
