import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

async function drag(page: import('@playwright/test').Page, from: [number, number], to: [number, number]) {
  await page.mouse.move(...from)
  await page.mouse.down()
  await page.mouse.move(...to, { steps: 6 })
  await page.mouse.up()
}

test('dragging a corner resizes; min 320x240 and max full screen are enforced', async ({ page }) => {
  await page.goto('/')
  const win = page.locator('[data-window="notes"]')
  const b = (await win.boundingBox())!

  await drag(page, [b.x + b.width - 8, b.y + b.height - 8], [b.x + b.width + 92, b.y + b.height + 52])
  const grown = (await win.boundingBox())!
  expect(Math.round(grown.width - b.width)).toBe(100)
  expect(Math.round(grown.height - b.height)).toBe(60)

  await drag(page, [grown.x + grown.width - 8, grown.y + grown.height - 8], [0, 0])
  const small = (await win.boundingBox())!
  expect(Math.round(small.width)).toBe(320)
  expect(Math.round(small.height)).toBe(240)

  await drag(page, [small.x + small.width - 8, small.y + small.height - 8], [5000, 5000])
  const big = (await win.boundingBox())!
  expect(Math.round(big.x + big.width)).toBe(1280)
  expect(Math.round(big.y + big.height)).toBe(820)
})

test('resizing from the west edge keeps the right edge fixed', async ({ page }) => {
  await page.goto('/')
  const win = page.locator('[data-window="notes"]')
  const b = (await win.boundingBox())!
  await drag(page, [b.x + 2, b.y + b.height / 2], [b.x - 60, b.y + b.height / 2])
  const after = (await win.boundingBox())!
  expect(Math.round(after.x + after.width)).toBe(Math.round(b.x + b.width))
  expect(Math.round(after.width - b.width)).toBe(62)
})
