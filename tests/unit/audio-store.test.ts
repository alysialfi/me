import { describe, expect, test } from 'vitest'
import { createAudioStore, type AudioLike, type Song } from '../../app/utils/audio-store'

class FakeAudio implements AudioLike {
  src = ''
  currentTime = 0
  duration = 100
  paused = true
  plays: string[] = []
  private listeners = new Map<string, (() => void)[]>()
  addEventListener(type: string, fn: () => void) { this.listeners.set(type, [...(this.listeners.get(type) ?? []), fn]) }
  emit(type: string) { this.listeners.get(type)?.forEach(fn => fn()) }
  async play() { this.paused = false; this.plays.push(this.src); this.emit('play') }
  pause() { if (!this.paused) { this.paused = true; this.emit('pause') } }
}

const a: Song = { id: 'a', title: 'A', artist: 'X', audio: '/a.wav' }
const b: Song = { id: 'b', title: 'B', artist: 'X', audio: '/b.wav' }
const make = () => { const audio = new FakeAudio(); return { audio, store: createAudioStore(audio) } }

describe('audio store', () => {
  test('nothing plays on creation', () => {
    const { audio, store } = make()
    expect(store.state.playing).toBe(false)
    expect(audio.plays).toEqual([])
  })

  test('play starts the song and records it as current', async () => {
    const { audio, store } = make()
    await store.play(a)
    expect(store.state.current).toEqual(a)
    expect(store.state.playing).toBe(true)
    expect(audio.src).toBe('/a.wav')
  })

  test('pause stops playback and keeps the current song', async () => {
    const { store } = make()
    await store.play(a)
    store.pause()
    expect(store.state.playing).toBe(false)
    expect(store.state.current?.id).toBe('a')
  })

  test('toggle pauses the playing song and resumes it without restarting', async () => {
    const { audio, store } = make()
    await store.toggle(a)
    audio.currentTime = 42
    await store.toggle(a)
    expect(store.state.playing).toBe(false)
    await store.toggle(a)
    expect(store.state.playing).toBe(true)
    expect(audio.currentTime).toBe(42)
  })

  test('only one song plays at a time: a new song replaces the old', async () => {
    const { audio, store } = make()
    await store.play(a)
    await store.play(b)
    expect(audio.src).toBe('/b.wav')
    expect(store.state.current?.id).toBe('b')
    expect(store.isPlaying(a)).toBe(false)
    expect(store.isPlaying(b)).toBe(true)
  })

  test('a song that ends is no longer playing', async () => {
    const { audio, store } = make()
    await store.play(a)
    audio.emit('ended')
    expect(store.state.playing).toBe(false)
  })

  test('time and duration follow the audio element', async () => {
    const { audio, store } = make()
    await store.play(a)
    audio.emit('loadedmetadata')
    audio.currentTime = 7
    audio.emit('timeupdate')
    expect(store.state).toMatchObject({ time: 7, duration: 100 })
  })
})
