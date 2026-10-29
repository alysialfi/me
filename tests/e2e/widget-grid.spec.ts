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
