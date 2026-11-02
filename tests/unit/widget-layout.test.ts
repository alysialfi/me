import { expect, test } from 'vitest'
import { defaultLayout, fitSpan, isFree, snapDrop, widthOf, heightOf, sizeFor } from '../../app/utils/widget-layout'

const m = { colWidth: (1280 - 64 - 11 * 24) / 12, gutter: 24, maxBottom: 660 }

test('the default layout is free of overlaps', () => {
  const l = defaultLayout()
  for (const id of Object.keys(l.spans) as (keyof typeof l.spans)[]) expect(isFree(id, l.places[id], l.spans[id], l, m), id).toBe(true)
})

test('snapDrop snaps to columns and 8px rows; occupied or out-of-area spots are not free', () => {
  const l = defaultLayout()
  const col = m.colWidth + m.gutter
  expect(snapDrop('clock', 3 * col + 10, 3, l, m)).toEqual({ place: { col: 4, top: 0 }, free: true })
  expect(snapDrop('clock', 5 * col, 0, l, m).free).toBe(false) // on the calendar
  expect(snapDrop('clock', 0, 600, l, m).free).toBe(false) // below the free area
})

test('fitSpan stops before a neighbour', () => {
  const l = defaultLayout()
  const start = { place: l.places.clock, span: l.spans.clock }
  expect(fitSpan('clock', 4, start, l, m)).toBe(3) // 4 columns would run into the photo carousel below
  expect(sizeFor('clock', 3)).toBe('M')
  expect(heightOf('clock', 'S', widthOf(2, m))).toBe(83)
})
