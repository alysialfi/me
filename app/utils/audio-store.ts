import { reactive } from 'vue'

export interface Song { id: string, title: string, artist: string, cover?: string, audio: string }

// The slice of HTMLAudioElement the store relies on (lets tests pass a fake).
export interface AudioLike {
  src: string
  currentTime: number
  duration: number
  play(): Promise<void>
  pause(): void
  addEventListener(type: string, listener: () => void): void
}

// One audio element shared by the whole site: playback lives outside any window, so it
// continues when Music closes, and the Music app and the home widget read the same state.
export function createAudioStore(audio: AudioLike) {
  const state = reactive({ current: null as Song | null, playing: false, time: 0, duration: 0 })

  audio.addEventListener('play', () => { state.playing = true })
  audio.addEventListener('pause', () => { state.playing = false })
  audio.addEventListener('ended', () => { state.playing = false; state.time = 0 })
  audio.addEventListener('timeupdate', () => { state.time = audio.currentTime })
  audio.addEventListener('loadedmetadata', () => { state.duration = Number.isFinite(audio.duration) ? audio.duration : 0 })

  // Playback only starts from a visitor's action, never on load.
  async function play(song: Song) {
    if (state.current?.id !== song.id) {
      audio.pause()
      audio.src = song.audio
      audio.currentTime = 0
      state.current = song
      state.time = 0
      state.duration = 0
    }
    try { await audio.play() } catch { state.playing = false }
  }

  function pause() { audio.pause() }

  function toggle(song: Song) {
    if (state.current?.id === song.id && state.playing) pause()
    else return play(song)
  }

  const isPlaying = (song: Song) => state.playing && state.current?.id === song.id

  return { state, play, pause, toggle, isPlaying }
}

export type AudioStore = ReturnType<typeof createAudioStore>
