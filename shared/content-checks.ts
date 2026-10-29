import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { PROJECT_FILE_EXTENSIONS } from './content-schemas'

export interface ProjectFile { name: string, type: 'pdf' | 'image' }

export function checkAboutMe(notesDir: string) {
  const files = existsSync(notesDir) ? readdirSync(notesDir).filter(f => f.endsWith('.md')) : []
  const designated = files.some(f => /^---\n[\s\S]*?^about:\s*true\s*$[\s\S]*?^---/m.test(readFileSync(join(notesDir, f), 'utf8')))
  if (!designated) {
    throw new Error(`No note is designated as the first note ("About me"). Add \`about: true\` to the frontmatter of one note in ${notesDir}.`)
  }
}

// Returns the files of each project folder; throws naming the first unsupported file.
export function checkProjectFiles(projectsDir: string): Record<string, ProjectFile[]> {
  const result: Record<string, ProjectFile[]> = {}
  if (!existsSync(projectsDir)) return result
  for (const slug of readdirSync(projectsDir).sort()) {
    const dir = join(projectsDir, slug)
    if (!statSync(dir).isDirectory()) continue
    result[slug] = []
    for (const name of readdirSync(dir).sort()) {
      if (name === 'project.yml') continue
      const ext = extname(name).slice(1).toLowerCase()
      if (!PROJECT_FILE_EXTENSIONS.includes(ext)) {
        throw new Error(`Unsupported project file "${join(slug, name)}": project files must be a PDF or an image (${PROJECT_FILE_EXTENSIONS.join(', ')}).`)
      }
      result[slug].push({ name, type: ext === 'pdf' ? 'pdf' : 'image' })
    }
  }
  return result
}

export interface KnownContent { notes: string[], projects: Record<string, string[]> }

export function listNotes(notesDir: string): string[] {
  return existsSync(notesDir) ? readdirSync(notesDir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')).sort() : []
}

// Names that count as real in a URL: note slugs, project folders and their file names.
export function knownContent(contentDir: string): KnownContent {
  const files = checkProjectFiles(join(contentDir, 'projects'))
  return {
    notes: listNotes(join(contentDir, 'notes')),
    projects: Object.fromEntries(Object.entries(files).map(([slug, list]) => [slug, list.map(f => f.name)]))
  }
}

export const ALBUM_NAMES = ['all', 'personal', 'projects']

// Paths pre-rendered as static HTML. File paths (e.g. /finder/x/a.pdf) are left to the
// server's fallback to the home page, because a path ending in an extension would be
// written as a file with that extension.
export function prerenderRoutes(known: KnownContent): string[] {
  return [
    '/', '/notes', '/finder', '/photos', '/contact', '/music', '/vscode',
    ...known.notes.map(n => `/notes/${n}`),
    ...Object.keys(known.projects).map(p => `/finder/${p}`),
    ...ALBUM_NAMES.map(a => `/photos/${a}`)
  ]
}
