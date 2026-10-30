import type { Rect } from './window-manager'

export const MENU_BAR_HEIGHT = 28
export const TITLE_BAR_HEIGHT = 40
// Horizontal slice of the title bar that must stay on screen so the window can be grabbed.
export const MIN_VISIBLE_X = 100

export interface Screen { w: number, h: number }

// Keeps the title bar reachable: below the menu bar, above the bottom edge, partly within the sides.
export function clampPosition(rect: Rect, screen: Screen): Rect {
  const x = Math.min(Math.max(rect.x, MIN_VISIBLE_X - rect.w), screen.w - MIN_VISIBLE_X)
  const y = Math.min(Math.max(rect.y, MENU_BAR_HEIGHT), screen.h - TITLE_BAR_HEIGHT)
  return { ...rect, x, y }
}

// A newly opened window takes 80% of the screen and sits in the middle, below the menu bar.
export const DEFAULT_SCREEN_RATIO = 0.8
export function defaultRect(screen: Screen): Rect {
  const w = Math.round(screen.w * DEFAULT_SCREEN_RATIO)
  const h = Math.round(screen.h * DEFAULT_SCREEN_RATIO)
  return { x: Math.round((screen.w - w) / 2), y: Math.max(MENU_BAR_HEIGHT, Math.round((screen.h - h) / 2)), w, h }
}

export const MIN_WINDOW = { w: 320, h: 240 }
export type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

// Resizes from `start` by dragging `handle` by (dx, dy). The window never goes below
// 320x240 and never grows past the screen area below the menu bar.
export function resizeRect(start: Rect, handle: Handle, dx: number, dy: number, screen: Screen): Rect {
  let left = start.x
  let top = start.y
  let right = start.x + start.w
  let bottom = start.y + start.h

  if (handle.includes('w')) left = Math.min(Math.max(left + dx, 0), right - MIN_WINDOW.w)
  if (handle.includes('e')) right = Math.max(Math.min(right + dx, screen.w), left + MIN_WINDOW.w)
  if (handle.includes('n')) top = Math.min(Math.max(top + dy, MENU_BAR_HEIGHT), bottom - MIN_WINDOW.h)
  if (handle.includes('s')) bottom = Math.max(Math.min(bottom + dy, screen.h), top + MIN_WINDOW.h)

  // A window never ends up larger than the screen area below the menu bar.
  const w = Math.min(right - left, screen.w)
  const h = Math.min(bottom - top, screen.h - MENU_BAR_HEIGHT)
  return { x: handle.includes('w') ? right - w : left, y: handle.includes('n') ? bottom - h : top, w, h }
}
