// The App catalogue: every app's title, icon and the shape of its address.
// Parsing a path, building one and the pre-rendered list are all derived from it.

// What an app shows: a note, or a project folder (and file).
export interface AppView { note?: string, project?: string, file?: string }

// What exists in the content, used to tell a real note/project/file from an unknown name.
export interface KnownContent { notes: string[], projects: Record<string, string[]> }

interface Segment {
  key: keyof AppView
  // Allowed names, given the content and the view parsed so far.
  known: (k: KnownContent, view: AppView) => readonly string[]
  // A path ending in an extension would be written as a file, so file paths are not pre-rendered.
  prerender: boolean
}

export interface AppEntry { title: string, icon: string, segments: readonly Segment[] }

const note: Segment = { key: 'note', known: k => k.notes, prerender: true }
const project: Segment = { key: 'project', known: k => Object.keys(k.projects), prerender: true }
const file: Segment = { key: 'file', known: (k, v) => k.projects[v.project!] ?? [], prerender: false }

// Listed in dock order (from the Penpot design).
const CATALOGUE = {
  photos: { title: 'Photos', icon: '/icons/photos.png', segments: [] },
  contact: { title: 'Contact', icon: '/icons/contact.png', segments: [] },
  notes: { title: 'Notes', icon: '/icons/notes.png', segments: [note] },
  finder: { title: 'Finder', icon: '/icons/finder.png', segments: [project, file] },
  music: { title: 'Music', icon: '/icons/music.png', segments: [] },
  vscode: { title: 'VS Code', icon: '/icons/vscode.png', segments: [] }
} as const satisfies Record<string, AppEntry>

export type AppId = keyof typeof CATALOGUE
export const APPS: Record<AppId, AppEntry> = CATALOGUE
export const APP_IDS = Object.keys(CATALOGUE) as AppId[]

export const isApp = (name: string): name is AppId => (APP_IDS as readonly string[]).includes(name)

// The view named by the segments after the app name, or null when the path is not found.
// Without known content only the shape is checked.
export function viewFromSegments(app: AppId, segments: readonly string[], known?: KnownContent): AppView | null {
  const declared = APPS[app].segments
  if (segments.length > declared.length) return null
  const view: AppView = {}
  for (const [i, name] of segments.entries()) {
    const seg = declared[i]!
    if (known && !seg.known(known, view).includes(name)) return null
    view[seg.key] = name
  }
  return view
}

// The declared segments of a view in order, stopping at the first missing one.
export function segmentsFromView(app: AppId, view: AppView): string[] {
  const out: string[] = []
  for (const seg of APPS[app].segments) {
    const value = view[seg.key]
    if (!value) break
    out.push(value)
  }
  return out
}

// Paths pre-rendered as static HTML: home, every app root, and every known name
// at each pre-rendered depth.
export function prerenderPaths(known: KnownContent): string[] {
  const paths = ['/']
  for (const id of APP_IDS) {
    const walk = (depth: number, prefix: string[], view: AppView) => {
      paths.push('/' + [id, ...prefix].map(encodeURIComponent).join('/'))
      const seg = APPS[id].segments[depth]
      if (!seg?.prerender) return
      for (const name of seg.known(known, view)) walk(depth + 1, [...prefix, name], { ...view, [seg.key]: name })
    }
    walk(0, [], {})
  }
  return paths
}
