import { expect, test } from 'vitest'
import { clampPosition, defaultRect, resizeRect } from '../../app/utils/window-geometry'

const screen = { w: 1280, h: 820 }
const rect = { x: 200, y: 100, w: 640, h: 420 }

test('a position inside the screen is unchanged', () => {
  expect(clampPosition(rect, screen)).toEqual(rect)
})

test('the title bar cannot go above the menu bar or below the screen', () => {
  expect(clampPosition({ ...rect, y: -50 }, screen).y).toBe(28)
  expect(clampPosition({ ...rect, y: 5000 }, screen).y).toBe(820 - 40)
})

test('part of the title bar stays on screen at either side', () => {
  expect(clampPosition({ ...rect, x: -5000 }, screen).x).toBe(100 - 640)
  expect(clampPosition({ ...rect, x: 5000 }, screen).x).toBe(1280 - 100)
})

test('defaultRect is 80% of the screen, centered, and never above the menu bar', () => {
  expect(defaultRect({ w: 1280, h: 820 })).toEqual({ x: 128, y: 82, w: 1024, h: 656 })
  expect(defaultRect({ w: 300, h: 100 }).y).toBe(28)
})

test('resizeRect never returns a window larger than the screen below the menu bar', () => {
  const r = resizeRect({ x: 0, y: 28, w: 1000, h: 700 }, 'se', 5000, 5000, { w: 1200, h: 800 })
  expect(r.w).toBeLessThanOrEqual(1200)
  expect(r.h).toBeLessThanOrEqual(772)
})
