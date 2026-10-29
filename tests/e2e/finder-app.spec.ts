import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const finder = (page: Page) => page.locator('[data-window="finder"]')

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 820 } })

  test('folders are listed alphabetically; double-click opens, back returns', async ({ page }) => {
    await page.goto('/finder')
    const folders = finder(page).locator('[data-project]')
    await expect(folders).toHaveCount(2)
    expect(await folders.evaluateAll(els => els.map(e => e.getAttribute('data-project')))).toEqual(['placeholder-alpha', 'placeholder-beta'])
    await expect(folders.first()).toContainText('Placeholder Alpha')

    await folders.first().click() // single click only selects
    await expect(finder(page).getByTestId('project-files')).toHaveCount(0)
    await folders.first().dblclick()
    const files = finder(page).locator('[data-file]')
    await expect(files).toHaveCount(3)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/placeholder-alpha')

    await finder(page).getByTestId('finder-back').click()
    await expect(finder(page).locator('[data-project]')).toHaveCount(2)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder')
  })

  test('a direct link opens the folder and lists its files', async ({ page }) => {
    await page.goto('/finder/placeholder-beta')
    await expect(finder(page).locator('[data-file]')).toHaveCount(1)
  })
})

test.describe('touch', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('a single tap opens a folder', async ({ page }) => {
    await page.goto('/finder')
    await finder(page).locator('[data-project="placeholder-alpha"]').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(3)
    await finder(page).getByTestId('finder-back').click()
    await expect(finder(page).locator('[data-project]')).toHaveCount(2)
  })
})

test.describe('viewers', () => {
  test.use({ viewport: { width: 1280, height: 820 } })

  test('a PDF opens in the PDF viewer with all pages; closing returns to Finder', async ({ page }) => {
    await page.goto('/finder/placeholder-alpha')
    await finder(page).locator('[data-file="case-study.pdf"]').dblclick()
    await expect(finder(page).getByTestId('viewer-name')).toHaveText('case-study.pdf')
    await expect(finder(page).locator('canvas[data-page]')).toHaveCount(2)
    // pdf.js drew something on the canvas
    await expect.poll(() => finder(page).locator('canvas[data-page="1"]').evaluate((c: HTMLCanvasElement) => {
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
      return d.some((v, i) => i % 4 === 0 && v < 128)
    })).toBe(true)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/placeholder-alpha/case-study.pdf')

    await finder(page).getByTestId('viewer-close').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(3)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/placeholder-alpha')
  })

  test('an image opens in the image viewer; closing returns to Finder', async ({ page }) => {
    await page.goto('/finder/placeholder-alpha')
    await finder(page).locator('[data-file="screenshot-1.svg"]').dblclick()
    await expect(finder(page).getByTestId('viewer-name')).toHaveText('screenshot-1.svg')
    const img = finder(page).getByTestId('image-viewer').locator('img')
    await expect(img).toBeVisible()
    expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
    await finder(page).getByTestId('viewer-close').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(3)
  })

  test('a direct link to a file opens the viewer', async ({ page }) => {
    await page.goto('/finder/placeholder-alpha/screenshot-2.svg')
    await expect(finder(page).getByTestId('image-viewer')).toBeVisible()
  })
})
