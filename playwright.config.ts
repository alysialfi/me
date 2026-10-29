import { defineConfig } from '@playwright/test'

// E2E_STATIC=1 runs the suite against the generated static site (run `npx nuxt generate` first).
const isStatic = !!process.env.E2E_STATIC
const port = isStatic ? 3200 : 3100

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 1,
  workers: 1,
  globalSetup: './tests/e2e/global-setup.ts',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: isStatic ? `node scripts/serve-static.mjs ${port}` : `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    env: { NUXT_IGNORE_LOCK: '1' },
    timeout: 120_000
  }
})
