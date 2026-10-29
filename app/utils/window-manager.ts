import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { ViewportMode } from './viewport'

export const APP_IDS = ['notes', 'finder', 'photos', 'contact', 'music', 'vscode'] as const
export type AppId = typeof APP_IDS[number]
export type WindowState = 'normal' | 'minimized' | 'fullscreen'
export type Presentation = 'window' | 'overlay' | 'sheet'

export interface Rect { x: number, y: number, w: number, h: number }
// What an app shows: a note, a project folder (and file), or a photo album.
export interface AppView { note?: string, project?: string, file?: string, album?: string }

export interface AppWindow {
  app: AppId
  view: AppView
  state: WindowState
  rect: Rect
  restoreRect?: Rect
  minimizedFrom?: Exclude<WindowState, 'minimized'>
  // First-load Notes: windowed above the home screen below lg.
  overlay: boolean
}

export const DEFAULT_SIZE = { w: 640, h: 420 }

export function createWindowManager(mode: Ref<ViewportMode>) {
  // Ordered back to front; the last non-minimized entry is the focused app.
  const windows = ref<AppWindow[]>([])
  // Below lg, closing an app returns to the home screen even if others stay listed open.
  const homeShown = ref(false)

  watch(mode, (m) => { if (m === 'desktop') homeShown.value = false })

  const find = (app: AppId) => windows.value.find(w => w.app === app)
  const toFront = (w: AppWindow) => {
    windows.value = [...windows.value.filter(x => x !== w), w]
  }

  const focused = computed(() => {
    if (mode.value !== 'desktop' && homeShown.value) return null
    return [...windows.value].reverse().find(w => w.state !== 'minimized') ?? null
  })

  const visible = computed(() =>
    mode.value === 'desktop'
      ? windows.value.filter(w => w.state !== 'minimized')
      : focused.value ? [focused.value] : [])

  function presentation(w: AppWindow): Presentation {
    if (mode.value === 'desktop') return 'window'
    return w.overlay ? 'overlay' : 'sheet'
  }

  function open(app: AppId, view?: AppView, opts: { overlay?: boolean } = {}) {
    homeShown.value = false
    let w = find(app)
    if (w) {
      if (view) w.view = { ...view }
      if (w.state === 'minimized') w.state = w.minimizedFrom ?? 'normal'
      w.overlay = opts.overlay ?? false
    } else {
      const n = windows.value.length
      w = reactive<AppWindow>({
        app,
        view: { ...view },
        state: 'normal',
        rect: { x: 120 + n * 28, y: 80 + n * 28, ...DEFAULT_SIZE },
        overlay: opts.overlay ?? false
      })
      windows.value = [...windows.value, w]
    }
    toFront(w)
  }

  function close(app: AppId) {
    windows.value = windows.value.filter(w => w.app !== app)
    homeShown.value = mode.value !== 'desktop'
  }

  function focus(app: AppId) {
    const w = find(app)
    if (!w) return
    homeShown.value = false
    if (w.state === 'minimized') w.state = w.minimizedFrom ?? 'normal'
    toFront(w)
  }

  function minimize(app: AppId) {
    const w = find(app)
    if (!w || w.state === 'minimized') return
    w.minimizedFrom = w.state
    w.state = 'minimized'
  }

  function toggleFullscreen(app: AppId) {
    const w = find(app)
    if (!w || w.state === 'minimized') return
    if (w.state === 'fullscreen') {
      if (w.restoreRect) w.rect = { ...w.restoreRect }
      w.state = 'normal'
    } else {
      w.restoreRect = { ...w.rect }
      w.state = 'fullscreen'
    }
  }

  function setRect(app: AppId, rect: Rect) {
    const w = find(app)
    if (w) w.rect = { ...rect }
  }

  // Dock indicator: an open or minimized window exists.
  const isOpen = (app: AppId) => !!find(app)

  return { mode, windows, focused, visible, presentation, open, close, focus, minimize, toggleFullscreen, setRect, isOpen }
}

export type WindowManager = ReturnType<typeof createWindowManager>
