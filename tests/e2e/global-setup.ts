import { chromium } from '@playwright/test'

// Load the app once so the dev server finishes dependency optimisation before any test runs.
export default async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(`http://localhost:${process.env.E2E_STATIC ? 3200 : 3100}/`, { waitUntil: 'networkidle', timeout: 60_000 })
      await page.waitForSelector('[data-testid="dock"]', { timeout: 15_000 })
      break
    } catch { /* the dev server reloads once after optimising; try again */ }
  }
  await browser.close()
}
