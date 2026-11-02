## 1. Schema and types

- [ ] 1.1 Make `audio` optional and add `youtubeId` (11-char id) to the `song` schema in `shared/content-schemas.ts`, with a refinement requiring exactly one of them
- [ ] 1.2 Add unit tests in `tests/unit/content-schemas.test.ts` for local song, YouTube song, neither and both
- [ ] 1.3 Update the `Song` type and `useSongs` to carry `youtubeId` and an optional `audio`

## 2. Playlist import script

- [ ] 2.1 Add `scripts/import-youtube-playlist.mjs` that reads `YOUTUBE_API_KEY` and `YOUTUBE_PLAYLIST_ID`, pages `playlistItems.list`, and batches `videos.list` for duration and status
- [ ] 2.2 Map items to song YAML (title, artist with " - Topic" stripped, thumbnail cover, ISO 8601 duration to seconds, `youtubeId`), skipping private and non-embeddable items
- [ ] 2.3 Write `content/songs/NN-<slug>.yml` in playlist order, overwriting only files with a `youtubeId` and keeping an existing `genre` for the same id
- [ ] 2.4 Fail with a clear message, leaving content unchanged, on missing config or an API error
- [ ] 2.5 Put the pure mapping in a testable module and add `tests/unit/youtube-playlist.test.ts`
- [ ] 2.6 Add the `import:playlist` npm script and document the two env vars in `.env.example`

## 3. YouTube playback

- [ ] 3.1 Add a `useYouTubePlayer` composable that loads the IFrame API once, client-only, and maps player states, time, duration and `onError` to events
- [ ] 3.2 Refactor `app/utils/audio-store.ts` to use a shared player interface with an HTML audio adapter and a YouTube adapter, keeping the public API
- [ ] 3.3 Enforce one playing song across both adapters and pause YouTube when its player host unmounts
- [ ] 3.4 Mark songs unavailable on errors 100, 101 and 150, advance to the next playable song, and expose an all-unavailable flag
- [ ] 3.5 Extend `tests/unit/audio-store.test.ts` with a fake YouTube adapter for source switching, skip-on-error and all-unavailable

## 4. UI

- [ ] 4.1 Add the visible YouTube player host (at least 200x200, nothing overlaid) to `MusicApp.vue`, shown when the current song is a YouTube song
- [ ] 4.2 Show unavailable tracks as disabled and the "songs unavailable" message in `MusicApp.vue`
- [ ] 4.3 Check `MusicWidget.vue` shows the same track, state and progress for YouTube songs, and shows paused when the Music window is closed
- [ ] 4.4 Handle imported songs without a genre (no tag, All chip only)

## 5. Embed compatibility

- [ ] 5.1 Add `Referrer-Policy: strict-origin-when-cross-origin` through `routeRules` in `nuxt.config.ts` and a referrer meta fallback in `app.head`

## 6. Verification

- [ ] 6.1 Run `npm run import:playlist` against the owner's playlist and review the generated YAML
- [ ] 6.2 Update `tests/e2e/music-app.spec.ts` for a YouTube song (player visible, controls, widget sync) with the IFrame API stubbed
- [ ] 6.3 Run `npm test`, `npm run test:e2e` and `npm run generate`, and check the built output contains no API key
