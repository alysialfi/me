// Local stand-in for the production server: serves .output/public as plain static files with
// range requests (audio, video) and falls back to the home page for paths it has no file for.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = join(process.cwd(), '.output/public')
const port = Number(process.argv[2] || 3200)

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.wav': 'audio/wav', '.webm': 'video/webm', '.mp4': 'video/mp4',
  '.wasm': 'application/wasm', '.txt': 'text/plain', '.woff2': 'font/woff2', '.yml': 'text/yaml'
}

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const file = join(root, clean)
  if (existsSync(file) && statSync(file).isFile()) return file
  const index = join(file, 'index.html')
  if (existsSync(index)) return index
  return join(root, '200.html') // unknown path: the home page, which shows the not-found notice
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  const file = resolve(pathname)
  const size = statSync(file).size
  const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes' }
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2])
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    if (start > end || start >= size) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end()
      return
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 })
    createReadStream(file, { start, end }).pipe(res)
    return
  }
  res.writeHead(200, { ...headers, 'Content-Length': size })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`Serving .output/public on http://localhost:${port}`))
