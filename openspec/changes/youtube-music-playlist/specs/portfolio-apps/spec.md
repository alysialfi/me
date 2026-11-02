## MODIFIED Requirements

### Requirement: Music app
The Music app SHALL show the owner's favorite songs, from local audio files and from the owner's YouTube playlist, and let the visitor play and pause them.

#### Scenario: Play a song
- **WHEN** a visitor selects a song in Music
- **THEN** it plays and the music widget on the home screen reflects the same track and state

#### Scenario: Songs differentiated by genre
- **WHEN** the Music app lists songs
- **THEN** each song shows a color-coded genre tag (for example Pop, Lo-fi, Jazz, Rock), and a genre filter row of matching colored chips (with an All chip) sits between the now-playing block and the song list

#### Scenario: YouTube songs without a genre
- **WHEN** a song imported from YouTube has no genre
- **THEN** it is listed without a genre tag and appears only under the All chip

#### Scenario: Player shown for YouTube songs
- **WHEN** the selected song is a YouTube song
- **THEN** the Music app shows the visible YouTube player with the song's controls
