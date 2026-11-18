import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { APP_IDS, APPS, prerenderPaths, segmentsFromView, viewFromSegments, type AppId } from '../../shared/apps'

const known = { notes: ['about-me', 'ideas'], projects: { 'project-x': ['spec.pdf', 'shot.png'], empty: [] } }

describe('App catalogue', () => {
  test('dock order and an entry per app', () => {
    expect(APP_IDS).toEqual(['photos', 'contact', 'notes', 'finder', 'music', 'vscode'])
    for (const id of APP_IDS) expect(APPS[id].title).toBeTruthy()
  })

  test('imports nothing from vue or app/', () => {
    const src = readFileSync('shared/apps.ts', 'utf8')
    expect(src).not.toMatch(/from ['"](vue|~|#app|\.\.\/app)/)
  })
})

describe('viewFromSegments / segmentsFromView', () => {
  test.each<[AppId, string[]]>([
    ['notes', []],
    ['notes', ['about-me']],
    ['finder', []],
    ['finder', ['project-x']],
    ['finder', ['project-x', 'spec.pdf']],
    ['photos', []],
    ['contact', []],
    ['music', []],
    ['vscode', []]
  ])('%s %j round trips', (app, segments) => {
    const view = viewFromSegments(app, segments, known)
    expect(view).not.toBeNull()
    expect(segmentsFromView(app, view!)).toEqual(segments)
  })

  test('too many segments and unknown names are not found', () => {
    expect(viewFromSegments('photos', ['personal'], known)).toBeNull()
    expect(viewFromSegments('contact', ['extra'])).toBeNull()
    expect(viewFromSegments('finder', ['project-x', 'spec.pdf', 'more'])).toBeNull()
    expect(viewFromSegments('notes', ['missing'], known)).toBeNull()
    expect(viewFromSegments('finder', ['missing'], known)).toBeNull()
    expect(viewFromSegments('finder', ['project-x', 'missing.pdf'], known)).toBeNull()
    expect(viewFromSegments('finder', ['empty', 'spec.pdf'], known)).toBeNull()
  })

  test('without known content only the shape is checked', () => {
    expect(viewFromSegments('finder', ['anything', 'file.pdf'])).toEqual({ project: 'anything', file: 'file.pdf' })
    expect(viewFromSegments('notes', ['anything'])).toEqual({ note: 'anything' })
  })

  test('undeclared keys are dropped and the path stops at the first missing key', () => {
    expect(segmentsFromView('finder', { file: 'orphan.pdf' })).toEqual([])
    expect(segmentsFromView('photos', { note: 'x', project: 'y' } as any)).toEqual([])
    expect(segmentsFromView('photos', { album: 'personal' } as any)).toEqual([])
    expect(segmentsFromView('notes', { note: 'a', project: 'p' })).toEqual(['a'])
  })
})

test('prerenderPaths lists roots, every note and project, and no files', () => {
  expect(prerenderPaths(known)).toEqual([
    '/',
    '/photos',
    '/contact',
    '/notes', '/notes/about-me', '/notes/ideas',
    '/finder', '/finder/project-x', '/finder/empty',
    '/music',
    '/vscode'
  ])
})
