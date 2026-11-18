import { WIDGETS, heightAt, widget, type WidgetId } from './widgets'

// The Desktop board: where each widget sits on the 12-column desktop grid and the rules for
// dragging a widget onto free space. Pure state and numbers; the desktop shell turns them into
// CSS and feeds it pointer positions. The arrangement is not kept between visits.

export const COLUMNS = 12
// Free space kept between two widgets stacked on top of each other.
export const VERTICAL_GAP = 8
export const GUTTER = 24
// The widget area starts below the menu bar and keeps room clear at the bottom for the dock.
export const WIDGET_AREA_TOP = 60
export const DOCK_RESERVE = 100
const TOP_SNAP = 8
// A press only becomes a drag once the pointer has moved this far.
export const DRAG_THRESHOLD = 6

export interface Metrics { colWidth: number, gutter: number, maxBottom: number }
export interface Place { col: number, top: number }
export interface Point { x: number, y: number }
export interface Geometry { col: number, span: number, top: number, height: number }

export interface Drag {
  id: WidgetId
  start: Point // pointer position at the press
  origin: Point // widget's top-left corner inside the widget area at the press
  dx: number
  dy: number
  moving: boolean
  target: Place
  free: boolean
}

export interface Board { places: Record<WidgetId, Place>, drag: Drag | null }

// Grid metrics for a widget area `gridWidth` px wide in a window `viewportHeight` px tall.
export const measure = (gridWidth: number, viewportHeight: number): Metrics => ({
  colWidth: (gridWidth - (COLUMNS - 1) * GUTTER) / COLUMNS,
  gutter: GUTTER,
  maxBottom: viewportHeight - WIDGET_AREA_TOP - DOCK_RESERVE
})

// Used before the page can be measured (server render): a 1280 x 820 window with 32px side margins.
export const DEFAULT_METRICS = measure(1280 - 64, 820)

export const defaultBoard = (): Board => ({
  places: Object.fromEntries(WIDGETS.map(w => [w.id, { col: w.col, top: w.top }])) as Board['places'],
  drag: null
})

export const widthOf = (span: number, m: Metrics) => span * m.colWidth + (span - 1) * m.gutter

// Where a widget sits and how tall it is. Rendering and the free-space check both use this.
export function geometry(id: WidgetId, place: Place, m: Metrics): Geometry {
  const w = widget(id)
  return { col: place.col, span: w.span, top: place.top, height: heightAt(w.height, widthOf(w.span, m)) }
}

// A spot is free when it stays inside the grid and the widget area, and no other widget is in
// the way (same columns, closer than the vertical gap).
export function isFree(id: WidgetId, place: Place, places: Board['places'], m: Metrics): boolean {
  const mine = geometry(id, place, m)
  const right = mine.col + mine.span - 1
  if (mine.col < 1 || right > COLUMNS || mine.top < 0 || mine.top + mine.height > m.maxBottom) return false
  return !WIDGETS.some(({ id: other }) => {
    if (other === id) return false
    const r = geometry(other, places[other], m)
    return mine.col <= r.col + r.span - 1 && r.col <= right
      && mine.top < r.top + r.height + VERTICAL_GAP && r.top < mine.top + mine.height + VERTICAL_GAP
  })
}

// Where a widget with its top-left corner at (x, y) px inside the widget area would snap to.
export function snap(id: WidgetId, at: Point, places: Board['places'], m: Metrics): { place: Place, free: boolean } {
  const span = widget(id).span
  const col = Math.min(Math.max(Math.round(at.x / (m.colWidth + m.gutter)) + 1, 1), COLUMNS - span + 1)
  const place = { col, top: Math.max(Math.round(at.y / TOP_SNAP) * TOP_SNAP, 0) }
  return { place, free: isFree(id, place, places, m) }
}

export const layout = (board: Board, m: Metrics): (Geometry & { id: WidgetId })[] =>
  WIDGETS.map(({ id }) => ({ id, ...geometry(id, board.places[id], m) }))

// The slot a dragged widget would snap to, once the press has become a drag.
export function ghost(board: Board, m: Metrics): (Geometry & { free: boolean }) | null {
  const d = board.drag
  if (!d?.moving) return null
  return { ...geometry(d.id, d.target, m), free: d.free }
}

export const pressWidget = (board: Board, id: WidgetId, pointer: Point, origin: Point): Board => ({
  ...board,
  drag: { id, start: pointer, origin, dx: 0, dy: 0, moving: false, target: board.places[id], free: true }
})

export function movePointer(board: Board, pointer: Point, m: Metrics): Board {
  const d = board.drag
  if (!d) return board
  const dx = pointer.x - d.start.x
  const dy = pointer.y - d.start.y
  if (!d.moving && Math.hypot(dx, dy) < DRAG_THRESHOLD) return board
  const { place, free } = snap(d.id, { x: d.origin.x + dx, y: d.origin.y + dy }, board.places, m)
  return { ...board, drag: { ...d, dx, dy, moving: true, target: place, free } }
}

// Ends the press. A drag lands on its target only when that slot is free; otherwise the widget
// stays where it was. `wasDrag` tells the shell that the click ending the press must not
// activate the widget.
export function release(board: Board): { board: Board, wasDrag: boolean } {
  const d = board.drag
  if (!d) return { board, wasDrag: false }
  const places = d.moving && d.free ? { ...board.places, [d.id]: d.target } : board.places
  return { board: { places, drag: null }, wasDrag: d.moving }
}
