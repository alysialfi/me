# home-screen Specification

## Purpose
Defines the OS-style home screen visitors land on: the shell chrome, the widgets, and the app launcher, styled after macOS on desktop and iOS/iPadOS on smaller screens.

## Requirements

### Requirement: Desktop shell chrome
On desktop the home screen SHALL show a macOS-style menu bar at the top, a wallpaper background, and a dock of app icons at the bottom.

#### Scenario: Desktop landing
- **WHEN** a visitor opens the portfolio on a desktop-size screen
- **THEN** the menu bar, wallpaper, widgets and dock are visible without scrolling

#### Scenario: Menu bar date
- **WHEN** the desktop menu bar is shown
- **THEN** the current date (day, month, date, for example "Sun, Jun 9") appears at the right end of the menu bar, after the battery icon and percentage

#### Scenario: Dock size
- **WHEN** the desktop dock is reviewed
- **THEN** its app icons are 44px rounded squares (corner radius 10) inside a dock with an 18px corner radius, 12px padding horizontally, 8px vertically and 12px between icons, and neither icons nor dock are circular or pill-shaped

### Requirement: App launcher
The home screen SHALL expose the apps Photos, Contact, Notes, Finder, Music and VS Code as icons the visitor can open.

#### Scenario: Open an app from the launcher
- **WHEN** a visitor activates an app icon
- **THEN** that app opens (see portfolio-apps)

### Requirement: Clock widget
The home screen SHALL include a clock widget showing the visitor's current time of day in hh:mm format as plain text only, set in the Oxanium typeface at weight 600, with no card, background, glass effect, padding or date line.

#### Scenario: Time display
- **WHEN** the home screen is visible
- **THEN** the clock widget shows the current time as hh:mm and updates as the time changes

#### Scenario: Clock fills its columns
- **WHEN** the desktop home screen is reviewed
- **THEN** the clock text is scaled to span the full width of its 2 grid columns, aligned to the left column edge

### Requirement: Photo carousel widget
The home screen SHALL include a photo carousel widget whose images are taken from the Photos app.

#### Scenario: Carousel content
- **WHEN** the owner adds an image to Photos
- **THEN** that image appears in the photo carousel widget

#### Scenario: Open Photos from the carousel
- **WHEN** a visitor activates the carousel widget
- **THEN** the Photos app opens

### Requirement: Calendar widget
The home screen SHALL include a calendar widget in the style of an agenda list that shows the owner's education and work history grouped per year, one colored row per entry.

#### Scenario: History grouped by year
- **WHEN** a visitor views the calendar widget
- **THEN** each year with an education or work entry is shown as a section header with its entries listed under it

#### Scenario: Entry row content
- **WHEN** an entry is shown
- **THEN** its row shows an accent bar, the title, and the period (for example "2022 – 2023") aligned to the right, with row and accent colors distinguishing entries

#### Scenario: Expand an entry
- **WHEN** a visitor activates an entry row
- **THEN** the row expands in place into an expanded entry that keeps the header (accent bar, title, period) and adds a chevron, a description paragraph and a bulleted list of details about that experience, and activating it again collapses it

#### Scenario: Expanded entry component
- **WHEN** the design file is reviewed
- **THEN** a reusable "Widget / Calendar Entry Expanded" component exists with the header, description and detail list, using the same colors as the collapsed row

#### Scenario: Calendar padding
- **WHEN** the calendar or notes widget is reviewed
- **THEN** its content sits 24px inside the card on every side

### Requirement: Notes widget
The home screen SHALL include a notes widget that shows a header with the Notes icon, the title and the number of notes, followed by a list of the owner's writings, each with its title and a date line.

#### Scenario: Notes list
- **WHEN** a visitor views the notes widget
- **THEN** the writings loaded by the Notes app are listed with a title and a date, separated by dividers

#### Scenario: Open Notes from the widget
- **WHEN** a visitor activates the notes widget
- **THEN** the Notes app opens

### Requirement: Music widget
The home screen SHALL include a music widget that plays tracks from the owner's favorite songs and lets the visitor play and pause.

#### Scenario: Play
- **WHEN** a visitor activates play on the paused music widget
- **THEN** the current favorite song plays and the control shows pause

#### Scenario: Pause
- **WHEN** a visitor activates pause on the playing music widget
- **THEN** playback stops and the control shows play

### Requirement: Widget grid sizes
On desktop the home screen SHALL use a 12-column grid, and each widget SHALL span a fixed number of columns: clock 2, photo carousel 3, notes 3, calendar 4 and music 4.

#### Scenario: Widget widths
- **WHEN** the desktop home screen is reviewed at any desktop breakpoint
- **THEN** each widget's width equals its column span on the 12-column grid and its edges sit on column boundaries

### Requirement: Consistent visual language
Widgets and app icons SHALL share one visual language: rounded cards, a soft pastel teal and cream palette, and consistent spacing, following the reference home screen.

#### Scenario: Widgets look related
- **WHEN** the home screen is reviewed in the design file
- **THEN** every widget uses the same corner radius, palette and spacing tokens

### Requirement: Typography
All interface text, including the menu bar, widgets and app windows, SHALL use the Plus Jakarta Sans typeface, except the clock widget time, which uses Oxanium. Code snippets MAY use a monospace typeface.

#### Scenario: Typeface across screens
- **WHEN** any screen or app is reviewed
- **THEN** its interface text is set in Plus Jakarta Sans, only the clock time uses Oxanium, and only code snippets use a monospace font
