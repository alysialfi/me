export type HistoryKind = 'education' | 'work'
export interface HistoryEntry { title: string, start: number, end: number | 'present', kind: HistoryKind }
export interface YearGroup { year: number, entries: HistoryEntry[] }

// Content stores year fields as text and `present` JSON-quoted; read them back as numbers.
export function normalizeEntry(row: { title: string, start: unknown, end: unknown, kind: HistoryKind }): HistoryEntry {
  const end = String(row.end).replace(/^"|"$/g, '')
  return { title: row.title, start: Number(row.start), end: end === 'present' ? 'present' : Number(end), kind: row.kind }
}

export const periodText = (e: HistoryEntry) => `${e.start} – ${e.end === 'present' ? 'now' : e.end}`

// Newest year first; inside a year, the latest start first.
export function groupByYear(entries: HistoryEntry[]): YearGroup[] {
  const byYear = new Map<number, HistoryEntry[]>()
  for (const e of entries) byYear.set(e.start, [...(byYear.get(e.start) ?? []), e])
  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({ year, entries: list.sort((a, b) => a.title.localeCompare(b.title)) }))
}
