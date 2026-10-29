import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

const widget = (page: import('@playwright/test').Page) => page.locator('[data-widget="photo-carousel"]')

test('the carousel shows a photo from Photos with one dot per photo and advances', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await expect(widget(page).getByTestId('carousel-photo')).toBeVisible()
  await expect(widget(page).locator('[data-testid="carousel-dots"] button')).toHaveCount(4)
  const first = await widget(page).getByTestId('carousel-photo').getAttribute('src')
  await page.clock.runFor(4100)
  await expect.poll(() => widget(page).getByTestId('carousel-photo').getAttribute('src')).not.toBe(first)
})

test('a dot selects a photo', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-control="close"]').click()
  await widget(page).locator('[data-testid="carousel-dots"] button').nth(2).click()
  await expect(widget(page).getByTestId('carousel-photo')).toHaveAttribute('src', '/media/photos/alpha.svg')
  await expect(page.locator('[data-window="photos"]')).toHaveCount(0)
})

test('activating the carousel opens Photos', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-control="close"]').click() // it covers the widget
  await widget(page).getByTestId('carousel-open').click()
  await expect(page.locator('[data-window="photos"]')).toBeVisible()
})
