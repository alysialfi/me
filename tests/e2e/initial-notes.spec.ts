import { expect, test } from '@playwright/test'

for (const [name, width, height, presentation] of [
  ['phone', 390, 844, 'overlay'],
  ['tablet', 768, 1024, 'overlay'],
  ['desktop', 1280, 820, 'window']
] as const) {
  test.describe(`${name} (${width}px)`, () => {
    test.use({ viewport: { width, height } })

    test('Notes is open on first load; Finder is not', async ({ page }) => {
      await page.goto('/')
      const notes = page.locator('[data-window="notes"]')
      await expect(notes).toBeVisible()
      await expect(notes).toHaveAttribute('data-presentation', presentation)
      await expect(page.locator('[data-window="finder"]')).toHaveCount(0)
      // the home screen stays visible around/behind it
      await expect(page.getByTestId('dock')).toBeVisible()
      if (presentation === 'overlay') {
        const box = await notes.boundingBox()
        expect(box!.width).toBeLessThan(width)
        expect(box!.height).toBeLessThan(height)
      }
      expect(new URL(page.url()).pathname).toBe('/')
    })

    test('closing shows the home screen; reopening Notes works', async ({ page }) => {
      await page.goto('/')
      await page.locator('[data-window="notes"] [data-control="close"]').click()
      await expect(page.locator('[data-window="notes"]')).toHaveCount(0)
      await expect(page.getByTestId('dock')).toBeVisible()
      await page.waitForTimeout(300)
      await expect(page.locator('[data-window="notes"]')).toHaveCount(0)

      await page.locator('[data-testid="dock"] [data-app="notes"]').click()
      const notes = page.locator('[data-window="notes"]')
      await expect(notes).toBeVisible()
      await expect(notes).toHaveAttribute('data-presentation', width >= 1024 ? 'window' : 'sheet')
    })
  })
}
