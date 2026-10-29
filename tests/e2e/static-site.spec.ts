import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// Runs only against the generated site: E2E_STATIC=1 npx playwright test static-site
test.skip(!process.env.E2E_STATIC, 'needs the static build (npx nuxt generate) and E2E_STATIC=1')
test.use({ viewport: { width: 1280, height: 820 } })

function watchConsole(page: Page) {
  const problems: string[] = []
  page.on('pageerror', e => problems.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`) })
  page.on('requestfailed', r => problems.push(`requestfailed: ${r.url()}`))
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) problems.push(`${r.status()}: ${r.url()}`) })
  return problems
}

test('direct loads of nested paths work with no console errors', async ({ page }) => {
  const problems = watchConsole(page)
  const cases: [string, string][] = [
    ['/', '[data-window="notes"]'],
    ['/notes/about-me', '[data-window="notes"] [data-testid="note-body"]'],
    ['/notes/placeholder-media', '[data-window="notes"] video'],
    ['/finder/placeholder-alpha', '[data-file="case-study.pdf"]'],
    ['/finder/placeholder-alpha/screenshot-1.svg', '[data-testid="image-viewer"] img'], // not pre-rendered: falls back
    ['/photos/projects', '[data-photo]'],
    ['/contact', '[data-contact="email"]'],
    ['/music', '[data-song]'],
    ['/vscode', '[data-testid="vscode-code"]']
  ]
  for (const [path, selector] of cases) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(200)
    await expect(page.locator(selector).first(), path).toBeVisible()
  }
  expect(problems).toEqual([])
})

test('an unknown nested path falls back to the home page with the notice', async ({ page }) => {
  const problems = watchConsole(page)
  const response = await page.goto('/some/deep/unknown/path')
  expect(response?.status()).toBe(200)
  await expect(page.getByTestId('not-found')).toBeVisible()
  await expect(page.getByTestId('dock')).toBeVisible()
  expect(problems.filter(p => !p.startsWith('200'))).toEqual([])
})

test('navigation, back and forward work on the static site', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/')
  await page.locator('[data-testid="dock"] [data-app="finder"]').click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/finder')
  await page.locator('[data-window="finder"] [data-project="placeholder-alpha"]').dblclick()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/finder/placeholder-alpha')
  await page.goBack()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/finder')
  await page.goForward()
  await expect(page.locator('[data-file]').first()).toBeVisible()
  expect(problems).toEqual([])
})

test('audio is served with range requests and plays', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/music')
  const res = await page.request.get('/media/songs/placeholder-song-1.wav', { headers: { Range: 'bytes=0-99' } })
  expect(res.status()).toBe(206)
  expect(res.headers()['content-range']).toMatch(/^bytes 0-99\/\d+$/)
  expect(res.headers()['accept-ranges']).toBe('bytes')
  expect(res.headers()['content-type']).toBe('audio/wav')

  await page.locator('[data-window="music"] [data-song="01-placeholder-song-1"]').click()
  await expect.poll(() => page.locator('[data-testid="shared-audio"]').evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0)
  expect(problems).toEqual([])
})

test('video in a note plays from the static site', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/notes/placeholder-media')
  const video = page.locator('[data-window="notes"] video')
  await video.evaluate(v => (v as HTMLVideoElement).play())
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  expect(problems).toEqual([])
})

test('a PDF from Finder renders every page from the static site', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/finder/placeholder-alpha')
  await page.locator('[data-file="case-study.pdf"]').dblclick()
  await expect(page.locator('canvas[data-page]')).toHaveCount(2)
  const res = await page.request.get('/projects/placeholder-alpha/case-study.pdf')
  expect(res.headers()['content-type']).toBe('application/pdf')
  expect(problems).toEqual([])
})
