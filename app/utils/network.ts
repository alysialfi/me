export type LinkKind = 'wifi' | 'cellular' | 'wired' | 'unknown'

// How many of four signal bars to light for a connection quality, from the Network Information API.
export function signalBars(effectiveType?: string, downlink?: number): 1 | 2 | 3 | 4 {
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 1
  if (effectiveType === '3g') return 2
  return (downlink ?? 10) >= 5 ? 4 : 3
}

export function linkKind(type?: string): LinkKind {
  if (type === 'wifi') return 'wifi'
  if (type === 'cellular') return 'cellular'
  if (type === 'ethernet') return 'wired'
  return 'unknown'
}

// A wifi symbol has three arcs for the four signal levels.
export const wifiArcs = (bars: number) => [0, 1, 2, 2, 3][bars] ?? 0
