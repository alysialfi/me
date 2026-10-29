<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppId } from '~/utils/window-manager'

// lg = 75px (desktop dock); sm = 64px (iOS); adaptive = 64px, 75px from the sm breakpoint.
withDefaults(defineProps<{ app: AppId, running?: boolean, size?: 'lg' | 'sm' | 'adaptive' }>(), { running: false, size: 'lg' })
const SIZES = {
  lg: 'size-[75px] rounded-card',
  sm: 'size-16 rounded-[20px]',
  adaptive: 'size-16 rounded-[20px] sm:size-[75px] sm:rounded-card'
}
</script>

<template>
  <button type="button" :data-app="app" :aria-label="APPS[app].title" class="relative flex flex-col items-center">
    <span :class="[SIZES[size], 'block overflow-hidden bg-white shadow-icon']">
      <img :src="APPS[app].icon" alt="" class="size-full" draggable="false">
    </span>
    <span v-if="running" data-testid="running-indicator" class="absolute -bottom-2 size-1 rounded-full bg-ink" />
  </button>
</template>
