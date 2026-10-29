import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

async function expectTargetsAtLeast44(page: Page) {
  const small = await page.locator('button:visible, a:visible, [role="button"]:visible').evaluateAll(els =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return { label: el.getAttribute('aria-label') || el.textContent?.trim() || el.tagName, w: Math.round(r.width), h: Math.round(r.height) }
    }).filter(t => t.w < 44 || t.h < 44))
  expect(small).toEqual([])
}

test('every icon and control is at least 44x44 on the phone home screen and overlay', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-presentation="overlay"]')).toBeVisible()
  await expectTargetsAtLeast44(page)
})

test('every control is at least 44x44 in a full-screen sheet and the home screen', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-window="notes"] [data-control="close"]').click()
  await expectTargetsAtLeast44(page)
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect(page.locator('[data-presentation="sheet"]')).toBeVisible()
  await expectTargetsAtLeast44(page)
})
