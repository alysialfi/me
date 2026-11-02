## Purpose

Let the site show and play songs from the owner's YouTube Music playlist, using only the official YouTube APIs and keeping the YouTube player visible as YouTube's terms require.

## ADDED Requirements

### Requirement: Playlist import at build time
The system SHALL turn a public or unlisted YouTube playlist into song content before the site is built, using the official YouTube Data API, and SHALL NOT call that API from a visitor's browser.

#### Scenario: Import the playlist
- **WHEN** the import runs with a valid API key and playlist id
- **THEN** one song entry per playable playlist item is written to the songs content with its title, artist, thumbnail, duration and YouTube video id

#### Scenario: Missing configuration
- **WHEN** the import runs without an API key or playlist id
- **THEN** it stops with a message naming the missing setting and leaves existing song content unchanged

#### Scenario: API failure
- **WHEN** the YouTube API returns an error
- **THEN** the import reports the error and leaves existing song content unchanged

#### Scenario: Key stays private
- **WHEN** the site is built and served
- **THEN** the API key does not appear in any file sent to visitors

### Requirement: Song source
A song SHALL come from either a local audio file or a YouTube video, and the system SHALL reject a song that has neither or both.

#### Scenario: YouTube song
- **WHEN** a song entry has a YouTube video id and no local audio file
- **THEN** it is accepted and listed like any other song

#### Scenario: Invalid song
- **WHEN** a song entry has no source, or both sources
- **THEN** content validation fails with an error naming the song

### Requirement: Visible, unmodified YouTube player
The system SHALL play YouTube songs only through the embedded YouTube player, and the player SHALL be visible to the visitor at least 200x200 px with nothing covering any part of it.

#### Scenario: Play a YouTube song
- **WHEN** a visitor plays a YouTube song
- **THEN** the embedded YouTube player is visible in the Music app and playback starts from that visitor action

#### Scenario: No hidden playback
- **WHEN** a YouTube song is playing
- **THEN** the video is never hidden, shrunk below 200x200 px or overlaid, and audio is never played apart from the video

#### Scenario: No autoplay
- **WHEN** the site loads
- **THEN** no YouTube song starts until the visitor chooses one

### Requirement: Custom controls for YouTube songs
The Music app and the home music widget SHALL control YouTube songs with play, pause, previous, next and progress, using the same controls as local songs.

#### Scenario: Pause and resume
- **WHEN** a visitor pauses a playing YouTube song and presses play
- **THEN** it resumes from the same position

#### Scenario: Shared state
- **WHEN** a YouTube song plays from the Music app
- **THEN** the home music widget shows the same track, play state and progress

#### Scenario: Switch source type
- **WHEN** a visitor starts a local song while a YouTube song plays, or the reverse
- **THEN** the first stops and only one song plays at a time

### Requirement: Unplayable tracks
The system SHALL skip a YouTube track that cannot be played and SHALL keep the rest of the list playable.

#### Scenario: Embedding disabled
- **WHEN** the player reports that a track cannot be embedded or is unavailable
- **THEN** that track is marked unavailable and playback moves to the next playable track

#### Scenario: Every track unplayable
- **WHEN** no track in the list can be played
- **THEN** playback stops and the Music app shows that songs are unavailable

### Requirement: Embed compatibility
The site SHALL send a referrer policy that lets YouTube identify the embedding site.

#### Scenario: Referrer policy
- **WHEN** any page of the site is served
- **THEN** it carries `Referrer-Policy: strict-origin-when-cross-origin`
