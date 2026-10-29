import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 2,
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
    env: { NUXT_IGNORE_LOCK: '1' },
    timeout: 120_000
  }
})
