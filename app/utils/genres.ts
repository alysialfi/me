export type Genre = 'pop' | 'lo-fi' | 'jazz' | 'rock'

// Tag colours from the Penpot Music window: tint, dot and text.
export const GENRES: Record<Genre, { label: string, tint: string, ink: string }> = {
  'pop': { label: 'Pop', tint: '#fde4ee', ink: '#b0295f' },
  'lo-fi': { label: 'Lo-fi', tint: '#dff0ee', ink: '#2d7a72' },
  'jazz': { label: 'Jazz', tint: '#fdf0d5', ink: '#9a6a00' },
  'rock': { label: 'Rock', tint: '#fde3e0', ink: '#b3362b' }
}

export const formatDuration = (seconds?: number) => seconds ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : ''
