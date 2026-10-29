# Spec Delta

## ADDED Requirements

### Requirement: Windowed apps on desktop
At the lg breakpoint and above, apps SHALL open as windows above the home screen, each with a title bar and the window controls, and several apps MAY be open at once.

#### Scenario: Open an app on desktop
- **WHEN** a visitor opens an app on a screen 1024px or wider
- **THEN** the app appears as a window and the home screen stays visible around it

#### Scenario: Open a second app
- **WHEN** a visitor opens another app while a window is open
- **THEN** both windows are open and the new one is in front

### Requirement: Draggable and focusable windows
At the lg breakpoint and above, a visitor SHALL be able to drag a window by its title bar and bring any window to the front by clicking it. A window SHALL stay at least partly within the screen.

#### Scenario: Drag a window
- **WHEN** a visitor drags a window by its title bar
- **THEN** the window moves with the pointer and stays where it is dropped

#### Scenario: Keep a window reachable
- **WHEN** a visitor drags a window past the edge of the screen
- **THEN** the title bar stays visible so the window can be dragged back

#### Scenario: Focus a window
- **WHEN** a visitor clicks a window that is behind another
- **THEN** it comes to the front and becomes the focused app

### Requirement: Window controls
At the lg breakpoint and above, each window SHALL show three round controls at the left of its title bar, in the macOS style: red to close, yellow to minimize and green to toggle full screen.

#### Scenario: Close
- **WHEN** a visitor activates the red control
- **THEN** the window closes

#### Scenario: Minimize
- **WHEN** a visitor activates the yellow control
- **THEN** the window is hidden, its dock icon shows it is still open, and the next window in front becomes focused

#### Scenario: Restore a minimized window
- **WHEN** a visitor activates the dock icon of a minimized app
- **THEN** its window is shown again in front and becomes focused

#### Scenario: Full screen
- **WHEN** a visitor activates the green control on a window
- **THEN** the window fills the screen area below the menu bar and the control now restores the window

#### Scenario: Leave full screen
- **WHEN** a visitor activates the green control on a full-screen window
- **THEN** the window returns to the size and position it had before

#### Scenario: Window-control hover
- **WHEN** a visitor hovers over the group of three controls
- **THEN** each shows its symbol (close, minimize, full screen)

### Requirement: Resizable windows
At the lg breakpoint and above, a visitor SHALL be able to resize a window by dragging its edges or corners. A window SHALL be at least 320 by 240 pixels and at most the full screen.

#### Scenario: Resize
- **WHEN** a visitor drags a window corner outward
- **THEN** the window grows with the pointer and its content reflows to fit

#### Scenario: Minimum size
- **WHEN** a visitor drags an edge inward past the minimum size
- **THEN** the window stops at 320 by 240 pixels

#### Scenario: Maximum size
- **WHEN** a visitor drags an edge outward past the screen area
- **THEN** the window stops at the full-screen size

### Requirement: One app at a time on small screens
Below the lg breakpoint, only the focused app SHALL be shown. Windows are neither draggable nor stacked.

#### Scenario: Extra apps on a small screen
- **WHEN** several apps are listed as open and the viewport is narrower than 1024px
- **THEN** only the focused app is shown and the others stay listed as open without being visible

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

#### Scenario: Extra windows return
- **WHEN** a visitor narrows the viewport below lg and widens it again
- **THEN** the windows that were open before are open again
