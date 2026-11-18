# Tasks

## 1. Widget catalogue

- [x] 1.1 Rewrite `app/utils/widgets.ts` as the catalogue. Each entry has id, surface, span, default col/top and a height rule (`{ fixed }` or `{ ratio }`), and `WidgetId` is derived from the entries. Use the values in design.md, with music's fixed height measured in the browser at 1440. Verify with `npx vue-tsc --noEmit` (or the project's typecheck) once the callers in groups 2–4 compile.
- [x] 1.2 Add `tests/unit/widgets.test.ts` checking that ids are unique, every span is 1–12 and every height rule is valid. Verify with `npx vitest run tests/unit/widgets.test.ts`.

## 2. Desktop board

- [x] 2.1 Create `app/utils/desktop-board.ts`:
  - `measure(gridWidth, viewportHeight)`, owning gutter, area top, dock reserve and the SSR default
  - `defaultBoard()`
  - per-widget geometry `{ col, span, top, height }` from the catalogue rules
  - the free-space check and snapping, using that same geometry
  - drag transitions `pressWidget`, `movePointer` (6 px threshold), and `release` returning `{ state, wasDrag }`, committing only a free target

  Verify that the module imports nothing from Vue, Nuxt or `.vue` files.
- [x] 2.2 Add `tests/unit/desktop-board.test.ts` covering:
  - `measure`
  - no overlaps in the default board
  - snap and clamp
  - a blocked drop keeps the old place
  - a move under 6 px is not a drag
  - `wasDrag` after a drag
  - heights following the rules at 1024/1440/1920/2560-equivalent grid widths

  Verify with `npx vitest run tests/unit/desktop-board.test.ts`.
- [x] 2.3 Delete `app/utils/widget-layout.ts` and `tests/unit/widget-layout.test.ts`. Verify that `grep -rn widget-layout app tests` finds nothing.

## 3. Shells and widget host

- [x] 3.1 Rewrite DesktopShell's widget section:
  - keep board state in a `ref` and call `measure` on mount and resize
  - send pointer events to `pressWidget`/`movePointer`/`release` and set the click-swallow flag from `wasDrag`
  - map geometry to `gridColumn`/`marginTop`/`height`/`transform`, using the same geometry for the ghost

  Verify that the existing drag tests in `tests/e2e/widget-grid.spec.ts` still pass.
- [x] 3.2 Replace HomeWidget's `v-if` chain with a `Record<WidgetId, Component>` and `<component :is>`, and remove the `size` prop. Verify that the typecheck fails if an entry is removed from the record (check by hand, then restore).
- [x] 3.3 Make TouchShell take ids and surfaces from the catalogue (pages stay hand-composed). Verify that the `widget-carousel`/`TouchShell` e2e specs still pass at phone and tablet widths.

## 4. Remove widget sizes

- [x] 4.1 Remove the `size` prop from Calendar, Notes, Music and PhotoCarousel. Make the M-visible parts unconditional and delete the L-only parts (music up-next, notes preview, carousel year chip, plus their now-unused computeds). Verify that the typecheck passes and that `grep -rn "size === 'L'\|size !== 'S'" app` finds nothing.
- [x] 4.2 Update the e2e specs that assert on the removed variants (`widget-music.spec.ts`, `widget-calendar.spec.ts`, and the up-next check in `widget-grid.spec.ts`). Verify with `npx playwright test tests/e2e/widget-music.spec.ts tests/e2e/widget-calendar.spec.ts`.

## 5. Breakpoint height checks

- [x] 5.1 In `tests/e2e/widget-grid.spec.ts`:
  - remove `toHaveCount(6)`, the span list and the resize-handle check
  - add a loop over 1024, 1440, 1920 and 2560 that waits for widget images to load, then asserts for each widget that its rendered height equals its height rule (±1 px) and its content's `scrollHeight <= clientHeight`

  Verify with `npx playwright test tests/e2e/widget-grid.spec.ts`.
- [x] 5.2 Adjust any height rule the new check exposes (expected candidates: music fixed px, clock ratio) and record the final values in design.md. Verify that 5.1 passes at all four widths.

## 6. Spec and integration

- [x] 6.1 Remove leftover comments that mention resizing (the header comment in the old layout module and in DesktopShell). Verify that `grep -rni "resiz" app/components/DesktopShell.vue app/utils/widgets.ts app/utils/desktop-board.ts` finds only window-resize code.
- [ ] 6.2 Run the full suite: `npx vitest run` and `npx playwright test`. Verify that both pass.
- [x] 6.3 Run `openspec validate widget-catalogue-board --strict` and verify it passes.

## Workflow follow-up

- Archive the change once it's reviewed, so the home-screen spec loses "Resizable widgets" and gains "Desktop widget heights".
