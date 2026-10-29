import { describe, expect, test } from 'vitest'
import { buildRoute, parseRoute, parseWith, pathFor } from '../../app/utils/routes'

const known = { notes: ['about-me', 'ideas'], projects: { 'project-x': ['spec.pdf', 'shot.png'], empty: [] } }

describe('parseRoute', () => {
  test('home', () => {
    expect(parseRoute('/')).toEqual({ home: true, focus: null, others: [], notFound: false })
  })

  test.each([
    ['/notes', { app: 'notes', view: {} }],
    ['/notes/about-me', { app: 'notes', view: { note: 'about-me' } }],
    ['/finder', { app: 'finder', view: {} }],
    ['/finder/project-x', { app: 'finder', view: { project: 'project-x' } }],
    ['/finder/project-x/spec.pdf', { app: 'finder', view: { project: 'project-x', file: 'spec.pdf' } }],
    ['/photos/personal', { app: 'photos', view: { album: 'personal' } }],
    ['/contact', { app: 'contact', view: {} }],
    ['/music', { app: 'music', view: {} }],
    ['/vscode', { app: 'vscode', view: {} }]
  ])('%s', (path, focus) => {
    expect(parseRoute(path, null, known)).toMatchObject({ home: false, focus, notFound: false })
  })

  test('trailing slashes and encoded names', () => {
    expect(parseRoute('/finder/project%20x/', null).focus?.view).toEqual({ project: 'project x' })
  })

  test('unknown app, extra segments and unknown names are not found', () => {
    for (const path of ['/nope', '/contact/extra', '/finder/a/b/c', '/photos/missing']) {
      expect(parseRoute(path, null, known)).toMatchObject({ focus: null, notFound: true })
    }
    expect(parseRoute('/notes/missing', null, known).notFound).toBe(true)
    expect(parseRoute('/finder/missing', null, known).notFound).toBe(true)
    expect(parseRoute('/finder/project-x/missing.pdf', null, known).notFound).toBe(true)
  })

  test('without content knowledge only the shape is checked', () => {
    expect(parseRoute('/finder/anything/file.pdf').notFound).toBe(false)
  })

  test('the with list opens other apps, ignoring unknown names, repeats and the focused app', () => {
    expect(parseRoute('/finder/project-x', 'notes,music', known).others).toEqual(['notes', 'music'])
    expect(parseRoute('/finder', 'notes,bogus,notes,finder,,music').others).toEqual(['notes', 'music'])
    expect(parseWith(undefined)).toEqual([])
  })

  test('the with list still applies to a not-found path', () => {
    expect(parseRoute('/nope', 'music')).toMatchObject({ notFound: true, others: ['music'] })
  })
})

describe('buildRoute', () => {
  const w = (app: any, view = {}, extra = {}) => ({ app, view, state: 'normal' as const, overlay: false, ...extra })

  test('pathFor mirrors the app view and hides the first-load Notes', () => {
    expect(pathFor(w('finder', { project: 'p', file: 'a.pdf' }))).toBe('/finder/p/a.pdf')
    expect(pathFor(w('finder', { file: 'orphan.pdf' }))).toBe('/finder')
    expect(pathFor(w('notes', {}, { overlay: true }))).toBe('/')
    expect(pathFor(w('notes', { note: 'about-me' }))).toBe('/notes/about-me')
  })

  test('focused path plus a with list of the other visible windows on desktop', () => {
    const list = [w('notes'), w('music'), w('finder', { project: 'x' })]
    expect(buildRoute(list, list[2]!, true)).toEqual({ path: '/finder/x', query: { with: 'notes,music' } })
  })

  test('minimized windows and small screens are left out of with', () => {
    const list = [w('notes', {}, { state: 'minimized' }), w('music'), w('finder')]
    expect(buildRoute(list, list[2]!, true).query).toEqual({ with: 'music' })
    expect(buildRoute(list, list[2]!, false).query).toEqual({})
  })

  test('no focused window is the home path', () => {
    expect(buildRoute([], null, true)).toEqual({ path: '/', query: {} })
  })

  test('the first-load Notes keeps the URL at / only while it is the only window', () => {
    const alone = [w('notes', {}, { overlay: true })]
    expect(buildRoute(alone, alone[0]!, true)).toEqual({ path: '/', query: {} })
    const list = [w('music'), w('notes', {}, { overlay: true })]
    expect(buildRoute(list, list[1]!, true)).toEqual({ path: '/notes', query: { with: 'music' } })
    const minimized = [w('music', {}, { state: 'minimized' }), w('notes', {}, { overlay: true })]
    expect(buildRoute(minimized, minimized[1]!, true)).toEqual({ path: '/', query: {} })
  })
})
