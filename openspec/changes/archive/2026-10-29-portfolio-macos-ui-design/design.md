# Design

## Context

The Penpot file "mac ui" (Page 1) already has a board "Portfolio 1" (1834x970) containing a flex-row "Floating Menu" dock with six icon groups (Photos, Contact, Notes, Finder, a music icon, VS Code), a "Photo Carousel" rectangle, a "Calendar" board, and a "calendar example" reference image. Nothing else exists yet: no menu bar, wallpaper, clock or music widget, app windows, or tablet/mobile boards. Requirements are in the specs; motivation is in proposal.md.

## Goals / Non-Goals

**Goals:**
- One board per Tailwind breakpoint, each a complete home screen at that breakpoint's minimum width.
- Reusable components (widgets, app icons, window chrome) so every breakpoint stays consistent.
- A structure that maps cleanly to code later: flex/grid layouts, semantic names, design tokens.

**Non-Goals:**
- Pixel-perfect redesign of every state (hover, focus, loading) in this pass; only default and the play/pause state of the music widget.
- Choosing a front-end framework or data source for the content.

## Decisions

**Boards per breakpoint, not per device.** Create boards named `Home / base`, `Home / sm`, `Home / md`, `Home / lg`, `Home / xl`, `Home / 2xl` at widths 390 (representative phone, under 640), 640, 768, 1024, 1280 and 1536. The existing "Portfolio 1" (1834 wide) matches no breakpoint, so it is resized or kept as scratch and replaced by the `Home / xl` and `Home / 2xl` boards. Alternative: one board per OS (macOS, iPadOS, iOS). Rejected because sm to xl would still need distinct layouts and the spec is defined by Tailwind breakpoints.

**Three OS styles driven by width.** base and sm use iOS styling, md uses iPadOS, lg and above use macOS (see responsive-layout spec). xl and 2xl reuse the lg style with more room for widgets. Alternative: macOS style on every width. Rejected because the request is for an iOS look on mobile.

**Components first.** Build components in the local library before composing boards: `App Icon` (variants per app), `Widget / Clock`, `Widget / Photo Carousel`, `Widget / Calendar`, `Widget / Music` (variants: playing, paused), `Widget / Notes`, `Dock`, `Menu Bar`, `Status Bar`, `Window` (title bar with close control). The existing Floating Menu groups become `App Icon` and `Dock`. Alternative: draw each board independently. Rejected because six boards would drift apart.

**Dock at 75% scale.** The `Dock` component uses 75px icons (75% of the original 100px), 18px gaps and 11/19px padding, giving a 578x97 dock. It is defined once in the component, so every board that uses it stays in sync, and widgets get more vertical room.

**12-column grid on desktop boards.** Each home board has a 12-column stretch grid (32px margin, 24px gutter). Widget widths are column spans: clock 2, photo carousel 3, calendar 4, notes 3, music 4. Placement: clock and photo at column 1, calendar at column 6, music at column 9, notes at column 10. Widgets are placed on the grid by hand rather than by flex, so they stay aligned to the guides at every breakpoint.

**Liquid glass for Dock, Clock and Music.** These three use a translucent white fill (28%), 24px background blur, a 1.5px white inner stroke and a soft drop shadow. Do not add an inner shadow: in Penpot it hides the board's children.

**Calendar and Notes widget styling.** The calendar widget follows an agenda-list reference: a white card, a year header per section (the newest in red, older ones grey) and tinted rows with a colored accent bar, title and period. The Notes widget follows a list reference: an orange icon, "Notes" title and count in the header, then titled rows with a date line and thin dividers. Desktop widget groups are: left column (clock, photo carousel), calendar, and a right column (notes, music).

**Layout via flex and grid.** Dock and menu bar use flex rows. The widget area uses a grid whose column count changes per breakpoint (for example 2 columns on base, more on lg and up). Text, icons and cards avoid absolute positioning so spacing comes from layout gaps.

**Tokens for the visual language.** Define color, radius, spacing and font-size tokens in a token set from the reference screenshot (pastel teal and cream palette, large corner radius on cards) and apply them to components. Exact values are sampled from the reference when building, not guessed here. Alternative: hard-coded fills. Rejected because the consistency requirement in the home-screen spec is easier to check and change with tokens.

**App windows designed once at desktop, adapted below.** Each app (Photos, Contact, Notes, Finder, Music, VS Code) gets a macOS window design on lg. On md and below the same content is shown full-screen with a close control, which satisfies the close-app requirement. Finder also needs a PDF viewer and an image viewer screen.

**Placeholder content.** Photos, songs, notes, projects and calendar entries use clearly labelled placeholder content until the owner supplies the real material.

## Risks / Trade-offs

- [Six boards plus app windows is a lot of design work] -> Build components first and compose boards from instances; do lg first, then derive the others.
- [Reference widgets use photos and artwork that may not be reusable] -> Use own or placeholder imagery in the design; the screenshot is a style reference only.
- [Tailwind widths do not match common device sizes, so the mobile board is a representative width] -> Treat the base board as 390 wide and verify it holds down to 320.
- [Existing "Portfolio 1" content could be altered or lost] -> Build new boards beside it and reuse its icons by copying; do not delete it until the new boards exist.

## Open Questions

- Which wallpaper or background image to use (can be chosen at build time).
- Final typeface; the design will use a system-style sans until chosen.
