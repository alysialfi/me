# Tasks

## 1. Foundations

- [x] 1.1 Sample the palette, corner radius and spacing from the reference screenshot and create them as tokens in a token set; verify the tokens appear in the file's token catalog
- [x] 1.2 Back up "Portfolio 1" by duplicating it as scratch; verify the original and the copy both exist on Page 1
- [x] 1.3 Create the wallpaper background and menu bar; verify with an exported PNG that both match the pastel teal/cream direction

## 2. Components

- [x] 2.1 Turn the existing Floating Menu icon groups into `App Icon` components for Photos, Contact, Notes, Finder, Music and VS Code; verify each is a library component with its own variant
- [x] 2.2 Build the `Dock` (flex row of App Icons) and verify it keeps its layout when an icon is added or removed
- [x] 2.3 Build `Widget / Clock` showing a placeholder time in hh:mm; verify the exported image shows hh:mm format
- [x] 2.4 Build `Widget / Photo Carousel` with placeholder photos; verify it is bound to the shared card tokens
- [x] 2.5 Build `Widget / Calendar` listing placeholder education and work entries grouped per year; verify each year has its entries under it
- [x] 2.6 Build `Widget / Music` with playing and paused variants; verify both variants exist and the control icon differs
- [x] 2.7 Build `Window` chrome with a close control, plus the iOS `Status Bar`; verify they exist as components
- [x] 2.8 Build `Widget / Notes` (header with icon, title and count, then titled rows with dates and dividers); verify it exists as a component and appears on the lg, xl and 2xl boards
- [x] 2.9 Scale the `Dock` component to 75% and restyle `Widget / Calendar` as an agenda list; verify the dock is 578x97 on every home board and the calendar shows per-year sections with colored rows

## 3. Desktop boards (lg, xl, 2xl)

- [x] 3.1 Create `Home / lg` (1024 wide) with menu bar, wallpaper, widgets and dock from components; verify with an exported PNG that nothing overflows the board
- [x] 3.2 Create `Home / xl` (1280) and `Home / 2xl` (1536) by adapting the lg layout; verify the widget grid uses the extra width and exports cleanly
- [x] 3.3 Retire or resize the old "Portfolio 1" board once 3.1 and 3.2 exist; verify no icon or widget from the old board is lost

## 4. App windows

- [x] 4.1 Design the Photos and Contact windows (images; name, email, phone); verify the contact window shows all three fields
- [x] 4.2 Design the Notes window (list plus reading pane); verify a selected note shows full text
- [x] 4.3 Design the Finder window listing projects, plus a PDF viewer and an image viewer screen; verify both viewer screens exist
- [x] 4.4 Design the Music and VS Code windows (song list with play/pause; editor with file name and snippet); verify the music window reuses the music widget's playing/paused state
- [x] 4.5 Add the close control to every window; verify all six windows have it

## 5. Tablet and mobile boards (base, sm, md)

- [x] 5.1 Create `Home / md` (768, iPadOS style) with the same apps and widgets; verify the icon set matches the lg board
- [x] 5.2 Create `Home / sm` (640) and `Home / base` (390) in iOS style with status bar, app grid and bottom dock; verify each has all six apps and four widgets reachable
- [x] 5.3 Adapt the app windows to full-screen on md, sm and base; verify each has a close control
- [x] 5.4 Check touch targets below lg are at least 44x44; verify with a script that measures each interactive shape

## 6. Final checks

- [x] 6.1 Export every board and compare against the specs; verify there is one board per Tailwind breakpoint and feature parity across them
- [x] 6.2 Check layer naming and layout use across boards; verify no unnamed or "Rectangle"/"Group" layers remain in the new boards

## Workflow follow-up

- Archive the change once the Penpot design is reviewed.
