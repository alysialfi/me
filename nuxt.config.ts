import tailwindcss from '@tailwindcss/vite'
import { SITE } from './shared/site'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  content: { experimental: { nativeSqlite: true } },
  app: {
    head: {
      title: SITE.title,
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: SITE.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:title', content: SITE.title },
        { property: 'og:description', content: SITE.description },
        { property: 'og:image', content: SITE.url + SITE.image },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }, { rel: 'icon', href: '/favicon.ico', sizes: 'any' }]
    }
  },
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
