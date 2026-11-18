# Proposal

## Why

Each desktop widget is defined in seven places across `widgets.ts`, `widget-layout.ts`, `HomeWidget.vue` and `TouchShell.vue`. The drop check also uses a guessed height for content-sized widgets (`AUTO_HEIGHT.music`, the clock ratio), and that guess can drift from the rendered height. Widget resizing is specified and its helpers are unit-tested, but nothing in the app calls them, so every widget is always shown at one size. This area changes more often than any other, and the drag rules can only be tested end-to-end.

## What Changes

- **BREAKING (spec)**: Drop widget resizing. Each widget keeps one fixed column span. Remove the min/max/anchor data, `fitSpan`, `placeWithSpan`, `WidgetSize`, `sizeFor`, the widgets' `size` prop and the small/large layout branches that were never shown: music up-next, notes preview, carousel year chip, and the reduced layouts.
- Introduce the **Widget catalogue**: one entry per widget holding its surface, default place, span and **height rule** (`fixed` px or a `ratio` of its width).
- Introduce the **Desktop board**: a pure TypeScript module, with no Vue or DOM, that owns:
  - the grid measurements, derived from grid width and window height
  - the widget places
  - the drag session: 6px threshold, snapping, a legal drop, commit only when the slot is free, and swallowing the click that ends a drag
  - the per-widget geometry, returned as numbers

  Both drawing and the drop check use the same height.
- `DesktopShell.vue` turns board numbers into CSS and pointer events into board calls.
- `HomeWidget.vue` maps ids to components with an exhaustive record instead of a `v-if` chain.
- `TouchShell.vue` keeps its hand-composed pages but takes ids and surfaces from the catalogue.
- Tests:
  - `widget-layout.test.ts` is replaced by board and catalogue unit tests.
  - `widget-grid.spec.ts` drops the hard-coded widget count, span list and resize-handle check.
  - A new e2e check runs at 1024, 1440, 1920 and 2560 and asserts, for every widget, that the rendered height equals its height rule and the content does not overflow.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `home-screen`:
  - **Removed:** "Resizable widgets".
  - **Changed:** "Widget grid sizes" now includes coffee's span. "Movable widgets" no longer mentions resizing.
  - **Added:** a widget height requirement: desktop widget heights follow their height rule and their content fits at every desktop width.

## Impact

- **Code:**
  - `app/utils/widgets.ts`: becomes the catalogue.
  - `app/utils/widget-layout.ts`: replaced by `app/utils/desktop-board.ts`.
  - Shells and widget host: `app/components/DesktopShell.vue`, `HomeWidget.vue`, `TouchShell.vue`.
  - Widgets: `CalendarWidget.vue`, `NotesWidget.vue`, `MusicWidget.vue`, `PhotoCarouselWidget.vue`.
- **Tests:**
  - `tests/unit/widget-layout.test.ts` is replaced.
  - `tests/e2e/widget-grid.spec.ts` changes.
  - Per-widget e2e specs that assert on size variants may need trimming.
- **Out of scope:**
  - Short desktop screens, where defaults can sit below the drop limit. This behaviour is kept as is.
  - Phone and tablet page composition.
  - Window drag and resize.
- **Dependencies:** none added.
