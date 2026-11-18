// Who the site is about; feeds the meta tags, structured data, sitemap and the prerendered fallback.
export const SITE = {
  url: 'https://alysialfi.com',
  name: 'Alysia Alfi',
  nickname: 'Alfi',
  jobTitle: 'Software Developer',
  location: 'Yogyakarta, Indonesia',
  title: 'Alysia Alfi (Alfi) — Software Developer in Yogyakarta',
  description: 'Alysia Alfi, known as Alfi, is a software developer in Yogyakarta, Indonesia. Frontend with Vue.js and TailwindCSS, full-stack with React, TypeScript and Express. Mentor and PyLadies Yogyakarta co-founder.',
  image: '/og.jpg',
  profiles: [
    { label: 'GitHub', url: 'https://github.com/alysialfi' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/alysialfi' },
    { label: 'Medium', url: 'https://alysialfi.medium.com' }
  ]
} as const
