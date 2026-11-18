import { isApp, segmentsFromView, viewFromSegments, type AppId, type AppView, type KnownContent } from '#shared/apps'
import type { WindowState } from './window-manager'

export interface ParsedRoute {
  // True for `/` (the home screen, with the first-load Notes).
  home: boolean
  focus: { app: AppId, view: AppView } | null
  // Other open apps from the `with` query, unknown names dropped.
  others: AppId[]
  notFound: boolean
}

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
  const [app, ...rest] = segments
  if (!app || !isApp(app)) return notFound
  const view = viewFromSegments(app, rest, known)
  if (!view) return notFound
  return { home: false, focus: { app, view }, others: others.filter(o => o !== app), notFound: false }
}

export interface RouteWindow { app: AppId, view: AppView, state: WindowState, overlay: boolean }

export function pathFor(w: Pick<RouteWindow, 'app' | 'view' | 'overlay'>, alone = true): string {
  // The first-load Notes window is the home screen itself while it is the only window.
  if (w.overlay && alone) return '/'
  const parts = [w.app, ...segmentsFromView(w.app, w.view)]
  return '/' + parts.map(encodeURIComponent).join('/')
}

// Path of the focused app plus, on desktop, the other visible windows in `with` (back to front).
export function buildRoute(windows: RouteWindow[], focused: RouteWindow | null, desktop: boolean): { path: string, query: Record<string, string> } {
  const path = focused ? pathFor(focused, windows.filter(w => w.state !== 'minimized').length === 1) : '/'
  const others = desktop
    ? windows.filter(w => w !== focused && w.state !== 'minimized').map(w => w.app)
    : []
  return { path, query: others.length ? { with: others.join(',') } : {} }
}
