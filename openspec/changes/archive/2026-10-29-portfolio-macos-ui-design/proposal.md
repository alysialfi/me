# Proposal

## Why

A personal portfolio that mimics macOS (desktop) and iOS/iPadOS (tablet/mobile) gives visitors a familiar, memorable way to explore the owner's work. Before any code is written, the UI needs to be designed in Penpot (file "mac ui", Page 1, board "Portfolio 1") so the layout, components, and responsive behavior are agreed on.

## What Changes

- Design a macOS-style desktop home screen in Penpot: menu bar, wallpaper, widgets, and a dock of app icons.
- Design iPadOS/iOS-style variants of the home screen for tablet and mobile, reusing the same widgets and app icons.
- Design app windows that present portfolio content through familiar apps: Finder, Notes, Contact, Photos (dock currently also has a music icon and VS Code).
- Define the visual direction from the reference home screen: soft pastel teal/cream palette, rounded widget cards, photo and text widgets, clock/calendar/music widgets.
- Build the design with flex layouts, semantic names and reusable components so it can be translated to code later.

Out of scope: implementing the website, content writing, backend or hosting.

## Capabilities

### New Capabilities
- `home-screen`: the desktop and mobile/tablet home screen shell (menu bar, wallpaper, widgets, dock/app grid).
- `portfolio-apps`: app windows/screens (Finder, Notes, Contact, Photos, etc.) that present portfolio content.
- `responsive-layout`: how the OS-style UI adapts across desktop, tablet and mobile breakpoints.

### Modified Capabilities

None. The project has no existing specs.

## Impact

- Penpot file "mac ui": Page 1, board "Portfolio 1" (existing Floating Menu dock, Photo Carousel, Calendar boards) and new boards for tablet/mobile.
- New OpenSpec specs under `openspec/specs/` once archived.
- No code or dependencies affected yet.
