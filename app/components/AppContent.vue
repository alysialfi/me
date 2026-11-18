<script setup lang="ts">
import type { Component } from 'vue'
import { ContactApp, FinderApp, MusicApp, NotesApp, PhotosApp, VsCodeApp } from '#components'
import type { AppId } from '#shared/apps'
import type { AppWindow } from '~/utils/window-manager'

defineProps<{ window: AppWindow }>()

// One view per app; a missing entry fails the type check.
const VIEWS: Record<AppId, Component> = {
  photos: PhotosApp,
  contact: ContactApp,
  notes: NotesApp,
  finder: FinderApp,
  music: MusicApp,
  vscode: VsCodeApp
}

// Apps whose view takes the window prop. The others would get it as a stray attribute.
const TAKES_WINDOW = new Set<AppId>(['notes', 'finder', 'photos'])
</script>

<template>
  <component :is="VIEWS[window.app]" v-bind="TAKES_WINDOW.has(window.app) ? { window } : {}" />
</template>
