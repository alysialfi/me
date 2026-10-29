import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { checkAboutMe, checkProjectFiles, knownContent, prerenderRoutes } from '../../shared/content-checks'

const dirs: string[] = []
const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'content-')); dirs.push(d); return d }
afterEach(() => dirs.splice(0).forEach(d => rmSync(d, { recursive: true, force: true })))

test('build fails when no note is designated About me', () => {
  const notes = tmp()
  writeFileSync(join(notes, 'a.md'), '---\ntitle: A\ndate: 2026-01-01\n---\nBody')
  expect(() => checkAboutMe(notes)).toThrow(/No note is designated as the first note/)
})

test('build fails when the notes folder is missing', () => {
  expect(() => checkAboutMe(join(tmp(), 'nope'))).toThrow(/designated/)
})

test('an about note passes', () => {
  const notes = tmp()
  writeFileSync(join(notes, 'a.md'), '---\ntitle: A\ndate: 2026-01-01\nabout: true\n---\nBody')
  expect(() => checkAboutMe(notes)).not.toThrow()
})

test('project with a PDF and two images lists all three', () => {
  const projects = tmp()
  mkdirSync(join(projects, 'x'))
  for (const f of ['project.yml', 'doc.pdf', 'a.png', 'b.JPG']) writeFileSync(join(projects, 'x', f), '')
  expect(checkProjectFiles(projects).x).toEqual([
    { name: 'a.png', type: 'image' }, { name: 'b.JPG', type: 'image' }, { name: 'doc.pdf', type: 'pdf' }
  ])
})

test('build fails naming an unsupported project file', () => {
  const projects = tmp()
  mkdirSync(join(projects, 'x'))
  writeFileSync(join(projects, 'x', 'notes.docx'), '')
  expect(() => checkProjectFiles(projects)).toThrow(/Unsupported project file "x\/notes\.docx"/)
})

test('known content lists notes, projects and files, and prerender routes skip file paths', () => {
  const root = tmp()
  mkdirSync(join(root, 'notes')); mkdirSync(join(root, 'projects/x'), { recursive: true })
  writeFileSync(join(root, 'notes/about-me.md'), '')
  writeFileSync(join(root, 'projects/x/doc.pdf'), '')
  const known = knownContent(root)
  expect(known).toEqual({ notes: ['about-me'], projects: { x: ['doc.pdf'] } })
  const routes = prerenderRoutes(known)
  expect(routes).toEqual(expect.arrayContaining(['/', '/finder', '/notes/about-me', '/finder/x', '/photos/personal']))
  expect(routes.some(r => r.endsWith('.pdf'))).toBe(false)
})
