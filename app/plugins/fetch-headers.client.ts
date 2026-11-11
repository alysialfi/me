// DomaiNesia's edge answers 403 to any request that sends a `Content-Type` header without a
// body while accepting a compressed response (every browser does). @nuxt/content loads
// `__nuxt_content/*/sql_dump.txt` with exactly such a GET, and also sends headers it meant
// to clear as the literal string "undefined". Strip both before the request goes out.
export default defineNuxtPlugin({
  name: 'fetch-headers',
  enforce: 'pre',
  setup() {
    globalThis.$fetch = globalThis.$fetch.create({
      onRequest({ options }) {
        const headers = options.headers as Headers
        for (const [name, value] of [...headers.entries()]) {
          if (value === 'undefined') headers.delete(name)
        }
        if (options.body == null) headers.delete('content-type')
      }
    })
  }
})
