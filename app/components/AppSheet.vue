<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow }>()
const wm = useWindowManager()
</script>

<template>
  <section :data-window="props.window.app" :aria-label="APPS[props.window.app].title" data-presentation="sheet" class="fixed inset-0 z-[2000] flex flex-col bg-white">
    <StatusBar />
    <header class="mt-11 flex h-11 shrink-0 items-center bg-card px-4">
      <button type="button" aria-label="Back" data-control="close" class="flex size-11 items-center justify-start" @click="wm.close(props.window.app)">
        <svg viewBox="0 0 9 18" class="h-[18px] w-[9px]" aria-hidden="true"><path d="M8 1L1.5 9 8 17" fill="none" stroke="#2f3b3a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <span class="flex-1 text-center text-lg font-bold">{{ APPS[props.window.app].title }}</span>
      <span class="w-11" aria-hidden="true" />
    </header>
    <div class="min-h-0 flex-1 overflow-auto">
      <AppContent :window="props.window" />
    </div>
  </section>
</template>
