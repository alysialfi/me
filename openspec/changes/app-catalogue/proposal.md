# Proposal

## Why

Each app's address shape (which path segments it takes, how they are checked against the content, how a view turns back into a path) is written down in five places:
- `APP_IDS` and `AppView` in the window manager
- `MAX_SEGMENTS`
- the per-app branches in `parseRoute`
- the per-app branches in `pathFor`
- a hand-written `prerenderRoutes` in `shared/`

On top of that, `KnownContent` and the album list are each defined twice, on both sides of `shared/`. Album URLs (`/photos/personal`, and so on) are parsed, written and pre-rendered, but the Photos app no longer reads them; it groups by year. Adding an app takes about nine touch points.

## What Changes

- Introduce the **App catalogue** in `shared/apps.ts`: plain TypeScript that both the app and the build module can import. Each entry holds id, title, icon and its route segments. A segment has a key, the known-content set it must belong to, and whether it's pre-rendered. Catalogue order is dock order.
- Parsing a path, building a path from a view and the pre-render list are all derived from the catalogue. `MAX_SEGMENTS` and the per-app branches in `parseRoute`/`pathFor` are removed. `KnownContent` is defined once.
- `APP_IDS`, `APPS` and `DOCK_ORDER` come from the catalogue. `AppId` is derived from the entries.
- `AppContent.vue` maps app ids to components with an exhaustive record instead of a `v-if` chain.
- **BREAKING (URLs)**: drop album paths. `/photos/<anything>` is not found, and `/photos/all|personal|projects` are no longer pre-rendered.
- **Unchanged:**
  - `AppView` stays one shared bag of optional keys. The catalogue decides which keys each app uses.
  - The one-line in-app moves in FinderApp and NotesApp stay where they are.
  - Note links still check only the URL shape, not the content.
  - The menu bar keeps its own subset of apps.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `portfolio-apps`: the "App paths" requirement no longer lists `/photos/<album>`, and an unknown path no longer mentions albums.

  "App paths" is currently defined only in the open `portfolio-website-build` change. **This change must be archived after `portfolio-website-build`**, so the requirement exists in the main spec when this delta is applied.

## Impact

- **Code:**
  - New `shared/apps.ts`.
  - `app/utils/routes.ts`, `app/utils/apps.ts` (removed or reduced to re-exports), `app/utils/window-manager.ts` (`APP_IDS`/`AppId`/`AppView` source), `app/utils/url-sync.ts`, `app/plugins/window-manager.ts`.
  - `shared/content-checks.ts` (`KnownContent`, `ALBUM_NAMES`, `prerenderRoutes`).
  - Components: `AppContent.vue`, `Dock.vue`, `TouchShell.vue`, and the title/icon readers (`AppIcon`, `AppSheet`, `AppOverlay`, `DesktopWindow`, `MenuBar`).
- **Tests:**
  - `tests/unit/routes.test.ts`
  - `tests/unit/content-checks.test.ts`
  - new `tests/unit/apps.test.ts`
  - `tests/e2e/not-found.spec.ts`
  - `tests/e2e/static-site.spec.ts`, which also still points at the removed `placeholder-media` note
- **Shared links:** `/photos/<album>` links show the not-found notice instead of Photos.
- **Dependencies:** none added.
