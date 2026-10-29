# Spec Delta

## ADDED Requirements

### Requirement: Windowed apps on desktop
At the lg breakpoint and above, apps SHALL open as windows above the home screen, each with a title bar and a close control.

#### Scenario: Open an app on desktop
- **WHEN** a visitor opens an app on a screen 1024px or wider
- **THEN** the app appears as a window and the home screen stays visible around it

### Requirement: Initial Notes window on small screens
Below the lg breakpoint, the Notes window shown on first load SHALL appear as a windowed overlay above the home screen, not full-screen.

#### Scenario: First load on a phone
- **WHEN** a visitor loads the portfolio on a screen narrower than 768px
- **THEN** the iOS-style home screen is visible behind a windowed Notes overlay showing the "About me" note

#### Scenario: First load on a tablet
- **WHEN** a visitor loads the portfolio on a screen from 768px to 1023px wide
- **THEN** the iPadOS-style home screen is visible behind a windowed Notes overlay showing the "About me" note

### Requirement: Full-screen apps on small screens
Below the lg breakpoint, every app opened after the first load SHALL open full-screen with a visible close control.

#### Scenario: Open an app on a phone
- **WHEN** a visitor taps an app icon on a screen narrower than 1024px
- **THEN** the app fills the screen

#### Scenario: Open Notes again on a phone
- **WHEN** a visitor reopens Notes after closing the initial overlay on a screen narrower than 1024px
- **THEN** Notes opens full-screen

#### Scenario: Close a full-screen app
- **WHEN** a visitor closes a full-screen app
- **THEN** the home screen is shown

### Requirement: Layout follows viewport changes
The layout style SHALL follow the viewport width as it changes, without a reload and without losing the open app.

#### Scenario: Resize across a breakpoint
- **WHEN** a visitor resizes the window across the lg breakpoint while an app is open
- **THEN** the OS style and window mode change to match and the same app stays open on the same content
