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
