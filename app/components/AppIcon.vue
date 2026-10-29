<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppId } from '~/utils/window-manager'

defineProps<{ app: AppId, running?: boolean }>()
</script>

<template>
  <button type="button" :data-app="app" :aria-label="APPS[app].title" class="relative flex flex-col items-center">
    <span class="block size-[75px] overflow-hidden rounded-card bg-white shadow-icon">
      <img :src="APPS[app].icon" alt="" class="size-full" draggable="false">
    </span>
    <span v-if="running" data-testid="running-indicator" class="absolute -bottom-2 size-1 rounded-full bg-ink" />
  </button>
</template>
