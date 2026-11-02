## Context

See proposal.md for motivation. Today `createAudioStore` wraps one `<audio>` element created in `app/plugins/audio.client.ts`; `MusicApp` and `MusicWidget` read its state through `useAudio()` and `useSongs()` reads the `songs` content collection. Songs are `content/songs/*.yml` validated by `makeSchemas` in `shared/content-schemas.ts`. The site is statically generated, so data must exist at build time. `MusicApp` is only mounted while its window is open, but playback must survive closing it; that is why the audio element lives in a plugin.

YouTube's terms require a visible, unmodified player (200x200 px minimum, no overlays) and forbid audio-only or background players. The design must keep the existing "playback continues when Music closes" behavior without breaking that rule.

## Goals / Non-Goals

**Goals:**
- Show the owner's YouTube playlist in the existing Music app and widget with the same play, pause, previous, next and progress controls.
- Keep the API key out of the client and need no runtime API calls.
- Keep local-file songs working.

**Non-Goals:**
- Unofficial APIs, runtime fetching, private playlists, OAuth.
- Audio-only or hidden playback.
- Genre detection for imported tracks.

## Decisions

**1. Prebuild script writes YAML, not a runtime or Nuxt-hook fetch.** A Node script (`scripts/import-youtube-playlist.mjs`) calls `playlistItems.list` (paged, 50 per call) then `videos.list` for durations, and writes `content/songs/NN-<slug>.yml`. This fits the existing content pipeline, keeps the key in the build environment, and lets the owner review and hand-edit entries (for example add a `genre`). Alternative: `useAsyncData` during prerender; rejected because it bypasses the content collection and its validation. The script runs via `npm run import:playlist` and is not wired into `build`, so a missing key never breaks a deploy; the generated files are committed. Re-runs overwrite only files carrying a `youtubeId`, so local songs and manual genre edits on non-generated entries are untouched; a re-run preserves an existing `genre` for the same `youtubeId`. Ordering uses the playlist position.

**2. Song schema: `audio` becomes optional, `youtubeId` added, one-of enforced.** `youtubeId` is an 11-character video id. A refinement requires exactly one of `audio` and `youtubeId`. `cover` is filled with the YouTube thumbnail URL. The `Song` type gains `youtubeId?` and `audio?`. Because the schema factory is shared with unit tests, the refinement is written against the passed-in `z` and tested there.

**3. Source adapters behind the store.** `createAudioStore` is changed to take two players that share one small interface (load, play, pause, seek, and events for play, pause, ended, time, duration, error): the existing HTML audio one and a new YouTube one. The store picks the player by song, pauses the other, and keeps the public API (`state`, `play`, `pause`, `toggle`, `isPlaying`) so `MusicWidget` and most of `MusicApp` need no logic change. Alternative: a separate YouTube store and merge state in components; rejected because it duplicates "only one song plays" logic.

**4. YouTube player composable, client-only and lazy.** `useYouTubePlayer` loads `https://www.youtube.com/iframe_api` once, on first YouTube play, never during SSR. It creates the `YT.Player` into a host element that the Music app provides, and maps player states and `onError` to the adapter events. Autoplay rules are met because the first `playVideo()` runs inside the visitor's click.

**5. Player visibility vs. playback surviving window close.** The player lives in a mounted host inside the Music window at no less than 200x200 px (for example a 356x200 box at 16:9, since 320x180 would fall under the minimum). When the Music window closes, YouTube playback pauses and the widget shows the paused state; resuming reopens or prompts the visitor to open Music. Keeping a hidden or off-screen player alive would break the terms. Local songs keep their current continue-after-close behavior. Alternative considered: a persistent floating mini player on the desktop; deferred as a follow-up because it needs window-manager changes.

**6. Error handling.** On `onError` 101, 150 (and 100, video not found) the adapter emits `error`; the store marks that song `unavailable` for the session and advances to the next playable song in list order, wrapping once. If a full pass finds none, it stops and sets an `allUnavailable` flag the Music app renders as a message. The import script also drops items whose `videos.list` `status.embeddable` is false or whose privacy is private, which removes most failures up front.

**7. Referrer policy.** Set `Referrer-Policy: strict-origin-when-cross-origin` through `routeRules` headers in `nuxt.config.ts` and a `<meta name="referrer">` fallback in `app.head`, since a static host may ignore headers. Error 153 is tied to a missing referrer, so both are set.

**8. Metadata.** Title comes from the playlist item; YouTube Music uploads often have the channel as "Artist - Topic", so the script strips the " - Topic" suffix for `artist`. Duration is parsed from the ISO 8601 `contentDetails.duration`.

## Risks / Trade-offs

- Playlist goes stale until the script is re-run and the result committed. Accepted; a scheduled CI run is a possible follow-up.
- YouTube pauses when the Music window closes, which differs from local songs. Accepted to stay inside YouTube's terms; documented in the spec as visible-player-only.
- Mobile browsers need a tap to start and may pause when the tab is backgrounded. Nothing in the design works around it.
- Some tracks are embeddable at build time but later fail by region or takedown; the runtime skip handles it.
- Quota use is about 10 to 12 units per run against 10,000 per day, so negligible.
- The IFrame API is a third-party script; if it fails to load the YouTube songs show as unavailable and local songs still work.
- Policy text and error codes change; re-check Google's pages before shipping.

## Open Questions

- Should there be a persistent mini player after the Music window closes? Out of scope here; needs a window-manager design.
- Should local placeholder songs be removed once the playlist is imported? Left to the owner after the import.
