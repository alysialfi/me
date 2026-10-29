import { expect, test } from '@playwright/test'

test('browser runner serves the app', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
})
