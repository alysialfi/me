import { expect, test } from 'vitest'
import { linkKind, signalBars, wifiArcs } from '../../app/utils/network'

test('signal bars follow the connection quality', () => {
  expect(signalBars('slow-2g')).toBe(1)
  expect(signalBars('2g')).toBe(1)
  expect(signalBars('3g')).toBe(2)
  expect(signalBars('4g', 2)).toBe(3)
  expect(signalBars('4g', 20)).toBe(4)
  expect(signalBars('4g')).toBe(4)
})

test('the link kind comes from the connection type', () => {
  expect(linkKind('wifi')).toBe('wifi')
  expect(linkKind('cellular')).toBe('cellular')
  expect(linkKind('ethernet')).toBe('wired')
  expect(linkKind(undefined)).toBe('unknown')
})

test('three wifi arcs stand for four signal levels', () => {
  expect([0, 1, 2, 3, 4].map(wifiArcs)).toEqual([0, 1, 2, 2, 3])
})
