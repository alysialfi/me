import { describe, expect, test } from 'vitest'
import { resizeRect } from '../../app/utils/window-geometry'

const screen = { w: 1280, h: 820 }
const start = { x: 200, y: 100, w: 640, h: 420 }

describe('resizeRect', () => {
  test('dragging a corner outward grows the window', () => {
    expect(resizeRect(start, 'se', 100, 50, screen)).toEqual({ x: 200, y: 100, w: 740, h: 470 })
  })

  test('the west and north edges move the origin', () => {
    expect(resizeRect(start, 'nw', -50, -20, screen)).toEqual({ x: 150, y: 80, w: 690, h: 440 })
  })

  test('minimum size is 320x240 and the opposite edge stays put', () => {
    expect(resizeRect(start, 'se', -5000, -5000, screen)).toEqual({ x: 200, y: 100, w: 320, h: 240 })
    expect(resizeRect(start, 'nw', 5000, 5000, screen)).toEqual({ x: 520, y: 280, w: 320, h: 240 })
  })

  test('maximum size is the screen area below the menu bar', () => {
    expect(resizeRect(start, 'se', 5000, 5000, screen)).toEqual({ x: 200, y: 100, w: 1080, h: 720 })
    expect(resizeRect(start, 'nw', -5000, -5000, screen)).toEqual({ x: 0, y: 28, w: 840, h: 492 })
    const full = resizeRect(resizeRect(start, 'nw', -5000, -5000, screen), 'se', 5000, 5000, screen)
    expect(full).toEqual({ x: 0, y: 28, w: 1280, h: 792 })
  })

  test('edge handles change one dimension only', () => {
    expect(resizeRect(start, 'e', 60, 999, screen)).toEqual({ x: 200, y: 100, w: 700, h: 420 })
    expect(resizeRect(start, 's', 999, 60, screen)).toEqual({ x: 200, y: 100, w: 640, h: 480 })
  })
})
