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

## Content and deployment

- [Editing content](docs/editing-content.md): notes, projects, photos, songs, contact, snippet and history.
- [Deploying](docs/deploy.md): build, server settings (nginx, Caddy, Apache) and checks.

Quick build: `npx nuxt generate` writes the static site to `.output/public`. Try it with `node scripts/serve-static.mjs`. To run the browser tests against that build: `E2E_STATIC=1 npm run test:e2e` (run `npx nuxt generate` first).
