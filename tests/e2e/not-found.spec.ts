import { expect, test } from '@playwright/test'

for (const [name, width, height] of [['desktop', 1280, 820], ['phone', 390, 844]] as const) {
  test.describe(`${name}`, () => {
    test.use({ viewport: { width, height } })

    test('an unknown path shows the home screen with a not-found notice', async ({ page }) => {
      await page.goto('/nothing-here')
      await expect(page.getByTestId('not-found')).toBeVisible()
      await expect(page.getByTestId('dock')).toBeVisible()
      await expect(page.locator('[data-window]')).toHaveCount(0)
      expect(new URL(page.url()).pathname).toBe('/nothing-here')
    })

    test('unknown note, project, file and album names are not found', async ({ page }) => {
      for (const path of ['/notes/missing', '/finder/missing', '/finder/placeholder-alpha/missing.pdf', '/photos/nope', '/contact/extra']) {
        await page.goto(path)
        await expect(page.getByTestId('not-found'), path).toBeVisible()
      }
    })

    test('known paths show no notice', async ({ page }) => {
      for (const path of ['/notes/about-me', '/finder/placeholder-alpha', '/finder/placeholder-alpha/case-study.pdf', '/photos/personal', '/contact']) {
        await page.goto(path)
        await expect(page.locator('[data-window]')).toHaveCount(1)
        await expect(page.getByTestId('not-found'), path).toHaveCount(0)
      }
    })

    test('the notice clears when an app opens, and Home dismisses it', async ({ page }) => {
      await page.goto('/nothing-here')
      await page.locator('[data-testid="dock"] [data-app="finder"]').click()
      await expect(page.getByTestId('not-found')).toHaveCount(0)
      await page.goto('/nothing-here')
      await page.getByTestId('not-found').getByRole('button', { name: 'Home' }).click()
      await expect(page.getByTestId('not-found')).toHaveCount(0)
      await expect.poll(() => new URL(page.url()).pathname).toBe('/')
    })
  })
}
