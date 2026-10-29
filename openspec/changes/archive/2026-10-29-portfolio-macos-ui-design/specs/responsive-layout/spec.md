# Spec Delta

## Purpose

Defines how the OS-style portfolio adapts from desktop to mobile, using the Tailwind CSS default breakpoints for each screen size.

## ADDED Requirements

### Requirement: Tailwind breakpoints
The design SHALL provide a layout for each Tailwind default breakpoint: base (below 640px), sm (640px), md (768px), lg (1024px), xl (1280px) and 2xl (1536px).

#### Scenario: Layout per breakpoint
- **WHEN** the design file is reviewed
- **THEN** each of the six breakpoints has a board at its minimum width

### Requirement: OS style by screen size
Screens below the md breakpoint SHALL use the iOS style, md SHALL use the iPadOS style, and lg and above SHALL use the macOS style.

#### Scenario: Mobile screen
- **WHEN** the viewport is narrower than 768px
- **THEN** the home screen uses an iOS-style app grid, status bar and bottom dock instead of the macOS menu bar

#### Scenario: Desktop screen
- **WHEN** the viewport is 1024px or wider
- **THEN** the home screen uses the macOS menu bar, floating dock and free-floating widgets

### Requirement: Same content on every screen
Every app and widget available on desktop SHALL also be available on tablet and mobile.

#### Scenario: Feature parity
- **WHEN** a visitor opens the portfolio on a mobile screen
- **THEN** Photos, Contact, Notes, Finder, Music and VS Code can be opened and the clock, photo carousel, calendar and music widgets are reachable

### Requirement: Touch-friendly targets
On screens below the lg breakpoint, interactive elements SHALL have a touch target of at least 44 by 44 pixels.

#### Scenario: Tap target size
- **WHEN** the mobile design is reviewed
- **THEN** every app icon and control measures at least 44 by 44 pixels
