# Spec Delta

## ADDED Requirements

### Requirement: PDF viewer
The PDF viewer SHALL display a project PDF with its file name and let the visitor scroll through its pages and close it.

#### Scenario: View a PDF
- **WHEN** a PDF is opened from Finder
- **THEN** the PDF viewer shows its pages and file name, and closing it returns to Finder

### Requirement: Image viewer
The image viewer SHALL display a project image at a larger size with its file name and let the visitor close it.

#### Scenario: View an image
- **WHEN** an image is opened from Finder
- **THEN** the image viewer shows the image and file name, and closing it returns to Finder

### Requirement: Notes links
A link inside a note SHALL either open a project in Finder, open another app, or open an external page in a new tab, according to its target.

#### Scenario: Link to a project
- **WHEN** a visitor activates a link in a note whose target is a project
- **THEN** Finder opens inside that project's folder

#### Scenario: External link
- **WHEN** a visitor activates a link in a note whose target is an external URL
- **THEN** the page opens in a new tab and the portfolio stays open

### Requirement: App paths
The focused app SHALL be reflected in the URL path: `/notes/<note>`, `/finder/<project>/<file>`, `/photos/<album>`, `/contact`, `/music` and `/vscode`. The home screen is `/`. Deeper segments are optional.

#### Scenario: Path follows the focused app
- **WHEN** a visitor opens the Finder folder of a project
- **THEN** the URL path becomes `/finder/<project>`

#### Scenario: Open a file
- **WHEN** a visitor opens a file in a project
- **THEN** the URL path becomes `/finder/<project>/<file>`

#### Scenario: Direct link
- **WHEN** a visitor loads a URL such as `/finder/<project>` directly
- **THEN** the home screen is shown with that app focused on that content, and the first-load About me note is not opened

#### Scenario: Unknown path
- **WHEN** a visitor loads a path that names no app, project, file, note or album
- **THEN** the home screen is shown with a not-found notice, and no blank page appears

### Requirement: Other open apps in the query
On desktop, apps that are open but not focused SHALL be listed in the `with` query parameter as comma-separated app names, for example `/finder/<project>?with=notes,music`.

#### Scenario: Several windows open
- **WHEN** Finder is focused and Notes and Music are also open
- **THEN** the URL is `/finder/<project>?with=notes,music`

#### Scenario: Load a shared link
- **WHEN** a visitor loads a URL with a `with` list on a desktop screen
- **THEN** the focused app and each listed app are open, the listed apps showing their default view

#### Scenario: Minimized apps
- **WHEN** an app is minimized
- **THEN** it is not listed in the URL, and it is not open after a reload

#### Scenario: Unknown name in the list
- **WHEN** the `with` list contains a name that is not an app
- **THEN** that name is ignored and the rest open

### Requirement: URL and history
Opening, focusing or closing an app SHALL update the URL and add a history entry, so back and forward move between those states. Moving or resizing a window SHALL NOT change the URL.

#### Scenario: Back button
- **WHEN** a visitor opens Finder and then presses back
- **THEN** the previous app state is shown

#### Scenario: Close the focused window
- **WHEN** a visitor closes the focused window while others are open
- **THEN** the next window in front becomes focused and the URL path follows it

#### Scenario: Close the last window
- **WHEN** a visitor closes the only open window
- **THEN** the URL becomes `/` and the home screen is shown

#### Scenario: Drag does not navigate
- **WHEN** a visitor drags a window
- **THEN** the URL and history stay the same

## MODIFIED Requirements

### Requirement: Photos app
The Photos app SHALL display the owner's personal photos and project screenshots, grouped into a Personal album and a Projects album, plus an All view.

#### Scenario: Browse photos
- **WHEN** a visitor opens Photos
- **THEN** the photos are shown and a visitor can view one at larger size

#### Scenario: Switch album
- **WHEN** a visitor selects the Projects album
- **THEN** only project screenshots are shown

### Requirement: Contact app
The Contact app SHALL display the owner's full name, email, phone number and socials, and each of them SHALL be clickable.

#### Scenario: View contact card
- **WHEN** a visitor opens Contact
- **THEN** the owner's initials in a round avatar, full name, email, phone number and socials are shown, with the details grouped in one rounded card where each row has a small label above its value and rows are separated by dividers

#### Scenario: Email
- **WHEN** a visitor activates the email
- **THEN** the visitor's mail application opens a new message addressed to the owner

#### Scenario: Phone
- **WHEN** a visitor activates the phone number
- **THEN** the visitor's device offers to call that number

#### Scenario: Social
- **WHEN** a visitor activates a social
- **THEN** its profile opens in a new tab and the portfolio stays open

### Requirement: Notes app
The Notes app SHALL list the owner's notes, show the selected note with its text, links, images and video, and open on the "About me" note by default.

#### Scenario: Read a note
- **WHEN** a visitor opens Notes and selects a note
- **THEN** the full content of that note is displayed, including any images and video

#### Scenario: Default note
- **WHEN** Notes opens without a specific note requested
- **THEN** the "About me" note is shown

#### Scenario: Play a video in a note
- **WHEN** a note contains a video and a visitor plays it
- **THEN** the video plays inside the note

### Requirement: Finder app
The Finder app SHALL show one folder icon per project, sorted by project name, and opening a folder SHALL list its files. Opening a PDF file SHALL use the PDF viewer and opening an image file SHALL use the image viewer.

#### Scenario: Project folders
- **WHEN** a visitor opens Finder
- **THEN** one folder icon per project is shown, ordered alphabetically by project name

#### Scenario: Open a project folder
- **WHEN** a visitor double-clicks a project folder
- **THEN** the files inside that project are listed

#### Scenario: Open a PDF project
- **WHEN** a visitor double-clicks a PDF file in a project folder
- **THEN** it opens in the PDF viewer

#### Scenario: Open an image project
- **WHEN** a visitor double-clicks an image file in a project folder
- **THEN** it opens in the image viewer

#### Scenario: Touch screens
- **WHEN** a visitor on a touch screen taps a folder or file
- **THEN** it opens as if double-clicked

#### Scenario: Navigate back
- **WHEN** a visitor is inside a project folder and activates back
- **THEN** the list of project folders is shown again

### Requirement: Music app
The Music app SHALL show the owner's favorite songs and let the visitor play and pause them.

#### Scenario: Play a song
- **WHEN** a visitor selects a song in Music
- **THEN** it plays and the music widget on the home screen reflects the same track and state

#### Scenario: Pause a song
- **WHEN** a visitor pauses the playing song
- **THEN** audio stops and the Music app and the music widget both show the paused state

#### Scenario: Playback continues after closing
- **WHEN** a visitor closes the Music app while a song is playing
- **THEN** the song keeps playing and the music widget shows the playing state

#### Scenario: One song at a time
- **WHEN** a visitor selects a different song while one is playing
- **THEN** the first stops and only the new one plays
