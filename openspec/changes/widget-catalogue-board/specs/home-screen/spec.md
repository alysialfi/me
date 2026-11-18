# Spec Delta

## ADDED Requirements

### Requirement: Desktop widget heights
On desktop each widget SHALL have a declared height, either a fixed height or a fixed ratio of its width. The rendered widget and the free-space check during a drag SHALL use that same height, and the widget's content SHALL fit inside it at every desktop width.

#### Scenario: Rendered height matches the declared height
- **WHEN** the desktop home screen is shown at 1024, 1440, 1920 or 2560 px wide
- **THEN** every widget's rendered height equals its declared height for its current width

#### Scenario: Content fits
- **WHEN** the desktop home screen is shown at 1024, 1440, 1920 or 2560 px wide
- **THEN** no widget's content overflows the widget

#### Scenario: Drop check uses the rendered height
- **WHEN** a visitor drags a widget just below another widget
- **THEN** the ghost is marked blocked exactly when the gap to the visible bottom edge of the other widget is smaller than the vertical gap between widgets

## MODIFIED Requirements

### Requirement: Widget grid sizes
On desktop the home screen SHALL use a 12-column grid, and each widget SHALL span a fixed number of columns: clock 2, photo carousel 3, coffee 2, notes 3, calendar 4 and music 4.

#### Scenario: Widget widths
- **WHEN** the desktop home screen is reviewed at any desktop breakpoint
- **THEN** each widget's width equals its column span on the 12-column grid and its edges sit on column boundaries

### Requirement: Movable widgets
Widgets SHALL be movable on the desktop grid by dragging, onto free space only, and the arrangement SHALL NOT be kept between visits.

#### Scenario: Drag onto free space
- **WHEN** a visitor drags a widget
- **THEN** it follows the pointer, a dashed ghost shows the slot it would snap to (red when another widget is in the way), and on release it snaps to whole columns in that slot if the slot is free, or returns to where it was if not

#### Scenario: Short pointer movement is not a drag
- **WHEN** a visitor presses on a widget and moves the pointer less than 6 px before releasing
- **THEN** the widget does not move and the press counts as a normal click

#### Scenario: Drag does not open
- **WHEN** a drag ends over a widget
- **THEN** the click that ends the drag does not activate that widget

#### Scenario: Reset on reload
- **WHEN** a visitor reloads the page after moving widgets
- **THEN** every widget is back at its default place

## REMOVED Requirements

### Requirement: Resizable widgets
**Reason**: Resizing was never wired into the app. Every widget has always been shown at one span, and the small and large layouts were never reachable. Keeping the requirement doubles what the desktop layout has to handle for behaviour that doesn't exist.
**Migration**: None for visitors; the visible layout does not change. The never-shown variants (reduced layouts, music up-next, notes preview, carousel year chip) are removed with it. Bringing resizing back means a new change that reintroduces it on top of the Desktop board.
