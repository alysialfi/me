<script setup lang="ts">
const wm = useWindowManager()
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
  <div data-testid="desktop" class="bg-wallpaper fixed inset-0 overflow-hidden">
    <MenuBar />
    <div data-testid="widget-grid" class="absolute inset-x-8 top-[60px] grid grid-cols-12 gap-x-6">
      <div
        v-for="w in widgets"
        :key="w.id"
        :data-widget="w.id"
        :class="[w.cls, 'glass row-start-1 self-start rounded-card']"
        :style="{ marginTop: `${w.top}px`, height: `${w.h}px` }"
      />
    </div>
    <DesktopWindow v-for="(win, i) in wm.visible.value" :key="win.app" :window="win" :z="10 + i" />
    <Dock />
  </div>
</template>
