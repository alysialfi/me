// macOS genie, as traced from a screen recording of a Photos window minimizing:
// first the window bends (top edge fixed, bottom edge narrows onto the dock icon, sides
// curve into an S), then the funnel slides down into the icon. Restoring plays it backwards.
export interface Box { left: number, top: number, width: number, height: number }
// `x`/`width` span the strip's widest edge; `top`/`bottom` are the [left, right] edges at its
// top and bottom, so the strip can be trimmed to a trapezoid and the funnel sides stay smooth.
export interface Strip { x: number, y: number, width: number, height: number, top: [number, number], bottom: [number, number] }

export const GENIE_MS = 500
export const GENIE_STRIPS = 32
// Share of the animation spent bending before the slide starts.
const BEND = 0.4

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Where each horizontal strip of `win` sits at progress `p` (0 = open, 1 = inside `icon`).
export function genieStrips(win: Box, icon: Box, p: number, n = GENIE_STRIPS): Strip[] {
  const bend = ease(clamp(p / BEND))
  const slide = ease(clamp((p - BEND) / (1 - BEND)))
  const sink = icon.top + icon.height / 2
  const top = lerp(win.top, sink, slide)
  const bottom = lerp(win.top + win.height, sink, bend)
  const span = Math.max(sink - win.top, 1)
  const step = (bottom - top) / n
  // The pull toward the icon grows with how far down the screen an edge is.
  const edges = (y: number): [number, number] => {
    const u = clamp((y - win.top) / span)
    const pull = bend * u * u * (3 - 2 * u)
    return [lerp(win.left, icon.left, pull), lerp(win.left + win.width, icon.left + icon.width, pull)]
  }
  return Array.from({ length: n }, (_, i) => {
    const y = top + step * i
    const t = edges(y)
    const b = edges(y + step)
    const x = Math.min(t[0], b[0])
    return { x, y, width: Math.max(t[1], b[1]) - x, height: step, top: t, bottom: b }
  })
}
