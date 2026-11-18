<script setup lang="ts">
import { widget, type WidgetId } from '~/utils/widgets'
import { DEFAULT_METRICS, defaultBoard, ghost as ghostOf, layout, measure as measureBoard, movePointer, pressWidget, release, type Board, type Geometry, type Metrics } from '~/utils/desktop-board'
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
// 12-column grid, 24px gutters, widgets placed per the Penpot Home / xl board (see utils/desktop-board).
// Widgets can be dragged onto free space only; a reload returns every widget to its default place.
const grid = ref<HTMLElement>()
const board = ref<Board>(defaultBoard())
const metrics = ref<Metrics>(DEFAULT_METRICS)
const measure = () => {
  metrics.value = measureBoard(grid.value?.clientWidth ?? 1280 - 64, window.innerHeight)
}
onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})
onUnmounted(() => window.removeEventListener('resize', measure))

// While a widget is dragged it follows the pointer; a ghost shows the slot it would snap to.
let justDragged = false
function startDrag(id: WidgetId, e: PointerEvent) {
  if (e.button !== 0) return
  const origin = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const area = grid.value!.getBoundingClientRect()
  board.value = pressWidget(board.value, id, { x: e.clientX, y: e.clientY }, { x: origin.left - area.left, y: origin.top - area.top })
  const move = (ev: PointerEvent) => {
    board.value = movePointer(board.value, { x: ev.clientX, y: ev.clientY }, metrics.value)
  }
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    const r = release(board.value)
    board.value = r.board
    if (!r.wasDrag) return
    // The click that ends a drag must not activate the widget under the pointer.
    justDragged = true
    setTimeout(() => { justDragged = false })
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

const styleOf = (g: Geometry) => ({ gridColumn: `${g.col} / span ${g.span}`, marginTop: `${g.top}px`, height: `${g.height}px` })
const dragging = computed(() => board.value.drag?.moving ? board.value.drag : null)
const placed = computed(() => layout(board.value, metrics.value).map(g => ({ id: g.id, style: styleOf(g) })))
const ghost = computed(() => {
  const g = ghostOf(board.value, metrics.value)
  return g && { free: g.free, style: styleOf(g) }
})
</script>

<template>
  <div data-testid="desktop" class="bg-wallpaper fixed inset-0 overflow-hidden" @click="onDesktopClick">
    <MenuBar />
    <div ref="grid" data-testid="widget-grid" class="absolute inset-x-8 top-[60px] grid grid-cols-12 gap-x-6">
      <div
        v-for="w in placed"
        :key="w.id"
        :data-widget="w.id"
        :data-dragging="dragging?.id === w.id"
        :class="[widget(w.id).surface, dragging?.id === w.id ? 'z-20 cursor-grabbing opacity-90 shadow-2xl' : 'cursor-grab', 'group relative row-start-1 touch-none select-none self-start overflow-hidden rounded-card']"
        :style="[w.style, dragging?.id === w.id ? { transform: `translate(${dragging.dx}px, ${dragging.dy}px)` } : {}]"
        @pointerdown="startDrag(w.id, $event)"
        @click.capture="swallowClick"
      >
        <HomeWidget :id="w.id" />
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
