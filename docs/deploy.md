# Deploying

The site is built into plain static files. There is no server code to run.

## Build

```sh
npm ci
npx nuxt generate
```

The site is now in `.output/public/`. The build fails, with a message, if the content is invalid (no About me note, or an unsupported file in a project folder).

## Try it locally first

```sh
node scripts/serve-static.mjs 3200      # http://localhost:3200
```

This behaves like the production server should: plain files, range requests for audio and video, and a fallback to the home page for unknown paths.

## Upload

Copy the **contents** of `.output/public/` to your web server's document root (for example with `rsync -av --delete .output/public/ user@server:/var/www/portfolio/`).

## Server settings

Whatever server you use must do three things:

1. **Fall back to the home page.** A path with no matching file (for example `/finder/my-project/spec.pdf`, or a mistyped URL) must return `/200.html` with status **200**. The site then shows the right app, or its "not found" notice.
2. **Serve range requests** for audio and video (`Accept-Ranges: bytes`). nginx and Caddy do this for static files by default.
3. **Serve `.wasm` as `application/wasm`.** The site's content search uses WebAssembly; a wrong type is logged as a console error and slows loading. Current nginx and Caddy already do this.

Also recommended: HTTPS, gzip or brotli compression, and long caching for the `/_nuxt/` folder (its files are named by content hash).

### nginx

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;
  root /var/www/portfolio;

  location /_nuxt/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ /200.html;
  }
}
```

### Caddy

```
example.com {
  root * /var/www/portfolio
  encode gzip zstd
  @assets path /_nuxt/*
  header @assets Cache-Control "public, max-age=31536000, immutable"
  try_files {path} {path}/ /200.html
  file_server
}
```

### Apache (`.htaccess`)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /200.html [L]
AddType application/wasm .wasm
```

## Updating the site

Edit content, run `npx nuxt generate` again, and upload `.output/public/` over the old files.

## Checking a deployment

Open a nested link directly, for example `https://example.com/finder/<your-project>`, and an unknown one such as `https://example.com/nope`: the first shows Finder on that project, the second shows the home screen with a "Page not found" notice. Play a song and open a PDF.
