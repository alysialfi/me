import { expect, test } from 'vitest'
import {
  DEFAULT_METRICS, defaultBoard, ghost, isFree, layout, measure, movePointer, pressWidget, release, snap, widthOf
} from '../../app/utils/desktop-board'
import { WIDGETS } from '../../app/utils/widgets'

const m = measure(1280 - 64, 820)
const step = m.colWidth + m.gutter

test('measure derives the column width and the bottom of the widget area', () => {
  expect(m).toEqual({ colWidth: (1216 - 11 * 24) / 12, gutter: 24, maxBottom: 820 - 60 - 100 })
  expect(DEFAULT_METRICS).toEqual(m)
  expect(widthOf(2, m)).toBeCloseTo(2 * m.colWidth + 24)
})

test('the default board has no overlaps', () => {
  const b = defaultBoard()
  for (const { id } of WIDGETS) expect(isFree(id, b.places[id], b.places, m), id).toBe(true)
})

test('heights follow each widget\'s height rule at every desktop width', () => {
  for (const viewport of [1024, 1440, 1920, 2560]) {
    const mm = measure(viewport - 64, 900)
    for (const g of layout(defaultBoard(), mm)) {
      const w = WIDGETS.find(x => x.id === g.id)!
      const h: { fixed?: number, ratio?: number } = w.height
      const expected = h.fixed ?? Math.round(widthOf(w.span, mm) * h.ratio!)
      expect(g.height, `${g.id} at ${viewport}`).toBe(expected)
    }
  }
})

test('snap rounds to columns and 8px rows and keeps the widget inside the grid', () => {
  const p = defaultBoard().places
  expect(snap('clock', { x: 3 * step + 10, y: 3 }, p, m)).toEqual({ place: { col: 4, top: 0 }, free: true })
  expect(snap('clock', { x: 20 * step, y: 0 }, p, m).place.col).toBe(11)
  expect(snap('clock', { x: -200, y: -50 }, p, m).place).toEqual({ col: 1, top: 0 })
  expect(snap('clock', { x: 5 * step, y: 0 }, p, m).free).toBe(false) // on the calendar
  expect(snap('clock', { x: 0, y: 600 }, p, m).free).toBe(false) // below the widget area
})

test('the free-space check uses the rendered height', () => {
  const p = defaultBoard().places
  const music = layout(defaultBoard(), m).find(g => g.id === 'music')!
  // Calendar spans columns 6-9 and overlaps music's columns 9-12 in column 9.
  const below = music.top + music.height + 8
  expect(snap('calendar', { x: 5 * step, y: below - 8 }, p, m).free).toBe(false)
  const cal = { ...p, calendar: { col: 6, top: below } }
  expect(isFree('calendar', { col: 6, top: below }, cal, { ...m, maxBottom: 2000 })).toBe(true)
})

test('a press that moves less than 6px is not a drag', () => {
  let b = pressWidget(defaultBoard(), 'clock', { x: 100, y: 100 }, { x: 0, y: 0 })
  b = movePointer(b, { x: 104, y: 103 }, m)
  expect(b.drag?.moving).toBe(false)
  expect(ghost(b, m)).toBeNull()
  const r = release(b)
  expect(r.wasDrag).toBe(false)
  expect(r.board.places.clock).toEqual({ col: 1, top: 0 })
})

test('a drag onto free space lands there and swallows the click', () => {
  let b = pressWidget(defaultBoard(), 'clock', { x: 100, y: 100 }, { x: 0, y: 0 })
  b = movePointer(b, { x: 100 + 3 * step + 10, y: 100 }, m)
  expect(b.drag).toMatchObject({ moving: true, dx: 3 * step + 10, dy: 0, target: { col: 4, top: 0 }, free: true })
  expect(ghost(b, m)).toMatchObject({ col: 4, span: 2, top: 0, free: true })
  const r = release(b)
  expect(r.wasDrag).toBe(true)
  expect(r.board.places.clock).toEqual({ col: 4, top: 0 })
  expect(r.board.drag).toBeNull()
})

test('a drag onto another widget goes back', () => {
  let b = pressWidget(defaultBoard(), 'clock', { x: 100, y: 100 }, { x: 0, y: 0 })
  b = movePointer(b, { x: 100 + 5 * step, y: 100 }, m)
  expect(ghost(b, m)?.free).toBe(false)
  const r = release(b)
  expect(r.wasDrag).toBe(true)
  expect(r.board.places.clock).toEqual({ col: 1, top: 0 })
})

test('once a press is a drag, moving back near the start keeps it a drag', () => {
  let b = pressWidget(defaultBoard(), 'clock', { x: 100, y: 100 }, { x: 0, y: 0 })
  b = movePointer(b, { x: 130, y: 100 }, m)
  b = movePointer(b, { x: 101, y: 100 }, m)
  expect(b.drag?.moving).toBe(true)
  expect(release(b).wasDrag).toBe(true)
})
