import { expect, test } from 'vitest'
import { genieStrips } from '../../app/utils/genie'

const win = { left: 100, top: 100, width: 800, height: 500 }
const icon = { left: 700, top: 760, width: 48, height: 48 }
const sink = 784

test('at the start the strips tile the open window', () => {
  const strips = genieStrips(win, icon, 0, 10)
  expect(strips[0]).toMatchObject({ x: 100, y: 100, width: 800, height: 50, top: [100, 900] })
  expect(strips[9]!.y + strips[9]!.height).toBe(600)
  expect(strips.every(s => s.x === 100 && s.width === 800)).toBe(true)
})

test('the bend keeps the top edge and pulls the bottom edge onto the icon', () => {
  const strips = genieStrips(win, icon, 0.4, 10)
  expect(strips[0]!.y).toBe(100)
  expect(strips[0]!.width).toBeGreaterThan(790)
  const last = strips[9]!
  expect(last.y + last.height).toBe(sink)
  expect(last.width).toBeLessThan(200)
  expect(last.x).toBeGreaterThan(500)
  // Sides curve in gradually, so widths shrink from top to bottom.
  for (let i = 1; i < 10; i++) expect(strips[i]!.width).toBeLessThanOrEqual(strips[i - 1]!.width)
})

test('the slide sinks the whole window into the icon', () => {
  const strips = genieStrips(win, icon, 1, 10)
  for (const s of strips) {
    expect(s.y).toBeCloseTo(sink)
    expect(s.height).toBeCloseTo(0)
    expect(s.x).toBeCloseTo(icon.left)
    expect(s.width).toBeCloseTo(icon.width)
  }
})
