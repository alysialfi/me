# portfolio-apps Specification

## Purpose
Defines the apps a visitor can open from the home screen and the portfolio content each one presents.

## Requirements

### Requirement: Photos app
The Photos app SHALL display the images the owner has uploaded.

#### Scenario: Browse photos
- **WHEN** a visitor opens Photos
- **THEN** the uploaded images are shown and a visitor can view one at larger size by double-clicking it, or by tapping it on a touch screen

#### Scenario: Photos grouped by year
- **WHEN** Photos shows the images
- **THEN** they are grouped by year, newest first, as vertically stacked sections each with a year heading above its photo grid, and photos without a year come last under "Other"

#### Scenario: Step through photos with the keyboard
- **WHEN** a photo is open at larger size in the focused Photos window and the visitor presses the right or left arrow key
- **THEN** the next or previous photo in grid order is shown, and nothing changes at the first or last photo

### Requirement: Contact app
The Contact app SHALL display the owner's name, email and phone number.

#### Scenario: View contact card
- **WHEN** a visitor opens Contact
- **THEN** the owner's name, email and phone number are shown

#### Scenario: Social links
- **WHEN** the contact details include socials
- **THEN** each social is listed with its label and an icon (the brand mark for GitHub, LinkedIn and Medium, a plain link icon for any other site) and opens in a new tab

### Requirement: Notes app
The Notes app SHALL list the owner's writings and load the selected writing for reading.

#### Scenario: Read a note
- **WHEN** a visitor opens Notes and selects a writing
- **THEN** the full text of that writing is displayed

#### Scenario: Image gallery in a note
- **WHEN** a note has two or more images next to each other in one paragraph
- **THEN** they are shown as a grid of four square tiles per row

### Requirement: Finder app
The Finder app SHALL list the owner's projects as files, and open a selected project in a case-study viewer or an image viewer according to its file type.

#### Scenario: Open a Markdown case study
- **WHEN** a visitor selects a project file that is Markdown
- **THEN** it opens in the case-study viewer, with its frontmatter in a side column (title, site link, period, Role/Position, Stacks and Repository links, each shown only when given) and its text in a main column; the side column sits above the text when the viewer is narrow

#### Scenario: Open an image project
- **WHEN** a visitor selects a project that is an image
- **THEN** it opens in the image viewer

#### Scenario: Image thumbnails
- **WHEN** a project folder is open
- **THEN** each image file shows a thumbnail of its own picture, and other files show a file icon

#### Scenario: Finder back and close
- **WHEN** a project folder or a file is open in Finder
- **THEN** a back arrow in a 44px touch target at the left of the Finder header returns to the project list or to the folder, with no text beside it

### Requirement: Music app
The Music app SHALL show the owner's favorite songs and let the visitor play and pause them.

#### Scenario: Play a song
- **WHEN** a visitor selects a song in Music
- **THEN** it plays and the music widget on the home screen reflects the same track and state

#### Scenario: Songs differentiated by genre
- **WHEN** the Music app lists songs
- **THEN** each song shows a color-coded genre tag (for example Pop, Lo-fi, Jazz, Rock), and a genre filter row of matching colored chips (with an All chip) sits between the now-playing block and the song list

### Requirement: VS Code app
The VS Code app SHALL show a code snippet from the owner's ongoing project.

#### Scenario: View snippet
- **WHEN** a visitor opens VS Code
- **THEN** an editor-style view shows the snippet with its file name

### Requirement: Closing an app
A visitor SHALL be able to close an open app and return to the home screen.

#### Scenario: Close app
- **WHEN** a visitor closes an open app
- **THEN** the home screen is shown again

#### Scenario: Window control icons
- **WHEN** a desktop app window is shown
- **THEN** its close, minimize and maximize buttons show an icon only while the pointer is over the controls, as in macOS: an x for close, a minus for minimize and fullscreen arrows for maximize

#### Scenario: Back button on touch screens
- **WHEN** an app is open on a tablet or mobile screen
- **THEN** the navigation bar shows only a large back arrow in a 44px touch target at the left, with no text beside it
