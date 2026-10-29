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
