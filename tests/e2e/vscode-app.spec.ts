import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 820 } })

test('VS Code shows the file name and a highlighted, read-only snippet', async ({ page }) => {
  await page.goto('/vscode')
  const app = page.getByTestId('vscode-app')
  await expect(app.getByTestId('vscode-file')).toHaveText('placeholder.ts')
  const code = app.getByTestId('vscode-code')
  await expect(code).toContainText('export function greet')
  // highlighted: tokens carry more than one colour
  const colours = await code.locator('span[style]').evaluateAll(els => [...new Set(els.map(e => getComputedStyle(e).color))])
  expect(colours.length).toBeGreaterThan(2)
  // read-only: nothing editable
  expect(await app.locator('textarea, input, [contenteditable="true"]').count()).toBe(0)
})
