# Design

## Context

The repo holds only OpenSpec files; there is no application code. The visual design lives in the Penpot file "mac ui" and in the archived change `portfolio-macos-ui-design` (tokens, 12-column desktop grid, widget spans, glass effects, component list). This change builds it. Motivation is in proposal.md and requirements are in the delta specs. Items marked *(my call)* are defaults chosen by the planner, not decisions the owner made.

## Goals / Non-Goals

**Goals:**
- Reproduce the Penpot design faithfully in Nuxt and Tailwind, with tokens taken from the design rather than guessed.
- Keep content editing to files only (see `portfolio-content`).
- Ship as plain static files the owner can serve from their own server.

**Non-Goals:**
- Server-side rendering at request time, a CMS, or an admin UI.
- Multiple windows open at once on desktop beyond what the specs require (no window snapping or Mission Control).
- Offline/PWA support.

## Decisions

**Nuxt 3+ with TypeScript, static generation (`nuxt generate`)** *(my call)*. The site has no per-request data, so output is static HTML/JS/assets. Alternative: Node SSR. Rejected: it adds a process to run and secure for no benefit.

**Tailwind CSS with design tokens as theme values.** Colors, radii, spacing and font sizes sampled from Penpot go into the Tailwind theme once, and components use only token classes. Breakpoints stay at Tailwind defaults, matching `responsive-layout`.

**Content as files, read through Nuxt Content** *(my call)*. Notes are Markdown, with images, video and links written in Markdown or small embeds. Projects are folders under a content directory with PDFs and images. Photos, songs, contact, snippet and history are small data files (YAML or JSON). A build-time check enforces the failures named in `portfolio-content` (missing About me, unsupported file type). Alternative: hard-coded TypeScript objects. Rejected: the owner would edit code to change content.

**One window manager in a shared composable.** A single store holds which app is open, which note or folder or file it shows, and the Music playback state. The shell reads the viewport (Tailwind breakpoints) and renders each open app either as a desktop window (lg and above) or as a full-screen sheet (below lg), except the first-load Notes overlay, which is windowed on every size. Resizing across lg changes only the presentation, so the open app persists. Alternative: route-per-app. Rejected: windows overlay the home screen and the Music state must survive closing an app.

**Music as a single shared audio element** *(my call: self-hosted files)*. One audio instance lives outside any window, so playback continues after the Music window closes and the widget and app stay in sync. Audio files are served from the same server as the site. Alternative: Spotify or YouTube embeds. Rejected for now: embeds need third-party scripts, often restrict autoplay and control, and cannot be kept in sync as simply. Switching later changes only the song source field.

**PDF viewer through pdf.js** *(my call)*. Mobile browsers often show only the first page of an embedded PDF. pdf.js renders every page the same way on all devices. Alternative: native `<iframe>`/`<object>`. Rejected for that inconsistency.

**Home screen layout.** Desktop uses the 12-column grid (clock 2, photo carousel 3, notes 3, calendar 4, music 4) with the dock and menu bar as flex rows. Below lg the shell switches to the iPadOS (md) and iOS (below md) styles from the specs.

**Self-hosting.** `nuxt generate` outputs a static directory the owner serves with their web server. The project ships no server code. HTTPS and caching headers are configured on the owner's server; the exact server (nginx, Caddy, or other) is theirs. Large audio and video files are served as static files with range requests enabled.

**Branching.** All work is on `develop`.

## Risks / Trade-offs

- [Autoplay restrictions: browsers block audio until a user gesture] → Playback starts only from a visitor's play action, never on load.
- [Video and audio files inflate the repo and load time] → Keep media out of the first-load bundle and load it on demand; recommend compressed formats; consider storing big files outside git if the repo grows.
- [Tailwind default breakpoints do not match real device widths] → Test at 390, 768, 1024 and 1280 and also in between.
- [Penpot tokens drift from code] → Take tokens once from the design file during setup and treat the Tailwind theme as the code-side source afterwards.
- [Placeholder content may reach production unnoticed] → Placeholders carry a visible label (see `portfolio-content`).
- [Owner-supplied PDFs or images could be very large] → Use thumbnails or lazy loading in Finder and Photos.

## Open Questions

- Final typeface and wallpaper image (deferrable; the design already allows a system-style sans and a placeholder wallpaper).
- Which web server and domain the owner deploys to (deployment is outside the code).
