export type WidgetId = 'clock' | 'photo-carousel' | 'calendar' | 'notes' | 'music'

// Surface of each widget in the Penpot design: none (clock), glass, light card (#F4F3F3) or white.
export const WIDGET_SURFACE: Record<WidgetId, string> = {
  'clock': '',
  'photo-carousel': 'bg-card shadow-card',
  'calendar': 'bg-white shadow-card',
  'notes': 'bg-white shadow-card',
  'music': 'glass'
}
