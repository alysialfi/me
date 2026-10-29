<script setup lang="ts">
import { APPS } from '~/utils/apps'
import { MENU_BAR_HEIGHT } from '~/utils/window-geometry'
import { RESIZE_HANDLES } from '~/composables/useWindowResize'
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow, z: number }>()
const wm = useWindowManager()
const { onPointerDown: startDrag } = useWindowDrag(props.window.app)
const { onPointerDown: startResize } = useWindowResize(props.window.app)
const HANDLE_CLASS: Record<string, string> = {
  n: 'inset-x-2 top-0 h-1.5 cursor-ns-resize',
  s: 'inset-x-2 bottom-0 h-1.5 cursor-ns-resize',
  e: 'inset-y-2 right-0 w-1.5 cursor-ew-resize',
  w: 'inset-y-2 left-0 w-1.5 cursor-ew-resize',
  ne: 'right-0 top-0 size-4 cursor-nesw-resize',
  nw: 'left-0 top-0 size-4 cursor-nwse-resize',
  se: 'bottom-0 right-0 size-4 cursor-nwse-resize',
  sw: 'bottom-0 left-0 size-4 cursor-nesw-resize'
}
const { $posthog } = useNuxtApp()
const closeWindow = () => {
  $posthog?.logger.info('desktop window closed', {
    app: props.window.app,
  })
  wm.close(props.window.app)
}
const fullscreen = computed(() => props.window.state === 'fullscreen')
const style = computed(() => fullscreen.value
  ? { left: '0px', top: `${MENU_BAR_HEIGHT}px`, width: '100%', height: `calc(100% - ${MENU_BAR_HEIGHT}px)`, zIndex: props.z }
  : {
      left: `${props.window.rect.x}px`,
      top: `${props.window.rect.y}px`,
      width: `${props.window.rect.w}px`,
      height: `${props.window.rect.h}px`,
      zIndex: props.z
    })
</script>

<template>
  <section
    :data-window="window.app"
    data-presentation="window"
    :aria-label="APPS[window.app].title"
    :class="[fullscreen ? 'rounded-none' : 'rounded-window', 'absolute flex flex-col overflow-hidden bg-white shadow-card']"
    :style="style"
    @pointerdown="wm.focus(window.app)"
  >
    <header class="flex h-10 shrink-0 cursor-default touch-none select-none items-center gap-xs bg-card px-sm" data-testid="title-bar" @pointerdown="startDrag">
      <div class="group flex items-center gap-xs" data-testid="window-controls">
        <button type="button" aria-label="Close" data-control="close" class="flex size-3 items-center justify-center rounded-full bg-[#ff5f57] text-[9px] leading-none text-black/60" @click.stop="closeWindow">
          <span class="opacity-0 group-hover:opacity-100" data-symbol="close">×</span>
        </button>
        <button type="button" aria-label="Minimize" data-control="minimize" class="flex size-3 items-center justify-center rounded-full bg-[#febc2e] text-[9px] leading-none text-black/60" @click.stop="wm.minimize(window.app)">
          <span class="opacity-0 group-hover:opacity-100" data-symbol="minimize">−</span>
        </button>
        <button type="button" :aria-label="fullscreen ? 'Exit full screen' : 'Full screen'" data-control="fullscreen" class="flex size-3 items-center justify-center rounded-full bg-[#28c840] text-[8px] leading-none text-black/60" @click.stop="wm.toggleFullscreen(window.app)">
          <span class="opacity-0 group-hover:opacity-100" data-symbol="fullscreen">{{ fullscreen ? '↙' : '↗' }}</span>
        </button>
      </div>
      <span class="ml-1 text-base font-semibold">{{ APPS[window.app].title }}</span>
    </header>
    <div class="min-h-0 flex-1 overflow-auto bg-white">
      <AppContent :window="window" />
    </div>
    <template v-if="window.state === 'normal'">
      <div
        v-for="h in RESIZE_HANDLES"
        :key="h"
        :data-resize="h"
        :class="['absolute z-10 touch-none', HANDLE_CLASS[h]]"
        @pointerdown="startResize(h, $event)"
      />
    </template>
  </section>
</template>
