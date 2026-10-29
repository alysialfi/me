# Portfolio

A macOS/iOS-style portfolio built with Nuxt and Tailwind CSS. Output is static files you serve from your own server. Planning artifacts live in `openspec/`.

## Requirements

Node 22.5+ (Nuxt Content uses the built-in `node:sqlite`) and npm.

## Develop

```sh
npm install
npm run dev          # http://localhost:3000
```

Design tokens (colors, radii, spacing, font sizes, glass effect) live in `app/assets/css/main.css`, taken from the Penpot file "mac ui". A token reference page is at `/dev/tokens`.

## Test

```sh
npm test             # unit tests (Vitest)
npx playwright install chromium   # once
npm run test:e2e     # browser tests (Playwright; starts the dev server on port 3100)
```

## Build and host

```sh
npx nuxt generate    # writes the static site to .output/public
```

Copy `.output/public` to your web server's document root. Two server settings are required:

- **Fallback to the home page:** any path the server has no file for must return `/200.html` (or `index.html`) with status 200, so direct links like `/finder/project-x` work.
- **Range requests:** enabled for audio and video files (nginx and Caddy do this by default for static files).

nginx example:

```nginx
location / { try_files $uri $uri/ /200.html; }
```

Caddy example:

```
try_files {path} {path}/ /200.html
file_server
```

Preview the output locally with `npx serve .output/public`.
