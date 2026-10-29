import { expect, test } from 'vitest'
import { clampPosition } from '../../app/utils/window-geometry'

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
