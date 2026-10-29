import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const photos = (page: import('@playwright/test').Page) => page.locator('[data-window="photos"] [data-photo]')

test('All shows every photo; albums filter by kind', async ({ page }) => {
  await page.goto('/photos')
  await expect(photos(page)).toHaveCount(4)
  await page.locator('[data-window="photos"] [data-album="projects"]').click()
  await expect(photos(page)).toHaveCount(2)
  for (const alt of await photos(page).locator('img').evaluateAll(els => els.map(e => e.getAttribute('alt')))) expect(alt).toMatch(/project screenshot/i)
  await expect.poll(() => new URL(page.url()).pathname).toBe('/photos/projects')
  await page.locator('[data-window="photos"] [data-album="personal"]').click()
  await expect(photos(page)).toHaveCount(2)
  await expect(photos(page).first().locator('img')).toHaveAttribute('alt', /personal photo/i)
})

test('a photo opens at a larger size and closes again', async ({ page }) => {
  await page.goto('/photos/personal')
  await photos(page).first().click()
  const large = page.getByTestId('photo-large')
  await expect(large).toBeVisible()
  await expect(large.getByTestId('photo-caption')).toContainText('Placeholder personal photo 1')
  const small = (await photos(page).first().boundingBox())!
  const big = (await large.locator('img').boundingBox())!
  expect(big.width).toBeGreaterThan(small.width)
  await large.getByTestId('photo-close').click()
  await expect(large).toHaveCount(0)
})

test('a direct link to an album selects it', async ({ page }) => {
  await page.goto('/photos/projects')
  await expect(page.locator('[data-window="photos"] [data-album="projects"]')).toHaveAttribute('aria-current', 'true')
  await expect(photos(page)).toHaveCount(2)
})
