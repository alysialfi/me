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
- Window snapping, tiling or Mission Control.
- Remembering window positions or sizes across reloads or in the URL (the owner decided this is not needed).
- Offline/PWA support.

## Decisions

**Nuxt 3+ with TypeScript, static generation (`nuxt generate`)** *(my call)*. The site has no per-request data, so output is static HTML/JS/assets. Alternative: Node SSR. Rejected: it adds a process to run and secure for no benefit.

**Tailwind CSS with design tokens as theme values.** Colors, radii, spacing and font sizes sampled from Penpot go into the Tailwind theme once, and components use only token classes. Breakpoints stay at Tailwind defaults, matching `responsive-layout`.

**Content as files, read through Nuxt Content** *(my call)*. Notes are Markdown, with images, video and links written in Markdown or small embeds. Projects are folders under a content directory with PDFs and images. Photos, songs, contact, snippet and history are small data files (YAML or JSON). A build-time check enforces the failures named in `portfolio-content` (missing About me, unsupported file type). Alternative: hard-coded TypeScript objects. Rejected: the owner would edit code to change content.

**One window manager in a shared composable.** A single store holds the ordered list of open apps (front is focused), what each one shows (note, folder, file, album), each window's position, and the Music playback state. The shell reads the viewport (Tailwind breakpoints) and renders open apps either as draggable desktop windows (lg and above) or shows only the focused app as a full-screen sheet (below lg), except the first-load Notes overlay, which is windowed on every size. Resizing across lg changes only the presentation, so the open apps persist.

**The URL mirrors the store, not the other way round.** One catch-all page (`/[...app]`) renders the home screen for every path. A route parser turns the path into the focused app and its content, and the `with` query into the other open apps. Opening, focusing or closing an app pushes a history entry. Dragging does not touch the URL. Loading a URL builds the store from it, which is how shared links and back/forward work. Alternative: one Nuxt page per app. Rejected: each page change would remount the shell, losing the home screen, the other windows and the playing audio.

**Static output for every route.** `nuxt generate` pre-renders the known paths (`/`, each app, each note, each project and file from the content) as HTML. The server falls back to the home page for any path it doesn't have, and the client then shows the not-found notice for unknown paths. This keeps the site static while supporting direct links.

**Window dragging with pointer events.** The title bar uses pointer events (mouse and pen) with the window clamped so its title bar stays on screen. Drag is disabled below lg. Focus is the window's position in the list: clicking moves it to the front.

**Resize and window controls.** Each window has a state of normal, minimized or full-screen, plus its rectangle. Edges and corners are drag handles using the same pointer events. The minimum size is 320 by 240 pixels and the maximum is the area below the menu bar. The red, yellow and green controls follow macOS: close, minimize to the dock (the window is hidden, its dock icon keeps an indicator), and toggle full screen, which remembers the previous rectangle for restoring. Only normal and full-screen windows count as visible, so only they appear in the URL; minimized apps are not restored on reload.

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

- [Server fallback to the home page is a hosting setting, not code] → Document the rule for common servers in the README and test it with the local static server in task 6.3.
- [Slugs in URLs break if the owner renames a note or project] → Slugs come from file names; renaming is a content change that changes the link, and the not-found notice covers old links.
- [Drag and touch gestures conflict] → Drag is desktop only (lg and above), where pointer input is expected.

## Open Questions

- Final typeface and wallpaper image (deferrable; the design already allows a system-style sans and a placeholder wallpaper).
- Which web server and domain the owner deploys to (deployment is outside the code).
