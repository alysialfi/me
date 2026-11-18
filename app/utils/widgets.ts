// The Widget catalogue: every home-screen widget and what defines it. Surfaces follow the Penpot
// design: none (clock, coffee), glass, light card (#F4F3F3) or white. Desktop places and spans
// follow the Penpot Home / xl board on the 12-column grid.

// How tall a widget is on the desktop: a fixed height, or a ratio of its width.
export type HeightRule = { fixed: number } | { ratio: number }

export interface WidgetEntry {
  id: string
  surface: string
  span: number // desktop columns
  col: number // default first column
  top: number // default top offset in px, from the top of the widget area
  height: HeightRule
}

export const WIDGETS = [
  // The clock text is as wide as the widget (37.7cqw at a 1.2 line height), so its height follows the width.
  { id: 'clock', surface: '', span: 2, col: 1, top: 0, height: { ratio: 0.4524 } },
  { id: 'photo-carousel', surface: 'bg-card shadow-card', span: 3, col: 1, top: 144, height: { ratio: 1.1 } },
  { id: 'coffee', surface: '', span: 2, col: 4, top: 400, height: { ratio: 1 } },
  { id: 'calendar', surface: 'bg-white shadow-card', span: 4, col: 6, top: 0, height: { fixed: 337 } },
  { id: 'notes', surface: 'bg-white shadow-card', span: 3, col: 10, top: 0, height: { fixed: 337 } },
  // Music content is fixed-size (cover, title, progress, controls), so its height does not follow the width.
  { id: 'music', surface: 'glass', span: 4, col: 9, top: 345, height: { fixed: 144 } }
] as const satisfies readonly WidgetEntry[]

export type WidgetId = typeof WIDGETS[number]['id']

export const widget = (id: WidgetId): WidgetEntry => WIDGETS.find(w => w.id === id)!

export const heightAt = (rule: HeightRule, width: number) =>
  'fixed' in rule ? rule.fixed : Math.round(width * rule.ratio)
