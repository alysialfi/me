import type { Song } from '~/utils/audio-store'

export async function useSongs() {
  const { data } = await useAsyncData('songs-list', async () => {
    const rows = await queryCollection('songs').select('stem', 'title', 'artist', 'cover', 'audio', 'genre', 'duration').all()
    return rows.map((r): Song => ({ id: r.stem.split('/').pop()!, title: r.title, artist: r.artist, cover: r.cover, audio: r.audio, genre: r.genre, duration: r.duration })).sort((a, b) => a.id.localeCompare(b.id))
  })
  return { songs: computed(() => data.value ?? []) }
}
