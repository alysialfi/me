import { prerenderRoutes } from '../../shared/content-checks'
import { SITE } from '../../shared/site'

// Every prerendered page; written to sitemap.xml at build time (see modules/content-checks.ts).
export default defineEventHandler((event) => {
  const known = useRuntimeConfig(event).public.knownContent as Parameters<typeof prerenderRoutes>[0]
  const urls = prerenderRoutes(known).map(p => `  <url><loc>${SITE.url}${p}</loc></url>`)
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
})
