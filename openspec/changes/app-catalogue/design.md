# Design

## Context

See proposal.md (Why) for the motivation. Constraints:

- **Nuxt 4.6** with the `app/` source directory. `shared/` is reachable from app code as `#shared/...`; the build module imports it by relative path. `shared/` must not import Vue or anything from `app/`.
- The build module (`modules/content-checks.ts`) computes `KnownContent` from the content folders. It publishes `KnownContent` as runtime config, which `url-sync` reads, and feeds `prerenderRoutes` to Nitro.
- `AppView` is stored as-is by the window manager and copied into history snapshots (`url-sync`). Its shape doesn't change.
- Callers read `APPS[id].title`/`.icon` in seven components, and `DOCK_ORDER` in two.

## Goals / Non-Goals

**Goals:**
- An app's address shape is declared once. `parseRoute`, `pathFor` and `prerenderRoutes` have no per-app branches.
- `KnownContent` and the app id list each exist once.
- Adding an app touches three places: its catalogue entry, the component map in `AppContent.vue`, and the app component.

**Non-Goals:**
- A separate view type per app.
- Moving in-app navigation into the catalogue.
- Checking note links against the content.
- Changing `with`-query handling or the first-load-Notes rule.

## Decisions

### Catalogue in `shared/apps.ts`, entries as const

Each entry is `{ id, title, icon, segments }`. A segment is `{ key, known, prerender }`:

- **`key`** is the `AppView` field it fills: `note`, `project` or `file`.
- **`known`** returns the allowed names given the known content and the view parsed so far:
  - `note`: `k => k.notes`
  - `project`: `k => Object.keys(k.projects)`
  - `file`: `(k, v) => k.projects[v.project!] ?? []`
- **`prerender`** says whether this depth is pre-rendered:
  - `note`: true
  - `project`: true
  - `file`: false, because a path ending in an extension would be written as a file

The file also exports:
- `APP_IDS` (catalogue order, which is dock order) and `AppId`
- `APPS: Record<AppId, entry>`, so `APPS[id].title` callers don't change
- `AppView`
- `KnownContent`

**Alternative: a parse and a path function per app.** Rejected: with only two apps taking segments, a declaration covers every case, and three operations derived from one declaration can't drift apart.

### Three derived operations, in the catalogue module

- **`viewFromSegments(app, segments, known?)`** returns `AppView | null`, where `null` means not found.
  - More segments than the app declares means not found.
  - Each segment must be in its `known` set when `known` content is given. Without it, only the shape is checked, as today.
- **`segmentsFromView(app, view)`** returns the declared keys in order and stops at the first missing one. Keys an app doesn't declare are dropped. So a `file` without a `project` gives `/finder`, as today.
- **`prerenderPaths(known)`** gives:
  - `/` plus every app's root
  - for each segment marked `prerender`, every combination of known names up to that depth

`routes.ts` keeps decoding, `parseWith`, the not-found result, the overlay → `/` rule and `buildRoute`. It calls the first two operations.

`shared/content-checks.ts` keeps `knownContent` (filesystem scan) and implements `prerenderRoutes` as `prerenderPaths`. `ALBUM_NAMES` and its own `KnownContent` go.

### Where things live in `app/`

- **`app/utils/apps.ts`** is deleted. Its importers (`Dock`, `TouchShell`, `AppIcon`, `AppSheet`, `AppOverlay`, `DesktopWindow`, `MenuBar`, `AppContent`) import `APPS`/`APP_IDS` from `#shared/apps`. `DOCK_ORDER` callers use `APP_IDS`.
- **`app/utils/window-manager.ts`** imports `APP_IDS`, `AppId` and `AppView` from `#shared/apps`. It keeps `WindowState`, `Rect`, `AppWindow` and its other types.
  - **Alternative: keep re-exports in `window-manager.ts`.** Rejected: it would leave a second import path for the same names.
- **`AppContent.vue`** gets a `Record<AppId, Component>` rendered with `<component :is>`. The `window` prop goes only to the apps whose component declares it today (Notes, Finder, Photos), listed in a small set next to the map. Contact, Music and VS Code don't declare the prop, so it isn't bound for them. Otherwise it would fall through as a `window` attribute on their root element.

### Dropping albums

- `photos` has no segments, so `/photos/x` is not found.
- `ALBUMS` (routes) and `ALBUM_NAMES` (content-checks) are deleted, and the `album` key leaves `AppView`.
- A history snapshot from before the change may still hold `view.album`. That's harmless: Photos ignores it, and `segmentsFromView` drops undeclared keys.

## Risks / Trade-offs

- **[Risk] Shared links to `/photos/<album>` now show not-found.** Accepted (proposal: BREAKING). The site is a personal portfolio, and Photos is one click away from the notice.
- **[Risk] Dock order changes if catalogue order is picked wrongly.** Mitigation: entries are listed in the current `DOCK_ORDER` (photos, contact, notes, finder, music, vscode), and the existing dock e2e tests cover it.
- **[Risk] A pre-render regression drops a route silently.** Mitigation: `apps.test.ts` asserts the exact derived list for fixture content, and `content-checks.test.ts` keeps its "no file paths" check.
- **[Trade-off] `known` functions receive the partly parsed view, so a segment can depend on an earlier one (file after project).** This is the one place where the declaration holds a function rather than data.

## Migration Plan

This is a frontend and build-time change with no data migration. It ships as one deploy, and rollback is a revert. Archive it after `portfolio-website-build`.
