# Tasks

## 1. App catalogue

- [x] 1.1 Create `shared/apps.ts`:
  - catalogue entries in dock order (photos, contact, notes, finder, music, vscode) with title, icon and segments
  - `APP_IDS`, `AppId`, `APPS`, `AppView` (no `album`) and `KnownContent`
  - `viewFromSegments`, `segmentsFromView` and `prerenderPaths`

  Verify that the module imports nothing from `vue` or `app/`.
- [x] 1.2 Add `tests/unit/apps.test.ts` covering:
  - a path → view → path round trip per app over fixture known content
  - too many segments and unknown names give `null`, and without known content only the shape is checked
  - undeclared keys are dropped and stop at the first missing key (`{ file }` alone gives no Finder segments)
  - `prerenderPaths` returns the exact list for the fixture: roots, every note, every project, no files, nothing under `/photos`

  Verify with `npx vitest run tests/unit/apps.test.ts`.

## 2. Routing and build on the catalogue

- [x] 2.1 Rewrite `app/utils/routes.ts` to use `viewFromSegments`/`segmentsFromView`. Remove `MAX_SEGMENTS`, `ALBUMS`, the per-app branches and its own `KnownContent`. Update `tests/unit/routes.test.ts`: `/photos/personal` moves to the not-found cases. Verify with `npx vitest run tests/unit/routes.test.ts`.
- [x] 2.2 In `shared/content-checks.ts`, remove `KnownContent` and `ALBUM_NAMES`, import `KnownContent` from `./apps`, and make `prerenderRoutes` return `prerenderPaths(known)`. Update `tests/unit/content-checks.test.ts` (no `/photos/personal`, still no file paths). Verify with `npx vitest run tests/unit/content-checks.test.ts`.
- [x] 2.3 Point `app/utils/window-manager.ts`, `app/utils/url-sync.ts` and `app/plugins/window-manager.ts` at `#shared/apps` for `APP_IDS`/`AppId`/`AppView`/`KnownContent`. Verify with `npx vitest run tests/unit/window-manager.test.ts` and a typecheck showing no new errors against the 8 existing ones.

## 3. Components

- [x] 3.1 Delete `app/utils/apps.ts`, and import `APPS`/`APP_IDS` from `#shared/apps` in Dock, TouchShell, AppIcon, AppSheet, AppOverlay, DesktopWindow and MenuBar (`DOCK_ORDER` becomes `APP_IDS`). Verify that `grep -rn "utils/apps\|DOCK_ORDER" app tests` finds nothing and the dock e2e tests pass (`npx playwright test tests/e2e/breakpoints.spec.ts`).
- [x] 3.2 Replace AppContent's `v-if` chain with a `Record<AppId, Component>` and `<component :is>`, binding `window` only for Notes, Finder and Photos. Verify that the typecheck fails when an entry is removed (check by hand, then restore), and that no `window` attribute appears on the Contact, Music or VS Code root elements (check in the browser).

## 4. E2E

- [x] 4.1 Update `tests/e2e/not-found.spec.ts`: `/photos/personal` moves from "known paths" to the not-found list, and `/photos` becomes a known path. Verify with `npx playwright test tests/e2e/not-found.spec.ts`.
- [x] 4.2 Update `tests/e2e/static-site.spec.ts`:
  - replace `/photos/projects` with `/photos`
  - replace the removed `/notes/placeholder-media` video row with `/notes/god-i-love-being-young` and an image selector

  Verify with `npx nuxt generate && E2E_STATIC=1 npx playwright test tests/e2e/static-site.spec.ts`.

## 5. Integration

- [x] 5.1 Run `npx vitest run` and `npx playwright test`. Verify there are no failures beyond the known flaky `url-sync`/`touch-targets` tests (re-run those to confirm).
- [x] 5.2 Run `openspec validate app-catalogue --strict` and verify it passes.

## Workflow follow-up

- Archive `portfolio-website-build` first, then this change, so "App paths" exists in the main spec before this delta is applied.
