import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  content: { experimental: { nativeSqlite: true } },
  app: { head: { title: 'Wassup! Alfi here', link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }, { rel: 'icon', href: '/favicon.ico', sizes: 'any' }] } },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  hooks: {
    // Skip idle prefetch of lazy chunks (markdown pipeline, iCal parser): they only matter once an app opens.
    'build:manifest': (manifest) => {
      for (const item of Object.values(manifest)) item.prefetch = false
    }
  }
})
