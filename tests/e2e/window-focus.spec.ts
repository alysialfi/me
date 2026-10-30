import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('opening a second app puts it in front; clicking the one behind focuses it', async ({ page }) => {
  await page.goto('/')
  const notes = page.locator('[data-window="notes"]')
  const finder = page.locator('[data-window="finder"]')
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect(finder).toBeVisible()
  await expect(page.locator('[data-genie]')).toHaveCount(0)

  const topAt = (x: number, y: number) => page.evaluate(([px, py]) => document.elementFromPoint(px, py)?.closest('[data-window]')?.getAttribute('data-window'), [x, y])
  // windows open centered on top of each other; move finder aside to expose a strip of notes
  const bar = (await finder.getByTestId('title-bar').boundingBox())!
  await page.mouse.move(bar.x + 200, bar.y + 10)
  await page.mouse.down()
  await page.mouse.move(bar.x + 380, bar.y + 90, { steps: 6 })
  await page.mouse.up()
  // overlap area (inside both windows): finder is in front
  expect(await topAt(500, 300)).toBe('finder')

  // click the exposed strip of the window behind
  const box = (await notes.boundingBox())!
  await page.mouse.click(box.x + 8, box.y + 12)
  expect(await topAt(500, 300)).toBe('notes')
  const z = (l: typeof notes) => l.evaluate(el => Number(getComputedStyle(el).zIndex))
  expect(await z(notes)).toBeGreaterThan(await z(finder))
})
