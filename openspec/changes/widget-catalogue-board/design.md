# Design

## Context

See proposal.md (Why) for the motivation. Today's layout state:

- **Width:** `layout.spans` never changes, so each widget is always one width: clock S, coffee S, all others M.
- **Measurements:** DesktopShell measures `colWidth` from the grid element and `maxBottom` from `window.innerHeight`. It owns `GUTTER = 24`, `WIDGET_AREA_TOP = 60`, `DOCK_RESERVE = 100` and an SSR default width of 1280.
- **Height:** rendering uses `heightFor`, which returns `null` (content decides) for clock and music. The drop check uses `heightOf`, which falls back to `AUTO_HEIGHT` for music and `CLOCK_HEIGHT_PER_WIDTH` for the clock.
- **Drag session:** it lives entirely in `DesktopShell.startDrag`, a closure over window listeners. Only e2e reaches it.
- **Viewport modes:** desktop mode starts at 1024 px wide (`modeForWidth`). Below that, TouchShell's own Tailwind heights apply, so height rules only need to hold for desktop widths from 1024 up.

## Goals / Non-Goals

**Goals:**
- Adding a widget touches three places: its catalogue entry, the component map in HomeWidget, and the widget component.
- The board can be unit-tested with plain numbers. Vitest needs no DOM, Vue or Nuxt to load it.
- The height the drop check uses can't differ from the rendered height.

**Non-Goals:**
- Persisting the arrangement between visits.
- Changing phone/tablet page composition.
- Sharing pointer plumbing with window drag/resize. That is a separate candidate.
- Fixing defaults that sit below `maxBottom` on short screens.

## Decisions

### Catalogue is pure data in `app/utils/widgets.ts`

Each entry holds:
- `id`
- `surface` (the class string formerly in `WIDGET_SURFACE`)
- `span`
- the default `col` and `top`
- `height`: either `{ fixed: px }` or `{ ratio: r }`, where height = round(width × r)

`WidgetId` is derived from the entries (`as const`).

- **Alternative: put the Vue component in the entry.** Rejected: it would pull `.vue` imports into the module the board tests load.
- **Alternative: one catalogue covering touch pages too.** Rejected: the phone pages are a hand-made Penpot composition. Encoding them as data only moves that complexity.

### Height rules: `fixed` for content that doesn't scale, `ratio` for content that does

| Widget | Rule | Value |
|---|---|---|
| calendar | fixed | 337 (today's M value) |
| notes | fixed | 337 (today's M value) |
| music | fixed | 144, measured in the browser at 1440 and 2560 (the old `AUTO_HEIGHT.music.M = 148` was 4px off) |
| photo-carousel | ratio | 1.1 (today's M value) |
| coffee | ratio | 1 |
| clock | ratio | 0.4524 (from the 37.7cqw × 1.2 line-height) |

DesktopShell sets every widget's height explicitly from its rule, so the rendered height never depends on content.

- **Alternative: measure heights from the DOM with a ResizeObserver.** Rejected: the board would need the DOM, and heights would change during the drag.

### Desktop board in `app/utils/desktop-board.ts`, as pure functions over an immutable state

- **Measurements:** `measure(gridWidth, viewportHeight)` returns the grid metrics. The gutter, area-top and dock-reserve constants move here, along with the SSR default.
- **Layout:** `places` is keyed by widget id, and `defaultBoard()` builds it from the catalogue.
- **Geometry:** a function returns `{ col, span, top, height }` per widget. Rendering and the free-space check both call the same function.
- **Drag session:**
  - Board state holds an optional drag with start point, origin, offset, target place and whether the target is free.
  - Transitions: `pressWidget`, `movePointer`, `release`.
  - `release` reports whether the press was a drag. The shell uses that to swallow the following click.
  - The 6 px threshold lives in `movePointer`.
- **Purity:** each transition returns a new state. DesktopShell keeps the state in a `ref` and maps numbers to `gridColumn`, `marginTop`, `height` and `transform`.

**Rejected alternatives:**
- **A class with mutable state.** Harder to assert on, and reactivity wrapping becomes the shell's problem either way.
- **Keeping the session in the component and extracting only snapping.** Rejected: the session rules are where the bugs live.

### Swallowing the click after a drag

The board can't see DOM events. `release` returns `{ state, wasDrag }`. The shell keeps today's capture-phase click handler and a one-tick flag, but sets the flag from `wasDrag`. The rule ("a drag consumes the next click") is decided by the board and tested there. The `setTimeout` reset stays in the shell as wiring.

### HomeWidget uses `Record<WidgetId, Component>`

The component map is typed as `Record<WidgetId, Component>`, so a new catalogue entry without a component fails type-checking. HomeWidget renders `<component :is>`. The `size` prop goes away entirely.

### Remove sizes from the widgets

Remove the `size` prop and every S/L branch from Calendar, Notes, Music and PhotoCarousel. Rule: anything visible at M stays and becomes unconditional; anything shown only at L is deleted.

- **Stay, now unconditional:** calendar periods, music progress bar, notes title and dates, carousel dots.
- **Deleted (L-only):** music up-next, notes preview, carousel year chip, plus the `upNext` and `yearChip` computeds if nothing else uses them.

### Tests

- `tests/unit/desktop-board.test.ts` covers:
  - default board has no overlaps
  - snap and clamp to the grid
  - a drop on an occupied slot keeps the old place
  - moves under 6 px are not a drag
  - `release` after a drag reports `wasDrag`
  - geometry heights follow the catalogue rules at several widths
  - `measure` derives `colWidth` and `maxBottom`
- `tests/unit/widgets.test.ts`: every entry has a valid rule and span, and ids are unique.
- `tests/e2e/widget-grid.spec.ts`:
  - **Removed:** `toHaveCount(6)` (replaced by the catalogue length via the page), the resize-handle check and the up-next absence check.
  - **Kept:** the drag snap and ghost tests.
  - **Added:** a viewport loop over 1024, 1440, 1920 and 2560 asserting that each widget's rendered height equals its rule height (±1 px) and that the widget element's `scrollHeight <= clientHeight`.
  - The overflow check measures the widget element, not its inner content. Calendar and notes scroll internally by design, so their inner `scrollHeight` is always larger. Scrolling stays inside the widget, while content that spills out of a non-scrolling widget still raises the widget's `scrollHeight`. The test waits until every widget has rendered (content loads after the page appears), because an empty widget can't overflow. A mutation check (music at 100 px) makes the test fail.
- `tests/unit/widget-layout.test.ts` is deleted.

## Risks / Trade-offs

- **[Risk] Content no longer decides music's height, so its content may overflow at 1024 or clip at 2560.** Mitigation: the e2e overflow check at four widths. Music content is fixed-size (56 px cover, fixed buttons), so a fixed height is expected to hold.
- **[Risk] The clock ratio is tied to the font metrics of the Oxanium font.** Mitigation: the overflow check catches a font or `cqw` change.
- **[Trade-off] The never-shown L variants (up-next, note preview, year chip) are deleted rather than kept for later.** Bringing them back is a new change, as the spec's REMOVED migration says.
- **[Risk] `scrollHeight` checks can be flaky while images load.** Mitigation: wait for widget images to finish loading (`img.complete`) before measuring.

## Migration Plan

This is a frontend-only refactor with no data migration. It ships as one deploy. Rollback is a revert of the change's commits.
