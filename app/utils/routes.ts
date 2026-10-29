import { APP_IDS, type AppId, type AppView, type WindowState } from './window-manager'

export const ALBUMS = ['all', 'personal', 'projects'] as const

// What exists in the content, used to tell a real note/project/file from an unknown name.
export interface KnownContent {
  notes: string[]
  projects: Record<string, string[]>
}

export interface ParsedRoute {
  // True for `/` (the home screen, with the first-load Notes).
  home: boolean
  focus: { app: AppId, view: AppView } | null
  // Other open apps from the `with` query, unknown names dropped.
  others: AppId[]
  notFound: boolean
}

const MAX_SEGMENTS: Record<AppId, number> = { notes: 2, finder: 3, photos: 2, contact: 1, music: 1, vscode: 1 }

const isApp = (name: string): name is AppId => (APP_IDS as readonly string[]).includes(name)

function decode(segment: string) {
  try { return decodeURIComponent(segment) } catch { return segment }
}

export function parseWith(value?: string | null): AppId[] {
  const names = (value ?? '').split(',').map(n => n.trim()).filter(isApp)
  return [...new Set(names)]
}

export function parseRoute(path: string, withParam?: string | null, known?: KnownContent): ParsedRoute {
  const segments = path.split('/').filter(Boolean).map(decode)
  const others = parseWith(withParam)
  if (!segments.length) return { home: true, focus: null, others, notFound: false }

  const notFound: ParsedRoute = { home: false, focus: null, others, notFound: true }
  const [app, a, b] = segments
  if (!app || !isApp(app) || segments.length > MAX_SEGMENTS[app]) return notFound

  const view: AppView = {}
  if (app === 'notes' && a) {
    if (known && !known.notes.includes(a)) return notFound
    view.note = a
  }
  if (app === 'finder' && a) {
    if (known && !known.projects[a]) return notFound
    view.project = a
    if (b) {
      if (known && !known.projects[a]!.includes(b)) return notFound
      view.file = b
    }
  }
  if (app === 'photos' && a) {
    if (!(ALBUMS as readonly string[]).includes(a)) return notFound
    view.album = a
  }
  return { home: false, focus: { app, view }, others: others.filter(o => o !== app), notFound: false }
}

export interface RouteWindow { app: AppId, view: AppView, state: WindowState, overlay: boolean }

export function pathFor(w: Pick<RouteWindow, 'app' | 'view' | 'overlay'>, alone = true): string {
  // The first-load Notes window is the home screen itself while it is the only window.
  if (w.overlay && alone) return '/'
  const parts: (string | undefined)[] = [w.app]
  if (w.app === 'notes') parts.push(w.view.note)
  if (w.app === 'finder') parts.push(w.view.project, w.view.project ? w.view.file : undefined)
  if (w.app === 'photos') parts.push(w.view.album)
  return '/' + parts.filter(Boolean).map(p => encodeURIComponent(p!)).join('/')
}

// Path of the focused app plus, on desktop, the other visible windows in `with` (back to front).
export function buildRoute(windows: RouteWindow[], focused: RouteWindow | null, desktop: boolean): { path: string, query: Record<string, string> } {
  const path = focused ? pathFor(focused, windows.filter(w => w.state !== 'minimized').length === 1) : '/'
  const others = desktop
    ? windows.filter(w => w !== focused && w.state !== 'minimized').map(w => w.app)
    : []
  return { path, query: others.length ? { with: others.join(',') } : {} }
}
