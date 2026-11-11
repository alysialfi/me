<script setup lang="ts">
import { DOCK_ORDER } from '~/utils/apps'
import { WIDGET_SURFACE, type WidgetId } from '~/utils/widgets'

// iPadOS (md) and iOS (below md) home screens, driven by Tailwind breakpoints.
const wm = useWindowManager()
const sheets = computed(() => wm.visible.value.filter(w => wm.presentation(w) === 'sheet'))
const overlays = computed(() => wm.visible.value.filter(w => wm.presentation(w) === 'overlay'))
// Below sm the widgets form three swipeable pages (Penpot Home / base / Page 1, Page 2 and the coffee page); from sm up they share one grid.
const pages = [
  [
    { id: 'clock', cls: 'h-[76px] sm:col-span-1 sm:h-[140px]' },
    { id: 'calendar', cls: 'h-[314px] sm:col-span-1 sm:h-[300px]' },
    { id: 'photo-carousel', cls: 'h-[200px] sm:col-span-1 sm:h-[140px]' }
  ],
  [
    { id: 'notes', cls: 'min-h-[337px] max-sm:flex-1 sm:col-span-1 sm:h-[321px]' },
    { id: 'music', cls: 'h-[200px] sm:h-[170px] sm:col-span-2' }
  ],
  // Phone only: from sm up the coffee widget has no place in the two-column grid.
  [
    { id: 'coffee', cls: 'aspect-square w-full max-w-[360px] self-center' }
  ]
]
const page = ref(0)
const onScroll = (e: Event) => {
  const el = e.currentTarget as HTMLElement
  page.value = Math.round(el.scrollLeft / el.clientWidth)
}
</script>

<template>
  <div data-testid="touch-home" class="bg-wallpaper fixed inset-0 overflow-y-auto overflow-x-hidden">
    <StatusBar />
    <div
      data-testid="widget-grid"
      class="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] max-sm:h-full sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-6 sm:pb-[140px] sm:pt-[60px] md:gap-6 md:px-8"
      @scroll.passive="onScroll"
    >
      <div v-for="(group, i) in pages" :key="i" data-testid="home-page" :class="[group[0]?.id === 'coffee' ? 'sm:hidden' : 'sm:contents', 'flex w-full shrink-0 snap-center flex-col gap-4 px-4 pb-[130px] pt-[60px] max-sm:overflow-y-auto']">
        <div v-for="w in group" :key="w.id" :data-widget="w.id" :class="[w.cls, WIDGET_SURFACE[w.id as WidgetId], 'overflow-hidden rounded-card']">
          <HomeWidget :id="w.id as WidgetId" />
        </div>
      </div>
    </div>
    <div data-testid="page-dots" class="pointer-events-none fixed bottom-[116px] left-1/2 flex -translate-x-1/2 gap-2 sm:hidden" aria-hidden="true">
      <i v-for="n in pages.length" :key="n" :class="[page === n - 1 ? 'bg-ink/90' : 'bg-ink/30', 'block size-2 rounded-full']" />
    </div>

    <nav data-testid="dock" aria-label="Dock" class="glass fixed bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[20px] p-2 min-[380px]:gap-3 min-[380px]:p-3 sm:bottom-6 sm:gap-3 sm:rounded-[18px] sm:px-3 sm:py-2">
      <AppIcon v-for="id in DOCK_ORDER" :key="id" :app="id" size="adaptive" @click="wm.open(id)" />
    </nav>

    <AppOverlay v-for="w in overlays" :key="w.app" :window="w" />
    <AppSheet v-for="w in sheets" :key="w.app" :window="w" />
    <NotFoundNotice />
  </div>
</template>
