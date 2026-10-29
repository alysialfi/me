<script setup lang="ts">
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow }>()
const wm = useWindowManager()
const { photos } = await usePhotos()

const ALBUMS = [
  { id: 'all', label: 'All', kind: undefined },
  { id: 'personal', label: 'Personal', kind: 'personal' },
  { id: 'projects', label: 'Projects', kind: 'project' }
] as const

const album = computed(() => ALBUMS.find(a => a.id === props.window.view.album) ?? ALBUMS[0])
const shown = computed(() => photos.value.filter(p => !album.value.kind || p.kind === album.value.kind))
const open = ref<string | null>(null)
const current = computed(() => shown.value.find(p => p.id === open.value))
const select = (id: string) => { open.value = null; wm.open('photos', { album: id }) }
</script>

<template>
  <div class="relative flex h-full flex-col" data-testid="photos-app">
    <nav class="flex shrink-0 gap-xs border-b border-ink/10 px-sm py-xs" aria-label="Albums">
      <button
        v-for="a in ALBUMS"
        :key="a.id"
        type="button"
        :data-album="a.id"
        :aria-current="a.id === album.id ? 'true' : undefined"
        :class="[a.id === album.id ? 'bg-accent-green' : 'bg-card', 'min-h-11 rounded-icon px-sm text-md font-semibold']"
        @click="select(a.id)"
      >{{ a.label }}</button>
    </nav>

    <ul class="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(130px,1fr))] content-start gap-xs overflow-auto p-sm" data-testid="photo-grid">
      <li v-for="p in shown" :key="p.id">
        <button type="button" :data-photo="p.id" class="block min-h-11 w-full overflow-hidden rounded-window" :aria-label="p.caption" @click="open = p.id">
          <img :src="p.image" :alt="p.caption" loading="lazy" class="aspect-[4/3] w-full object-cover">
        </button>
      </li>
    </ul>

    <div v-if="current" data-testid="photo-large" class="absolute inset-0 z-10 flex flex-col bg-white">
      <header class="flex min-h-11 shrink-0 items-center gap-xs border-b border-ink/10 px-sm">
        <button type="button" data-testid="photo-close" class="min-h-11 pr-xs text-md font-semibold" @click="open = null">‹ Close</button>
        <span class="truncate text-md font-bold" data-testid="photo-caption">{{ current.caption }}</span>
      </header>
      <div class="flex min-h-0 flex-1 items-center justify-center bg-card p-sm">
        <img :src="current.image" :alt="current.caption" class="max-h-full max-w-full object-contain">
      </div>
    </div>
  </div>
</template>
