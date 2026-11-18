import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Nuxt's alias for shared/, so app code under test resolves like in the app.
  resolve: { alias: { '#shared': fileURLToPath(new URL('./shared', import.meta.url)) } },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts']
  }
})
