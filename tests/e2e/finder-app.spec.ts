import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const finder = (page: Page) => page.locator('[data-window="finder"]')

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 820 } })

  test('folders are listed alphabetically; double-click opens, back returns', async ({ page }) => {
    await page.goto('/finder')
    const folders = finder(page).locator('[data-project]')
    await expect(folders).toHaveCount(6)
    expect(await folders.evaluateAll(els => els.map(e => e.getAttribute('data-project')))).toEqual(['binus-final-exams', 'domainesia-landing-page', 'domainesia-user-dashboard', 'lunash-dashboard', 'tmla-landing-page', 'mentor-and-speaker'])
    await expect(folders.nth(1)).toContainText('DomaiNesia Landing Page')

    await folders.nth(1).click() // single click only selects
    await expect(finder(page).getByTestId('project-files')).toHaveCount(0)
    await folders.nth(1).dblclick()
    const files = finder(page).locator('[data-file]')
    await expect(files).toHaveCount(6)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/domainesia-landing-page')
    // images show their own picture, other files keep an icon
    await expect(finder(page).locator('[data-file="01-homepage.jpg"] [data-testid="file-thumb"]')).toBeVisible()
    await expect(finder(page).locator('[data-file="case-study.md"] [data-testid="file-thumb"]')).toHaveCount(0)

    await finder(page).getByTestId('finder-back').click()
    await expect(finder(page).locator('[data-project]')).toHaveCount(6)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder')
  })

  test('a direct link opens the folder and lists its files', async ({ page }) => {
    await page.goto('/finder/binus-final-exams')
    await expect(finder(page).locator('[data-file]')).toHaveCount(1)
  })
})

test.describe('touch', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('a single tap opens a folder', async ({ page }) => {
    await page.goto('/finder')
    await finder(page).locator('[data-project="domainesia-landing-page"]').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(6)
    await finder(page).getByTestId('finder-back').click()
    await expect(finder(page).locator('[data-project]')).toHaveCount(6)
  })
})

test.describe('viewers', () => {
  test.use({ viewport: { width: 1280, height: 820 } })

  test('a Markdown case study opens with its side column and sections; closing returns to Finder', async ({ page }) => {
    await page.goto('/finder/domainesia-landing-page')
    await finder(page).locator('[data-file="case-study.md"]').dblclick()
    await expect(finder(page).getByTestId('viewer-name')).toHaveText('case-study.md')
    await expect(finder(page).getByTestId('case-study-title')).toHaveText('DomaiNesia Landing Page')
    await expect(finder(page).getByTestId('case-study-side')).toContainText('Vue.js')
    const body = finder(page).getByTestId('case-study-body')
    for (const h of ['Description', 'Impacts', 'Challenge', 'Lessons Learned', 'Screenshots']) {
      await expect(body.getByRole('heading', { name: h })).toBeVisible()
    }
    await expect(body.locator('img')).toHaveCount(4)
    await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/domainesia-landing-page/case-study.md')

    await finder(page).getByTestId('viewer-close').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(6)
  })

  test('an image opens in the image viewer; closing returns to Finder', async ({ page }) => {
    await page.goto('/finder/domainesia-landing-page')
    await finder(page).locator('[data-file="01-homepage.jpg"]').dblclick()
    await expect(finder(page).getByTestId('viewer-name')).toHaveText('01-homepage.jpg')
    const img = finder(page).getByTestId('image-viewer').locator('img')
    await expect(img).toBeVisible()
    expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
    await finder(page).getByTestId('viewer-close').click()
    await expect(finder(page).locator('[data-file]')).toHaveCount(6)
  })

  test('a direct link to a file opens the viewer', async ({ page }) => {
    await page.goto('/finder/domainesia-landing-page/02-domain-search.jpg')
    await expect(finder(page).getByTestId('image-viewer')).toBeVisible()
  })
})
