<script setup lang="ts">
import { WIDGET_SURFACE, type WidgetId } from '~/utils/widgets'
const wm = useWindowManager()

// Genie effect: the window shrinks toward its dock icon with the dock end pinched in.
const GENIE_MS = 380
const FULL = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
// The bottom edge pulls into one bottom corner, the one on the dock icon's side of the window.
const PINCHED = { left: 'polygon(0 0, 100% 0, 18% 100%, 0 100%)', right: 'polygon(0 0, 100% 0, 100% 100%, 82% 100%)' }
function genie(el: Element, direction: 'in' | 'out', done: () => void) {
  const win = el as HTMLElement
  const icon = document.querySelector<HTMLElement>(`[data-testid="dock"] [data-app="${win.dataset.window}"]`)
  if (!icon || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return done()
  const target = icon.getBoundingClientRect()
  const ox = target.left + target.width / 2 - win.offsetLeft
  const oy = target.top + target.height / 2 - win.offsetTop
  const pinched = PINCHED[ox < win.offsetWidth / 2 ? 'left' : 'right']
  win.style.transformOrigin = `${ox}px ${oy}px`
  win.dataset.genie = direction
  const collapsed = { transform: 'scale(0.03)', clipPath: pinched, opacity: 0 }
  const open = { transform: 'scale(1)', clipPath: FULL, opacity: 1 }
  const mid = { transform: 'scale(0.55, 0.45)', clipPath: pinched, opacity: 1, offset: 0.6 }
  const frames = direction === 'out' ? [open, mid, collapsed] : [collapsed, { ...mid, offset: 0.4 }, open]
  const a = win.animate(frames, { duration: GENIE_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
  a.onfinish = a.oncancel = () => { win.style.transformOrigin = ''; delete win.dataset.genie; done() }
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
