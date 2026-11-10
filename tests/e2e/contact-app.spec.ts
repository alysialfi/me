import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('Contact shows the name, email, phone and socials', async ({ page }) => {
  await page.goto('/contact')
  const app = page.getByTestId('contact-app')
  await expect(app.getByTestId('contact-name')).toHaveText('Alysia Alfi')
  await expect(app.locator('[data-contact="email"]')).toContainText('9c.alysialfi@gmail.com')
  await expect(app.locator('[data-contact="phone"]')).toContainText('+62 831 0618 4338')
  await expect(app.locator('[data-contact="social"]')).toHaveCount(3)
  expect(await app.locator('[data-contact="social"] svg').evaluateAll(els => els.map(e => e.getAttribute('data-brand')))).toEqual(['github', 'linkedin', 'medium'])
})

test('email and phone are mailto: and tel: links', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('[data-contact="email"]')).toHaveAttribute('href', 'mailto:9c.alysialfi@gmail.com')
  await expect(page.locator('[data-contact="phone"]')).toHaveAttribute('href', 'tel:+6283106184338')
})

test('socials open in a new tab and the portfolio stays open', async ({ page, context }) => {
  await page.goto('/contact')
  const social = page.locator('[data-contact="social"]').first()
  await expect(social).toHaveAttribute('target', '_blank')
  await expect(social).toHaveAttribute('rel', /noopener/)
  await context.route('https://github.com/**', route => route.fulfill({ body: 'ok' }))
  const [popup] = await Promise.all([context.waitForEvent('page'), social.click()])
  expect(popup.url()).toContain('github.com')
  await expect(page.locator('[data-window="contact"]')).toBeVisible()
})
