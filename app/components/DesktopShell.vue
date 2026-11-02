<script setup lang="ts">
import { WIDGET_SURFACE, type WidgetId } from '~/utils/widgets'
import { WIDGET_SPECS, defaultLayout, heightFor, heightOf, sizeFor, snapDrop, widthOf, type Layout, type Metrics, type Place } from '~/utils/widget-layout'
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
// 12-column grid, 24px gutters, widgets placed per the Penpot Home / xl board. Widgets resize
// between the columns of the "Widget Sizes" board and can be dragged onto free space only.
// The arrangement is not kept: a reload returns every widget to its default place and size.
const GUTTER = 24
const WIDGET_AREA_TOP = 60
// Room kept clear at the bottom of the screen for the dock.
const DOCK_RESERVE = 100
const grid = ref<HTMLElement>()
const layout = ref<Layout>(defaultLayout())
const metrics = reactive<Metrics>({ colWidth: (1280 - 64 - 11 * GUTTER) / 12, gutter: GUTTER, maxBottom: 820 - WIDGET_AREA_TOP - DOCK_RESERVE })
const measure = () => {
  if (grid.value) metrics.colWidth = (grid.value.clientWidth - 11 * GUTTER) / 12
  metrics.maxBottom = window.innerHeight - WIDGET_AREA_TOP - DOCK_RESERVE
}
onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})
onUnmounted(() => window.removeEventListener('resize', measure))

// While a widget is dragged it follows the pointer; a ghost shows the slot it would snap to.
const drag = ref<{ id: WidgetId, dx: number, dy: number, target: Place, free: boolean } | null>(null)
let justDragged = false
const DRAG_THRESHOLD = 6

function startDrag(id: WidgetId, e: PointerEvent) {
  if (e.button !== 0) return
  const widget = e.currentTarget as HTMLElement
  const startX = e.clientX
  const startY = e.clientY
  const origin = widget.getBoundingClientRect()
  const area = grid.value!.getBoundingClientRect()
  let moving = false
  const move = (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    if (!moving && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    moving = true
    const { place, free } = snapDrop(id, origin.left - area.left + dx, origin.top - area.top + dy, layout.value, metrics)
    drag.value = { id, dx, dy, target: place, free }
  }
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    const d = drag.value
    drag.value = null
    if (!moving) return
    // The click that ends a drag must not activate the widget under the pointer.
    justDragged = true
    setTimeout(() => { justDragged = false })
    if (d?.free) {
      layout.value.places[id] = d.target
    }
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}
const swallowClick = (e: MouseEvent) => {
  if (!justDragged) return
  e.stopPropagation()
  e.preventDefault()
}

const placed = computed(() => WIDGET_SPECS.map((spec) => {
  const span = layout.value.spans[spec.id]
  const place = layout.value.places[spec.id]
  const size = sizeFor(spec.id, span)
  const height = heightFor(spec.id, size, widthOf(span, metrics))
  return {
    spec,
    size,
    style: {
      gridColumn: `${place.col} / span ${span}`,
      marginTop: `${place.top}px`,
      height: height === null ? undefined : `${height}px`
    }
  }
}))
const ghost = computed(() => {
  const d = drag.value
  if (!d) return null
  const span = layout.value.spans[d.id]
  const height = heightOf(d.id, sizeFor(d.id, span), widthOf(span, metrics))
  return { free: d.free, style: { gridColumn: `${d.target.col} / span ${span}`, marginTop: `${d.target.top}px`, height: `${height}px` } }
})
</script>

<template>
  <div data-testid="desktop" class="bg-wallpaper fixed inset-0 overflow-hidden" @click="onDesktopClick">
    <MenuBar />
    <div ref="grid" data-testid="widget-grid" class="absolute inset-x-8 top-[60px] grid grid-cols-12 gap-x-6">
      <div
        v-for="w in placed"
        :key="w.spec.id"
        :data-widget="w.spec.id"
        :data-size="w.size"
        :data-dragging="drag?.id === w.spec.id"
        :class="[WIDGET_SURFACE[w.spec.id], drag?.id === w.spec.id ? 'z-20 cursor-grabbing opacity-90 shadow-2xl' : 'cursor-grab', 'group relative row-start-1 touch-none select-none self-start overflow-hidden rounded-card']"
        :style="[w.style, drag?.id === w.spec.id ? { transform: `translate(${drag.dx}px, ${drag.dy}px)` } : {}]"
        @pointerdown="startDrag(w.spec.id, $event)"
        @click.capture="swallowClick"
      >
        <HomeWidget :id="w.spec.id" :size="w.size" />
      </div>
      <div
        v-if="ghost"
        data-testid="widget-ghost"
        :data-free="ghost.free"
        :class="[ghost.free ? 'border-ink/40 bg-ink/5' : 'border-[#e0483e] bg-[#e0483e]/10', 'pointer-events-none row-start-1 self-start rounded-card border-2 border-dashed']"
        :style="ghost.style"
      />
    </div>
    <TransitionGroup :css="false" @enter="onEnter" @leave="onLeave">
      <DesktopWindow v-for="(win, i) in wm.visible.value" :key="win.app" :window="win" :z="10 + i" />
    </TransitionGroup>
    <Dock />
    <NotFoundNotice />
  </div>
</template>
