<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

defineProps<{ window: AppWindow }>()
</script>

<template>
  <NotesApp v-if="window.app === 'notes'" :window="window" />
  <FinderApp v-else-if="window.app === 'finder'" :window="window" />
  <div v-else class="p-md text-md">{{ APPS[window.app].title }}</div>
</template>
