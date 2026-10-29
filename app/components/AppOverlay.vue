<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow }>()
const wm = useWindowManager()
</script>

<template>
  <section
    :data-window="props.window.app"
    :aria-label="APPS[props.window.app].title"
    data-presentation="overlay"
    class="fixed inset-x-4 top-[72px] z-[2000] mx-auto flex h-[62%] max-w-[640px] flex-col overflow-hidden rounded-window bg-white shadow-card"
  >
    <header class="flex h-12 shrink-0 items-center gap-xs bg-card px-xs">
      <button type="button" aria-label="Close" data-control="close" class="flex size-11 items-center justify-center" @click="wm.close(props.window.app)">
        <span class="size-5 rounded-full bg-[#ff5f57]" />
      </button>
      <span class="text-base font-semibold">{{ APPS[props.window.app].title }}</span>
    </header>
    <div class="min-h-0 flex-1 overflow-auto">
      <AppContent :window="props.window" />
    </div>
  </section>
</template>
