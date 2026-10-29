import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { parse } from 'yaml'
import { z } from 'zod'
import { checkAboutMe, checkProjectFiles } from '../../shared/content-checks'
import { makeSchemas } from '../../shared/content-schemas'

const s = makeSchemas(z)
const content = join(__dirname, '../../content')
const pub = join(__dirname, '../../public')
const yml = (rel: string) => parse(readFileSync(join(content, rel), 'utf8'))
const ymlDir = (dir: string) => readdirSync(join(content, dir)).filter(f => f.endsWith('.yml')).map(f => yml(join(dir, f)))
const mediaExists = (url: string) => existsSync(join(pub, url))

describe('placeholder content', () => {
  test('every content type returns at least one valid item', () => {
    const sets: [string, unknown[], any][] = [
      ['photos', ymlDir('photos'), s.photo],
      ['songs', ymlDir('songs'), s.song],
      ['history', ymlDir('history'), s.history],
      ['contact', [yml('contact.yml')], s.contact],
      ['snippet', [yml('snippet.yml')], s.snippet],
      ['projects', Object.keys(checkProjectFiles(join(content, 'projects'))).map(slug => yml(`projects/${slug}/project.yml`)), s.project]
    ]
    for (const [name, items, schema] of sets) {
      expect(items.length, name).toBeGreaterThan(0)
      for (const item of items) expect(schema.safeParse(item).success, name).toBe(true)
    }
  })

  test('notes are valid, one is About me, and one has text, link, image and video', () => {
    const notes = readdirSync(join(content, 'notes')).filter(f => f.endsWith('.md')).map((f) => {
      const raw = readFileSync(join(content, 'notes', f), 'utf8')
      const [, front, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!
      return { meta: parse(front), body }
    })
    expect(notes.length).toBeGreaterThan(0)
    for (const n of notes) expect(s.note.safeParse(n.meta).success).toBe(true)
    expect(() => checkAboutMe(join(content, 'notes'))).not.toThrow()
    expect(notes.some(n => /\[[^\]]+\]\([^)]+\)/.test(n.body) && /!\[[^\]]*\]\(/.test(n.body) && /::note-video\{src=/.test(n.body) && /^[A-Za-z]/m.test(n.body))).toBe(true)
  })

  test('projects include a PDF and images', () => {
    const files = Object.values(checkProjectFiles(join(content, 'projects'))).flat()
    expect(files.some(f => f.type === 'pdf')).toBe(true)
    expect(files.some(f => f.type === 'image')).toBe(true)
  })

  test('photos include both kinds and every referenced media file exists', () => {
    const photos = ymlDir('photos')
    expect(new Set(photos.map(p => p.kind))).toEqual(new Set(['personal', 'project']))
    const urls = [...photos.map(p => p.image), ...ymlDir('songs').flatMap(x => [x.audio, x.cover].filter(Boolean))]
    for (const u of urls) expect(mediaExists(u), u).toBe(true)
  })

  test('a song without cover art exists and placeholders are labelled', () => {
    expect(ymlDir('songs').some(x => !x.cover)).toBe(true)
    expect(yml('contact.yml').fullName).toMatch(/placeholder/i)
    expect(ymlDir('photos').every(p => /placeholder/i.test(p.caption))).toBe(true)
  })
})
