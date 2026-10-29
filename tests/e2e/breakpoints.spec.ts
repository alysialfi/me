import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const APPS = ['photos', 'contact', 'notes', 'finder', 'music', 'vscode'] as const
// The four design widths plus boundaries and in-betweens.
const WIDTHS: [number, number][] = [[390, 844], [640, 900], [767, 1024], [768, 1024], [900, 800], [1023, 800], [1024, 768], [1280, 820], [1536, 900]]

function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', (m) => {
    // the dev server's own wasm/HMR noise is not an app error
    if (m.type() === 'error' && !/wasm streaming|favicon|\[vite\]/.test(m.text())) errors.push(m.text())
  })
  return errors
}

for (const [width, height] of WIDTHS) {
  const desktop = width >= 1024
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height } })

    test('renders the right home screen with Notes open and no horizontal scroll', async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto('/')
      await expect(page.locator(desktop ? '[data-testid="desktop"]' : '[data-testid="touch-home"]')).toBeVisible()
      await expect(page.locator(desktop ? '[data-testid="touch-home"]' : '[data-testid="desktop"]')).toHaveCount(0)
      await expect(page.locator('[data-window="notes"]')).toHaveAttribute('data-presentation', desktop ? 'window' : 'overlay')
      await expect(page.getByTestId('dock')).toBeVisible()
      await expect(page.getByTestId('note-body').getByRole('heading', { name: 'About me' })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      expect(errors).toEqual([])
    })

    test('every app opens and shows its content', async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto('/')
      await page.locator('[data-window="notes"] [data-control="close"]').click()
      for (const app of APPS) {
        await page.goto(`/${app}`)
        const win = page.locator(`[data-window="${app}"]`)
        await expect(win, app).toBeVisible()
        await expect(win).toHaveAttribute('data-presentation', desktop ? 'window' : 'sheet')
        await expect(win.locator('[data-testid$="-app"]'), app).toBeVisible()
        const box = (await win.boundingBox())!
        expect(box.width, `${app} fits`).toBeLessThanOrEqual(width)
        if (!desktop) expect(box).toMatchObject({ x: 0, y: 0, width, height })
      }
      expect(errors).toEqual([])
    })

    test('every widget is rendered with its content', async ({ page }) => {
      await page.goto('/')
      for (const id of ['clock', 'photo-carousel', 'calendar', 'notes', 'music']) await expect(page.locator(`[data-widget="${id}"]`), id).toBeAttached()
      await expect(page.locator('[data-widget="clock"] [data-testid="clock-time"]')).toBeAttached()
      await expect(page.locator('[data-widget="photo-carousel"] img')).toBeAttached()
      await expect(page.locator('[data-widget="calendar"] [data-year]').first()).toBeAttached()
      await expect(page.locator('[data-widget="notes"] [data-note]').first()).toBeAttached()
      await expect(page.locator('[data-widget="music"] [data-testid="widget-play"]')).toBeAttached()
    })
  })
}

test.describe('touch targets below lg', () => {
  for (const [width, height] of [[390, 844], [768, 1024], [1023, 800]] as const) {
    test(`controls are at least 44px at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/finder')
      await expect(page.getByTestId('finder-app')).toBeVisible()
      const small = await page.locator('button:visible, a:visible').evaluateAll(els => els.map((el) => {
        const r = el.getBoundingClientRect()
        return { label: el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 24) || el.tagName, w: Math.round(r.width), h: Math.round(r.height) }
      }).filter(t => t.w < 44 || t.h < 44))
      expect(small).toEqual([])
    })
  }
})
