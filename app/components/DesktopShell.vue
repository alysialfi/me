<script setup lang="ts">
import { WIDGET_SURFACE, type WidgetId } from '~/utils/widgets'
import { GENIE_MS, GENIE_STRIPS, genieStrips } from '~/utils/genie'
const wm = useWindowManager()

// Genie effect (see utils/genie): the window is drawn as horizontal strips of static copies,
// each squeezed onto its place in the funnel, while the real window stays hidden underneath.
function stripCopy(win: HTMLElement, scrolled: [number, number, number][]) {
  const copy = win.cloneNode(true) as HTMLElement
  const all = copy.querySelectorAll<HTMLElement>('*')
  for (const [i, top, left] of scrolled) Object.assign(all[i]!, { scrollTop: top, scrollLeft: left })
  // Embeds would reload or replay inside every copy.
  copy.querySelectorAll('iframe, video, audio, object, embed').forEach(e => e.replaceWith(document.createElement('div')))
  for (const e of [copy, ...copy.querySelectorAll('[data-window], [data-testid], [id]')]) {
    e.removeAttribute('data-window'); e.removeAttribute('data-testid'); e.removeAttribute('id')
  }
  copy.style.cssText += ';left:0;top:0;margin:0;visibility:visible;transform-origin:0 0;will-change:transform'
  return copy
}
function genie(el: Element, direction: 'in' | 'out', done: () => void) {
  const win = el as HTMLElement
  const icon = document.querySelector<HTMLElement>(`[data-testid="dock"] [data-app="${win.dataset.window}"]`)
  if (!icon || !win.parentElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return done()
  const box = win.getBoundingClientRect()
  const target = icon.getBoundingClientRect()
  const scrolled: [number, number, number][] = []
  win.querySelectorAll<HTMLElement>('*').forEach((e, i) => { if (e.scrollTop || e.scrollLeft) scrolled.push([i, e.scrollTop, e.scrollLeft]) })
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.inert = true
  layer.style.cssText = 'position:fixed;inset:0;z-index:999;pointer-events:none;overflow:hidden'
  const band = box.height / GENIE_STRIPS
  const copies = Array.from({ length: GENIE_STRIPS }, () => layer.appendChild(stripCopy(win, scrolled)))
  win.parentElement.appendChild(layer)
  win.style.visibility = 'hidden'
  win.dataset.genie = direction
  const start = performance.now()
  const frame = (now: number) => {
    const t = Math.min((now - start) / GENIE_MS, 1)
    genieStrips(box, target, direction === 'out' ? t : 1 - t).forEach((s, i) => {
      const sx = s.width / box.width
      const sy = s.height / band
      // Trim the copy to this strip's trapezoid, in its own (untransformed) pixels.
      const lx = (x: number) => `${((x - s.x) / sx).toFixed(1)}px`
      const y0 = `${i * band - 0.5}px`
      const y1 = `${(i + 1) * band + 0.5}px`
      const copy = copies[i]!
      copy.style.clipPath = `polygon(${lx(s.top[0])} ${y0}, ${lx(s.top[1])} ${y0}, ${lx(s.bottom[1])} ${y1}, ${lx(s.bottom[0])} ${y1})`
      copy.style.transform = `matrix(${sx}, 0, 0, ${sy}, ${s.x}, ${s.y - sy * i * band})`
    })
    if (t < 1) return requestAnimationFrame(frame)
    layer.remove()
    win.style.visibility = ''
    delete win.dataset.genie
    done()
  }
  frame(start)
}
// Windows restored on page load (first-load Notes, direct links) appear without animating.
let mountedAt = Infinity
onMounted(() => { mountedAt = performance.now() })
// A click on the bare desktop (wallpaper or the gaps around the widgets) minimizes every window.
const onDesktopClick = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (t === e.currentTarget || t.dataset.testid === 'widget-grid') wm.minimizeAll()
}
const onEnter = (el: Element, done: () => void) => performance.now() - mountedAt < 800 ? done() : genie(el, 'in', done)
// Only minimizing animates out; closing, or a resize to a touch layout, removes the window at once.
const onLeave = (el: Element, done: () => void) => {
  const w = wm.windows.value.find(x => x.app === (el as HTMLElement).dataset.window)
  if (w?.state === 'minimized') genie(el, 'out', done)
  else done()
}
// 12-column grid, 24px gutters, widgets placed per the Penpot Home / xl board.
const widgets = [
  { id: 'clock', cls: 'col-span-2 col-start-1', top: 0, h: 120 },
  { id: 'photo-carousel', cls: 'col-span-3 col-start-1', top: 144, h: 315 },
  { id: 'calendar', cls: 'col-span-4 col-start-6', top: 0, h: 300 },
  { id: 'notes', cls: 'col-span-3 col-start-10', top: 0, h: 321 },
  { id: 'music', cls: 'col-span-4 col-start-9', top: 345, h: 170 }
]
</script>

<template>
  <div data-testid="desktop" class="bg-wallpaper fixed inset-0 overflow-hidden" @click="onDesktopClick">
    <MenuBar />
    <div data-testid="widget-grid" class="absolute inset-x-8 top-[60px] grid grid-cols-12 gap-x-6">
      <div
        v-for="w in widgets"
        :key="w.id"
        :data-widget="w.id"
        :class="[w.cls, WIDGET_SURFACE[w.id as WidgetId], 'row-start-1 self-start overflow-hidden rounded-card']"
        :style="{ marginTop: `${w.top}px`, height: `${w.h}px` }"
      >
        <HomeWidget :id="w.id as WidgetId" />
      </div>
    </div>
    <TransitionGroup :css="false" @enter="onEnter" @leave="onLeave">
      <DesktopWindow v-for="(win, i) in wm.visible.value" :key="win.app" :window="win" :z="10 + i" />
    </TransitionGroup>
    <Dock />
    <NotFoundNotice />
  </div>
</template>
