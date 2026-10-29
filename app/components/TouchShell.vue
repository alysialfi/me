<script setup lang="ts">
import { DOCK_ORDER } from '~/utils/apps'

// iPadOS (md) and iOS (below md) home screens, driven by Tailwind breakpoints.
const wm = useWindowManager()
const sheets = computed(() => wm.visible.value.filter(w => wm.presentation(w) === 'sheet'))
const overlays = computed(() => wm.visible.value.filter(w => wm.presentation(w) === 'overlay'))
const widgets = [
  { id: 'clock', cls: 'col-span-1 h-[140px]' },
  { id: 'photo-carousel', cls: 'col-span-1 h-[140px]' },
  { id: 'calendar', cls: 'col-span-2 sm:col-span-1 h-[300px]' },
  { id: 'notes', cls: 'col-span-2 sm:col-span-1 h-[321px]' },
  { id: 'music', cls: 'col-span-2 h-[170px]' }
]
</script>

<template>
  <div data-testid="touch-home" class="bg-wallpaper fixed inset-0 overflow-y-auto overflow-x-hidden">
    <StatusBar />
    <div data-testid="widget-grid" class="grid grid-cols-2 gap-3 px-4 pb-[120px] pt-[60px] sm:gap-4 sm:px-6 md:gap-6 md:px-8 md:pb-[140px]">
      <div v-for="w in widgets" :key="w.id" :data-widget="w.id" :class="[w.cls, 'glass rounded-card']" />
      <div data-testid="app-grid" class="col-span-2 mt-3 flex gap-5 sm:hidden">
        <AppIcon v-for="id in (['music', 'vscode'] as const)" :key="id" :app="id" size="sm" @click="wm.open(id)" />
      </div>
    </div>


    <nav data-testid="dock" aria-label="Dock" class="glass fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-[28px] p-3 sm:bottom-6 sm:gap-[18px] sm:rounded-card sm:px-[19px] sm:py-[11px]">
      <AppIcon v-for="id in DOCK_ORDER" :key="id" :app="id" size="adaptive" :class="{ 'max-sm:hidden': id === 'music' || id === 'vscode' }" @click="wm.open(id)" />
    </nav>

    <AppOverlay v-for="w in overlays" :key="w.app" :window="w" />
    <AppSheet v-for="w in sheets" :key="w.app" :window="w" />
    <NotFoundNotice />
  </div>
</template>
