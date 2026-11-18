import { expect, test } from 'vitest'
import { WIDGETS, heightAt } from '../../app/utils/widgets'

test('widget ids are unique', () => {
  const ids = WIDGETS.map(w => w.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('every widget fits the 12-column grid', () => {
  for (const w of WIDGETS) {
    expect(w.span, w.id).toBeGreaterThanOrEqual(1)
    expect(w.col, w.id).toBeGreaterThanOrEqual(1)
    expect(w.col + w.span - 1, w.id).toBeLessThanOrEqual(12)
    expect(w.top, w.id).toBeGreaterThanOrEqual(0)
  }
})

test('every widget has a valid height rule', () => {
  for (const w of WIDGETS) {
    const h: { fixed?: number, ratio?: number } = w.height
    expect(('fixed' in h) !== ('ratio' in h), w.id).toBe(true)
    expect(h.fixed ?? h.ratio!, w.id).toBeGreaterThan(0)
  }
})

test('a height rule gives a fixed height or a rounded ratio of the width', () => {
  expect(heightAt({ fixed: 337 }, 1000)).toBe(337)
  expect(heightAt({ ratio: 0.4524 }, 209)).toBe(95)
})
