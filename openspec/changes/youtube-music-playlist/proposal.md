## Why

The Music app only plays local audio files listed in `content/songs`. The owner keeps their real favorites in a YouTube Music playlist and wants the site to show and play that playlist without re-uploading audio. Research found no official YouTube Music API, so the sanctioned route is the YouTube Data API v3 for listing and the IFrame Player API for playback.

## What Changes

- Add a prebuild script that reads a public or unlisted YouTube playlist through the Data API (`playlistItems.list`, `videos.list`) and writes one YAML file per track into `content/songs`. The API key is read from the environment and never ships to the browser.
- Extend the `song` schema with a YouTube source: a track has either a local `audio` file or a `youtubeId`.
- Add a YouTube playback path behind the shared audio store, driven by the IFrame Player API in an SSR-safe composable.
- Show the real YouTube player, visible and unmodified (at least 200x200 px, nothing over it), inside the Music app next to the existing custom controls. No hidden or audio-only playback.
- Skip tracks the player reports as unplayable (errors 101 and 150) and move on to the next track.
- Set `Referrer-Policy: strict-origin-when-cross-origin` so embeds do not fail with error 153.
- Keep local-file songs working; both kinds can coexist in one list.

Out of scope: unofficial libraries (`ytmusicapi` and ports), runtime playlist fetching, OAuth or private playlists, background or audio-only playback, and any change to the genre filter design.

## Capabilities

### New Capabilities
- `youtube-playlist-music`: importing a YouTube playlist at build time into song content, and playing those tracks through a compliant embedded YouTube player with custom controls.

### Modified Capabilities
- `portfolio-apps`: the Music requirement now covers songs that come from a YouTube playlist, and the home music widget stays in sync with them.

## Impact

- Code: `shared/content-schemas.ts`, `app/utils/audio-store.ts`, `app/composables/useSongs.ts`, `app/components/MusicApp.vue`, `app/components/MusicWidget.vue`, `app/plugins/audio.client.ts`, `nuxt.config.ts` (headers), a new `scripts/` prebuild script, a new YouTube player composable, `package.json` scripts, `.env.example`.
- Content: generated `content/songs/*.yml` entries for the playlist.
- Config: new env vars `YOUTUBE_API_KEY` and `YOUTUBE_PLAYLIST_ID` (build time only).
- Dependencies: none required; the IFrame API script is loaded from `https://www.youtube.com/iframe_api` on the client.
- Tests: schema and audio-store unit tests, a playlist-mapping unit test, and Music e2e updates.
