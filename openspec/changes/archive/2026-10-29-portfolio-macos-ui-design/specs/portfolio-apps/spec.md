# Spec Delta

## Purpose

Defines the apps a visitor can open from the home screen and the portfolio content each one presents.

## ADDED Requirements

### Requirement: Photos app
The Photos app SHALL display the images the owner has uploaded.

#### Scenario: Browse photos
- **WHEN** a visitor opens Photos
- **THEN** the uploaded images are shown and a visitor can view one at larger size

### Requirement: Contact app
The Contact app SHALL display the owner's name, email and phone number.

#### Scenario: View contact card
- **WHEN** a visitor opens Contact
- **THEN** the owner's name, email and phone number are shown

### Requirement: Notes app
The Notes app SHALL list the owner's writings and load the selected writing for reading.

#### Scenario: Read a note
- **WHEN** a visitor opens Notes and selects a writing
- **THEN** the full text of that writing is displayed

### Requirement: Finder app
The Finder app SHALL list the owner's projects as files, and open a selected project in a PDF viewer or an image viewer according to its file type.

#### Scenario: Open a PDF project
- **WHEN** a visitor selects a project that is a PDF
- **THEN** it opens in the PDF viewer

#### Scenario: Open an image project
- **WHEN** a visitor selects a project that is an image
- **THEN** it opens in the image viewer

### Requirement: Music app
The Music app SHALL show the owner's favorite songs and let the visitor play and pause them.

#### Scenario: Play a song
- **WHEN** a visitor selects a song in Music
- **THEN** it plays and the music widget on the home screen reflects the same track and state

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
