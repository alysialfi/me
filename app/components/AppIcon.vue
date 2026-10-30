<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppId } from '~/utils/window-manager'

// lg = 44px (desktop and iPadOS dock); sm = 64px (iOS); adaptive = 64px, 44px from the sm breakpoint.
withDefaults(defineProps<{ app: AppId, running?: boolean, size?: 'lg' | 'sm' | 'adaptive' }>(), { running: false, size: 'lg' })
const SIZES = {
  lg: 'size-11 rounded-[10px]',
  sm: 'size-16 rounded-[20px]',
  adaptive: 'size-16 rounded-[20px] sm:size-11 sm:rounded-[10px]'
}
</script>

<template>
  <button type="button" :data-app="app" :aria-label="APPS[app].title" class="group relative flex flex-col items-center">
    <span :class="[SIZES[size], 'relative block overflow-hidden bg-white shadow-icon']">
      <img :src="APPS[app].icon" alt="" class="size-full" draggable="false">
      <span class="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-100 group-active:opacity-100" data-testid="icon-press" aria-hidden="true" />
    </span>
    <span v-if="running" data-testid="running-indicator" class="absolute -bottom-2 size-1 rounded-full bg-ink" />
  </button>
</template>
