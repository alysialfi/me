import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

// 12 columns, 32px side margins, 24px gutters: a span of n columns is n*col + (n-1)*gutter.
const GRID = 1280 - 64
const GUTTER = 24
const COL = (GRID - 11 * GUTTER) / 12
const span = (n: number) => n * COL + (n - 1) * GUTTER

const SPANS: Record<string, number> = { 'clock': 2, 'photo-carousel': 3, 'notes': 3, 'calendar': 4, 'music': 4 }
// Widths in the Penpot "Home / xl" board.
const DESIGN: Record<string, number> = { 'clock': 183, 'photo-carousel': 286, 'notes': 286, 'calendar': 389, 'music': 389 }

test('widgets span 2, 3, 3, 4 and 4 of 12 columns at 1280px', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-widget]')).toHaveCount(5)
  for (const [id, n] of Object.entries(SPANS)) {
    const box = (await page.locator(`[data-widget="${id}"]`).boundingBox())!
    expect(box.width, `${id} width`).toBeCloseTo(span(n), 0)
    expect(Math.abs(box.width - DESIGN[id]!), `${id} vs design`).toBeLessThanOrEqual(1)
  }
})

test('widgets sit on the design columns', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-widget]')).toHaveCount(5)
  const x = async (id: string) => Math.round((await page.locator(`[data-widget="${id}"]`).boundingBox())!.x)
  expect(await x('clock')).toBe(32)
  expect(await x('photo-carousel')).toBe(32)
  expect(await x('calendar')).toBe(549)
  expect(await x('notes')).toBe(962)
  expect(await x('music')).toBe(859)
})

test('widgets are not resizable', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-resize-widget]')).toHaveCount(0)
})

test('widget content follows its size', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  await expect(page.locator('[data-widget="notes"] [data-note]').first()).toContainText(/\d{4}/)
  await expect(page.locator('[data-widget="music"]').getByTestId('up-next')).toHaveCount(0)
})

const dragBy = async (page: import('@playwright/test').Page, id: string, dx: number, dy: number, release = true) => {
  const box = (await page.locator(`[data-widget="${id}"]`).boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + 30
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 10 })
  if (release) await page.mouse.up()
}

test('a widget can be dragged onto free space and snaps to the columns; a reload puts it back', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  const before = (await page.locator('[data-widget="clock"]').boundingBox())!
  await dragBy(page, 'clock', 3 * (COL + GUTTER) + 10, 0)
  const after = (await page.locator('[data-widget="clock"]').boundingBox())!
  expect(Math.round(after.x)).toBe(Math.round(before.x + 3 * (COL + GUTTER)))
  expect(Math.round(after.y)).toBe(Math.round(before.y))
  await page.reload()
  await expect(page.locator('[data-widget="clock"]')).toBeVisible()
  expect(Math.round((await page.locator('[data-widget="clock"]').boundingBox())!.x)).toBe(Math.round(before.x))
})

test('a widget dropped on another widget or off the free area goes back', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  const before = (await page.locator('[data-widget="clock"]').boundingBox())!
  await dragBy(page, 'clock', 600, 0, false)
  await expect(page.getByTestId('widget-ghost')).toHaveAttribute('data-free', 'false')
  await page.mouse.up()
  expect(await page.locator('[data-widget="clock"]').boundingBox()).toEqual(before)

  await dragBy(page, 'clock', 0, 620)
  expect(await page.locator('[data-widget="clock"]').boundingBox()).toEqual(before)
})

test('dragging does not activate the widget under the pointer', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="desktop"]').click({ position: { x: 5, y: 700 } })
  await dragBy(page, 'notes', -300, 400)
  await expect(page.locator('[data-window]')).toHaveCount(0)
})
