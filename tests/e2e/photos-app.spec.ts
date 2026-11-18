import { expect, test } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

test.use({ viewport: { width: 1280, height: 820 } })

// The photo years in content/photos, newest first, so new photos do not break these tests.
const YEARS = [...new Set(readdirSync('content/photos').filter(f => f.endsWith('.yml')).map(f => String(parse(readFileSync(join('content/photos', f), 'utf8')).year)))].sort().reverse()

const photos = (page: import('@playwright/test').Page) => page.locator('[data-window="photos"] [data-photo]')

test('photos are grouped under year headings, newest first', async ({ page }) => {
  await page.goto('/photos')
  const years = page.locator('[data-window="photos"] [data-year]')
  await expect(years).toHaveCount(YEARS.length)
  expect(await years.evaluateAll(els => els.map(e => e.getAttribute('data-year')))).toEqual(YEARS)
  await expect(years.first().locator('[data-photo]')).not.toHaveCount(0)
  const box = (await photos(page).first().boundingBox())!
  expect(Math.round(box.width)).toBe(130)
  expect(Math.round(box.height)).toBe(130)
})

test('a photo opens at a larger size and closes again', async ({ page }) => {
  await page.goto('/photos')
  await photos(page).first().click()
  await expect(page.getByTestId('photo-large')).toHaveCount(0) // a single click does nothing on desktop
  await photos(page).first().dblclick()
  const large = page.getByTestId('photo-large')
  await expect(large).toBeVisible()
  await expect(large.getByTestId('photo-caption')).not.toBeEmpty()
  const small = (await photos(page).first().boundingBox())!
  const big = (await large.locator('img').boundingBox())!
  expect(big.width).toBeGreaterThan(small.width)
  await large.getByTestId('photo-close').click()
  await expect(large).toHaveCount(0)
})

test('arrow keys step through the open photo in grid order and stop at the ends', async ({ page }) => {
  await page.goto('/photos')
  await expect(page.locator('[data-window="photos"] [data-year]')).toHaveCount(4)
  const captions = await photos(page).evaluateAll(els => els.map(e => e.getAttribute('aria-label')))
  const caption = page.getByTestId('photo-large').getByTestId('photo-caption')
  await photos(page).first().dblclick()
  await expect(caption).toHaveText(captions[0]!)
  await page.keyboard.press('ArrowLeft') // already the first
  await expect(caption).toHaveText(captions[0]!)
  await page.keyboard.press('ArrowRight')
  await expect(caption).toHaveText(captions[1]!)
  await page.keyboard.press('ArrowLeft')
  await expect(caption).toHaveText(captions[0]!)

  await page.getByTestId('photo-close').click()
  await photos(page).last().dblclick()
  await expect(caption).toHaveText(captions.at(-1)!)
  await page.keyboard.press('ArrowRight') // already the last
  await expect(caption).toHaveText(captions.at(-1)!)
})
