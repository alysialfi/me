import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { formatDate, formatTime, startClock } from '../../app/utils/clock'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('time is hh:mm in 24 hour format and the date is short', () => {
  expect(formatTime(new Date(2024, 5, 9, 13, 51))).toBe('13:51')
  expect(formatTime(new Date(2024, 5, 9, 3, 5))).toBe('03:05')
  expect(formatDate(new Date(2024, 5, 9))).toBe('Sun, Jun 9')
})

test('the clock updates as time passes', () => {
  vi.setSystemTime(new Date(2024, 5, 9, 13, 51, 0))
  const { time, stop } = startClock()
  expect(formatTime(time.value)).toBe('13:51')
  vi.advanceTimersByTime(60_000)
  expect(formatTime(time.value)).toBe('13:52')
  vi.advanceTimersByTime(14 * 60_000)
  expect(formatTime(time.value)).toBe('14:06')
  stop()
  vi.advanceTimersByTime(60_000)
  expect(formatTime(time.value)).toBe('14:06')
})

test('rolling past midnight changes the date', () => {
  vi.setSystemTime(new Date(2024, 5, 9, 23, 59, 30))
  const { time, stop } = startClock()
  vi.advanceTimersByTime(60_000)
  expect(formatTime(time.value)).toBe('00:00')
  expect(formatDate(time.value)).toBe('Mon, Jun 10')
  stop()
})
