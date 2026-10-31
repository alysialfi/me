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
  }
})
