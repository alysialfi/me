import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { makeSchemas } from '../../shared/content-schemas'

const s = makeSchemas(z)

const valid = {
  note: { title: 'Hi', date: '2026-01-02' },
  project: { name: 'Project X' },
  photo: { image: '/media/a.svg', caption: 'A', kind: 'personal' },
  song: { title: 'T', artist: 'A', audio: '/media/a.wav' },
  contact: { fullName: 'N', email: 'a@b.co', phone: '+1', socials: [{ label: 'GH', url: 'https://github.com/x' }] },
  snippet: { file: 'a.ts', language: 'typescript', code: 'let a = 1' },
  history: { title: 'Uni', start: 2015, end: 'present', kind: 'education' }
} as const

describe('content schemas', () => {
  test.each(Object.keys(valid))('%s accepts a complete entry', (key) => {
    expect(() => (s as any)[key].parse((valid as any)[key])).not.toThrow()
  })

  test.each(Object.keys(valid))('%s rejects entries missing each required field', (key) => {
    const schema = (s as any)[key]
    const entry = (valid as any)[key]
    const optional = new Set(['about', 'summary', 'cover'])
    for (const field of Object.keys(entry).filter(f => !optional.has(f))) {
      const { [field]: _omitted, ...rest } = entry
      expect(schema.safeParse(rest).success, `${key} without ${field}`).toBe(false)
    }
  })

  test('history end accepts a year or "present" only', () => {
    expect(s.history.safeParse({ ...valid.history, end: 2024 }).success).toBe(true)
    expect(s.history.safeParse({ ...valid.history, end: 'later' }).success).toBe(false)
  })

  test('photo kind and contact email are validated', () => {
    expect(s.photo.safeParse({ ...valid.photo, kind: 'other' }).success).toBe(false)
    expect(s.contact.safeParse({ ...valid.contact, email: 'nope' }).success).toBe(false)
  })
})
