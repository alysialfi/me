<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow, z: number }>()
const wm = useWindowManager()
const { onPointerDown: startDrag } = useWindowDrag(props.window.app)
const { $posthog } = useNuxtApp()
const closeWindow = () => {
  $posthog?.logger.info('desktop window closed', {
    app: props.window.app,
  })
  wm.close(props.window.app)
}
const style = computed(() => ({
  left: `${props.window.rect.x}px`,
  top: `${props.window.rect.y}px`,
  width: `${props.window.rect.w}px`,
  height: `${props.window.rect.h}px`,
  zIndex: props.z
}))
</script>

<template>
  <section
    :data-window="window.app"
    data-presentation="window"
    :aria-label="APPS[window.app].title"
    class="absolute flex flex-col overflow-hidden rounded-window bg-white shadow-card"
    :style="style"
    @pointerdown="wm.focus(window.app)"
  >
    <header class="flex h-10 shrink-0 cursor-default touch-none select-none items-center gap-xs bg-card px-sm" data-testid="title-bar" @pointerdown="startDrag">
      <div class="group flex items-center gap-xs">
        <button type="button" aria-label="Close" data-control="close" class="size-3 rounded-full bg-[#ff5f57]" @click.stop="closeWindow" />
        <button type="button" aria-label="Minimize" data-control="minimize" class="size-3 rounded-full bg-[#febc2e]" />
        <button type="button" aria-label="Full screen" data-control="fullscreen" class="size-3 rounded-full bg-[#28c840]" />
      </div>
      <span class="ml-1 text-base font-semibold">{{ APPS[window.app].title }}</span>
    </header>
    <div class="min-h-0 flex-1 overflow-auto bg-white">
      <AppContent :window="window" />
    </div>
  </section>
</template>
