// Tailwind default breakpoints: md = 768px, lg = 1024px.
export const BREAKPOINTS = { md: 768, lg: 1024 } as const

export type ViewportMode = 'phone' | 'tablet' | 'desktop'

export function modeForWidth(width: number): ViewportMode {
  if (width >= BREAKPOINTS.lg) return 'desktop'
  if (width >= BREAKPOINTS.md) return 'tablet'
  return 'phone'
}
