# Spec Delta

## ADDED Requirements

### Requirement: Notes opens on load
When the home screen first loads, the Notes app SHALL already be open on the "About me" note, above the home screen.

#### Scenario: First visit
- **WHEN** a visitor loads the portfolio
- **THEN** the home screen is visible with the Notes window open on the "About me" note, and Finder is not open

#### Scenario: Initial note and URL
- **WHEN** a visitor loads `/`
- **THEN** the About me note is open and the URL stays `/` until the visitor opens another app

#### Scenario: Close the initial note
- **WHEN** a visitor closes the initial Notes window
- **THEN** the home screen is shown and the Notes window does not reopen until the visitor opens Notes again

#### Scenario: Reopen Notes
- **WHEN** a visitor opens Notes again after closing it
- **THEN** Notes opens on the "About me" note

### Requirement: Dock shows open apps
On desktop the dock SHALL show an indicator under each app that has an open or minimized window.

#### Scenario: Running indicator
- **WHEN** an app has an open or minimized window
- **THEN** its dock icon shows the indicator, and the indicator disappears when the window is closed

#### Scenario: Dock click on an open app
- **WHEN** a visitor activates the dock icon of an app that already has a window
- **THEN** that window is brought to the front, restored if minimized, instead of opening a second one

### Requirement: Menu bar date
The desktop menu bar SHALL show the current date at its right end.

#### Scenario: Menu bar date
- **WHEN** the desktop home screen is visible
- **THEN** the date (for example "Sun, Jun 9") appears after the battery icon and percentage, and the clock widget shows the time only

### Requirement: Pressed app icon
App icons SHALL give visible feedback while pressed.

#### Scenario: Press an app icon
- **WHEN** a visitor presses an app icon in the dock or on the home screen
- **THEN** a dark overlay covers the icon until the press ends

### Requirement: Calendar entry details
A calendar widget entry SHALL expand on activation to show a description and a list of details, and collapse when activated again.

#### Scenario: Expand and collapse
- **WHEN** a visitor activates a calendar entry
- **THEN** its description and bulleted details appear below the header and a chevron is shown, and activating it again hides them

## MODIFIED Requirements

### Requirement: Notes widget
The home screen SHALL include a notes widget that shows a header with the Notes icon, the title and the number of notes, followed by a list of the owner's notes, each with its title and a date line.

#### Scenario: Notes list
- **WHEN** a visitor views the notes widget
- **THEN** the notes loaded by the Notes app are listed with a title and a date, separated by dividers

#### Scenario: Open Notes from the widget
- **WHEN** a visitor activates the notes widget
- **THEN** the Notes app opens

#### Scenario: Open a specific note from the widget
- **WHEN** a visitor activates a note row in the notes widget
- **THEN** the Notes app opens on that note
