<script setup lang="ts">
import { APPS } from '~/utils/apps'
import type { AppWindow } from '~/utils/window-manager'

defineProps<{ window: AppWindow }>()
</script>

<template>
  <NotesApp v-if="window.app === 'notes'" :window="window" />
  <FinderApp v-else-if="window.app === 'finder'" :window="window" />
  <ContactApp v-else-if="window.app === 'contact'" />
  <PhotosApp v-else-if="window.app === 'photos'" :window="window" />
  <MusicApp v-else-if="window.app === 'music'" />
  <VsCodeApp v-else-if="window.app === 'vscode'" />
  <div v-else class="p-md text-md">{{ APPS[window.app].title }}</div>
</template>
