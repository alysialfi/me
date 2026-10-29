import { expect, test } from 'vitest'
import { groupByYear, normalizeEntry, periodText, type HistoryEntry } from '../../app/utils/history'

const e = (title: string, start: number, end: HistoryEntry['end'], kind: HistoryEntry['kind'] = 'work'): HistoryEntry => ({ title, start, end, kind })

test('stored text values are read back as numbers and present', () => {
  expect(normalizeEntry({ title: 'A', start: '2019', end: '2022', kind: 'education' })).toEqual(e('A', 2019, 2022, 'education'))
  expect(normalizeEntry({ title: 'B', start: 2024, end: '"present"', kind: 'work' })).toEqual(e('B', 2024, 'present'))
  expect(normalizeEntry({ title: 'C', start: 2024, end: 'present', kind: 'work' }).end).toBe('present')
})

test('periods show the years, and an open entry runs to now', () => {
  expect(periodText(e('A', 2019, 2022))).toBe('2019 – 2022')
  expect(periodText(e('B', 2024, 'present'))).toBe('2024 – now')
})

test('entries are grouped by year, newest year first', () => {
  const groups = groupByYear([e('Old', 2019, 2022), e('New', 2024, 'present'), e('Mid', 2022, 2024), e('Also new', 2024, 2025)])
  expect(groups.map(g => g.year)).toEqual([2024, 2022, 2019])
  expect(groups[0]!.entries.map(x => x.title)).toEqual(['Also new', 'New'])
})

test('no entries gives no groups', () => {
  expect(groupByYear([])).toEqual([])
})
