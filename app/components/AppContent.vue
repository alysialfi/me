<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

defineProps<{ window: AppWindow }>()
</script>

<template>
  <div class="p-md text-md">{{ APPS[window.app].title }}</div>
</template>
