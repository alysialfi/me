import type { WidgetId } from './widgets'

export type WidgetSize = 'S' | 'M' | 'L'

// Desktop widget layout on the 12-column grid. Sizes come from the Penpot "Widget Sizes" board:
// each widget can be resized between a minimum and a maximum number of columns. A widget
// anchored on the left grows to the right, one anchored on the right grows to the left.
// Widgets can also be dragged, but only onto free space.
export interface WidgetSpec {
  id: WidgetId
  anchor: 'left' | 'right'
  min: number
  max: number
  initial: number
  col: number // default first column
  top: number // default top offset in px, from the top of the widget area
}

export const WIDGET_SPECS: WidgetSpec[] = [
  { id: 'clock', anchor: 'left', min: 2, max: 4, initial: 2, col: 1, top: 0 },
  { id: 'photo-carousel', anchor: 'left', min: 2, max: 6, initial: 3, col: 1, top: 144 },
  { id: 'calendar', anchor: 'left', min: 3, max: 6, initial: 4, col: 6, top: 0 },
  { id: 'notes', anchor: 'right', min: 2, max: 4, initial: 3, col: 10, top: 0 },
  { id: 'music', anchor: 'right', min: 3, max: 6, initial: 4, col: 9, top: 345 }
]

export const COLUMNS = 12
// Free space kept between two widgets stacked on top of each other.
export const VERTICAL_GAP = 8
const TOP_SNAP = 8

export interface Place { col: number, top: number }
export interface Layout { spans: Record<WidgetId, number>, places: Record<WidgetId, Place> }
export interface Metrics { colWidth: number, gutter: number, maxBottom: number }

const spec = (id: WidgetId) => WIDGET_SPECS.find(w => w.id === id)!

export const defaultLayout = (): Layout => ({
  spans: Object.fromEntries(WIDGET_SPECS.map(w => [w.id, w.initial])) as Layout['spans'],
  places: Object.fromEntries(WIDGET_SPECS.map(w => [w.id, { col: w.col, top: w.top }])) as Layout['places']
})

export const sizeFor = (id: WidgetId, span: number): WidgetSize => {
  const s = spec(id)
  return span <= s.min ? 'S' : span >= s.max ? 'L' : 'M'
}

export const widthOf = (span: number, m: Pick<Metrics, 'colWidth' | 'gutter'>) => span * m.colWidth + (span - 1) * m.gutter

// Height of a widget at a size and width; null lets the content decide.
export function heightFor(id: WidgetId, size: WidgetSize, width: number): number | null {
  switch (id) {
    case 'photo-carousel': return Math.round(size === 'S' ? width : size === 'M' ? width * 1.1 : width * 0.64)
    case 'calendar': return { S: 240, M: 314, L: 480 }[size]
    case 'notes': return size === 'L' ? 414 : 337
    default: return null
  }
}

// Space reserved for widgets whose height follows their content.
const AUTO_HEIGHT: Partial<Record<WidgetId, Record<WidgetSize, number>>> = {
  music: { S: 132, M: 148, L: 253 }
}

// The clock text is as wide as the widget (69px text in 183px), so its height follows the width.
const CLOCK_HEIGHT_PER_WIDTH = 0.4524

export const heightOf = (id: WidgetId, size: WidgetSize, width: number): number =>
  id === 'clock' ? Math.round(width * CLOCK_HEIGHT_PER_WIDTH) : heightFor(id, size, width) ?? AUTO_HEIGHT[id]![size]

export function rectOf(id: WidgetId, place: Place, span: number, m: Metrics) {
  const height = heightOf(id, sizeFor(id, span), widthOf(span, m))
  return { left: place.col, right: place.col + span - 1, top: place.top, bottom: place.top + height }
}

// A spot is free when it stays inside the grid and the widget area, and no other widget is in
// the way (same columns, closer than the vertical gap).
export function isFree(id: WidgetId, place: Place, span: number, layout: Layout, m: Metrics): boolean {
  const mine = rectOf(id, place, span, m)
  if (mine.left < 1 || mine.right > COLUMNS || mine.top < 0 || mine.bottom > m.maxBottom) return false
  return !WIDGET_SPECS.some((o) => {
    if (o.id === id) return false
    const r = rectOf(o.id, layout.places[o.id], layout.spans[o.id], m)
    return mine.left <= r.right && r.left <= mine.right && mine.top < r.bottom + VERTICAL_GAP && r.top < mine.bottom + VERTICAL_GAP
  })
}

// Where a widget dropped with its top-left corner at (x, y) px inside the widget area would land.
export function snapDrop(id: WidgetId, x: number, y: number, layout: Layout, m: Metrics): { place: Place, free: boolean } {
  const span = layout.spans[id]
  const col = Math.min(Math.max(Math.round(x / (m.colWidth + m.gutter)) + 1, 1), COLUMNS - span + 1)
  const place = { col, top: Math.max(Math.round(y / TOP_SNAP) * TOP_SNAP, 0) }
  return { place, free: isFree(id, place, span, layout, m) }
}

// The place of a widget resized to `span`: it keeps the edge it is anchored on.
export function placeWithSpan(id: WidgetId, place: Place, fromSpan: number, span: number): Place {
  return spec(id).anchor === 'left' ? place : { ...place, col: place.col + fromSpan - span }
}

// The widest span (up to `want`, down to the minimum) at which a resized widget has free space.
export function fitSpan(id: WidgetId, want: number, start: { place: Place, span: number }, layout: Layout, m: Metrics): number {
  const s = spec(id)
  for (let span = Math.min(want, s.max); span > s.min; span--) {
    if (isFree(id, placeWithSpan(id, start.place, start.span, span), span, layout, m)) return span
  }
  return s.min
}
