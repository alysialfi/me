import { nextTick, ref } from 'vue'
import { describe, expect, test } from 'vitest'
import { modeForWidth, type ViewportMode } from '../../app/utils/viewport'
import { createWindowManager } from '../../app/utils/window-manager'

const make = (m: ViewportMode = 'desktop') => {
  const mode = ref<ViewportMode>(m)
  return { mode, wm: createWindowManager(mode) }
}

describe('modeForWidth', () => {
  test('follows the Tailwind md and lg breakpoints', () => {
    expect([390, 767, 768, 1023, 1024, 1280].map(modeForWidth))
      .toEqual(['phone', 'phone', 'tablet', 'tablet', 'desktop', 'desktop'])
  })
})

describe('open and close', () => {
  test('opening apps puts the newest in front and focused', () => {
    const { wm } = make()
    wm.open('notes')
    wm.open('finder', { project: 'x' })
    expect(wm.windows.value.map(w => w.app)).toEqual(['notes', 'finder'])
    expect(wm.focused.value?.app).toBe('finder')
    expect(wm.focused.value?.view).toEqual({ project: 'x' })
  })

  test('opening an open app focuses it instead of adding a second window', () => {
    const { wm } = make()
    wm.open('notes')
    wm.open('finder')
    wm.open('notes')
    expect(wm.windows.value).toHaveLength(2)
    expect(wm.focused.value?.app).toBe('notes')
  })

  test('re-opening without a view keeps the view; with a view replaces it', () => {
    const { wm } = make()
    wm.open('finder', { project: 'a' })
    wm.open('finder')
    expect(wm.focused.value?.view).toEqual({ project: 'a' })
    wm.open('finder', { project: 'b' })
    expect(wm.focused.value?.view).toEqual({ project: 'b' })
  })

  test('closing the focused window focuses the next one in front', () => {
    const { wm } = make()
    wm.open('notes'); wm.open('music'); wm.open('finder')
    wm.close('finder')
    expect(wm.focused.value?.app).toBe('music')
    wm.close('music'); wm.close('notes')
    expect(wm.focused.value).toBeNull()
    expect(wm.isOpen('notes')).toBe(false)
  })

  test('focus brings a window to the front', () => {
    const { wm } = make()
    wm.open('notes'); wm.open('finder')
    wm.focus('notes')
    expect(wm.focused.value?.app).toBe('notes')
    expect(wm.windows.value.map(w => w.app)).toEqual(['finder', 'notes'])
  })
})

describe('minimize and full screen', () => {
  test('minimize hides the window, keeps it open and focuses the next', () => {
    const { wm } = make()
    wm.open('notes'); wm.open('finder')
    wm.minimize('finder')
    expect(wm.focused.value?.app).toBe('notes')
    expect(wm.visible.value.map(w => w.app)).toEqual(['notes'])
    expect(wm.isOpen('finder')).toBe(true)
  })

  test('opening a minimized app restores it in front', () => {
    const { wm } = make()
    wm.open('notes'); wm.open('finder'); wm.minimize('finder')
    wm.open('finder')
    expect(wm.focused.value?.app).toBe('finder')
    expect(wm.windows.value).toHaveLength(2)
  })

  test('full screen remembers and restores the rectangle', () => {
    const { wm } = make()
    wm.open('notes')
    wm.setRect('notes', { x: 10, y: 20, w: 500, h: 300 })
    wm.toggleFullscreen('notes')
    expect(wm.focused.value?.state).toBe('fullscreen')
    wm.toggleFullscreen('notes')
    expect(wm.focused.value?.state).toBe('normal')
    expect(wm.focused.value?.rect).toEqual({ x: 10, y: 20, w: 500, h: 300 })
  })

  test('a minimized full-screen window comes back full screen', () => {
    const { wm } = make()
    wm.open('notes'); wm.toggleFullscreen('notes'); wm.minimize('notes')
    wm.open('notes')
    expect(wm.focused.value?.state).toBe('fullscreen')
  })
})

describe('mode changes across lg', () => {
  test('desktop shows every open window; below lg only the focused one', async () => {
    const { wm, mode } = make()
    wm.open('notes'); wm.open('finder')
    expect(wm.visible.value).toHaveLength(2)
    mode.value = 'tablet'
    expect(wm.visible.value.map(w => w.app)).toEqual(['finder'])
    expect(wm.windows.value).toHaveLength(2)
    mode.value = 'desktop'
    expect(wm.visible.value).toHaveLength(2)
  })

  test('presentation is window on desktop and sheet below lg', () => {
    const { wm, mode } = make()
    wm.open('finder')
    const w = wm.focused.value!
    expect(wm.presentation(w)).toBe('window')
    mode.value = 'phone'
    expect(wm.presentation(w)).toBe('sheet')
  })

  test('the first-load Notes overlay is windowed below lg; later opens are sheets', () => {
    const { wm, mode } = make('phone')
    wm.open('notes', undefined, { overlay: true })
    expect(wm.presentation(wm.focused.value!)).toBe('overlay')
    wm.open('finder')
    expect(wm.presentation(wm.focused.value!)).toBe('sheet')
    expect(wm.visible.value.map(w => w.app)).toEqual(['finder'])
    mode.value = 'desktop'
    expect(wm.visible.value.map(w => w.app)).toEqual(['notes', 'finder'])
  })

  test('closing a sheet below lg shows the home screen; extras return at lg', async () => {
    const { wm, mode } = make('phone')
    wm.open('notes', undefined, { overlay: true })
    wm.open('finder')
    wm.close('finder')
    expect(wm.focused.value).toBeNull()
    expect(wm.visible.value).toEqual([])
    expect(wm.isOpen('notes')).toBe(true)
    mode.value = 'desktop'
    await nextTick()
    expect(wm.visible.value.map(w => w.app)).toEqual(['notes'])
  })

  test('opening an app after returning home shows it', () => {
    const { wm } = make('tablet')
    wm.open('finder'); wm.close('finder')
    wm.open('music')
    expect(wm.focused.value?.app).toBe('music')
  })
})
