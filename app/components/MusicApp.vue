<script setup lang="ts">
import { GENRES, formatDuration, type Genre } from '~/utils/genres'

const audio = useAudio()
const { songs } = await useSongs()

// The header shows the song that is loaded, or the first one before anything has played.
const featured = computed(() => audio.state.current ?? songs.value[0])
const genres = computed(() => (Object.keys(GENRES) as Genre[]).filter(g => songs.value.some(s => s.genre === g)))
const filter = ref<Genre | null>(null)
const shown = computed(() => songs.value.filter(s => !filter.value || s.genre === filter.value))
// Chips are 18px tall as designed; below lg the button around them grows to a 44px touch target.
const chip = 'inline-flex items-center gap-[5px] rounded-[10px] px-2 py-[3px] text-2xs font-semibold'
</script>

<template>
  <div class="flex h-full flex-col overflow-auto p-4" data-testid="music-app">
    <div v-if="featured" class="flex items-center gap-[14px] pb-[14px]" data-testid="now-playing">
      <img v-if="featured.cover" :src="featured.cover" alt="" class="size-16 shrink-0 rounded-[12px] object-cover">
      <span v-else data-testid="default-cover" class="size-16 shrink-0 rounded-[12px] bg-wallpaper-teal" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-xl font-bold" data-testid="featured-title">{{ featured.title }}</p>
        <p class="truncate text-sm text-[#8a9291]">{{ featured.artist }}</p>
      </div>
      <button type="button" :aria-label="audio.isPlaying(featured) ? 'Pause' : 'Play'" data-testid="music-play" class="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink" @click="audio.toggle(featured)">
        <svg v-if="!audio.isPlaying(featured)" viewBox="0 0 12 14" class="h-3.5 w-3 fill-white" aria-hidden="true"><path d="M0 0l12 7L0 14z" /></svg>
        <svg v-else viewBox="0 0 12 14" class="h-3.5 w-3 fill-white" aria-hidden="true"><path d="M1 0h3.5v14H1zM7.5 0H11v14H7.5z" /></svg>
      </button>
    </div>

    <nav class="flex flex-wrap items-center gap-2 py-[10px] max-lg:py-0" aria-label="Genres" data-testid="genre-filter">
      <button type="button" data-genre="all" :aria-pressed="filter === null" class="max-lg:min-h-11" @click="filter = null"><span :class="[chip, 'bg-ink text-white', filter === null ? '' : 'opacity-60']">All</span></button>
      <button v-for="g in genres" :key="g" type="button" :data-genre="g" :aria-pressed="filter === g" class="max-lg:min-h-11" @click="filter = filter === g ? null : g">
        <span :class="[chip, filter === g ? 'ring-1 ring-current' : '']" :style="{ backgroundColor: GENRES[g].tint, color: GENRES[g].ink }"><i class="size-1.5 rounded-full" :style="{ backgroundColor: GENRES[g].ink }" />{{ GENRES[g].label }}</span>
      </button>
    </nav>

    <ul class="min-h-0 border-t border-[#e6e6e6]" data-testid="song-list">
      <li v-for="(s, i) in shown" :key="s.id" class="border-b border-[#e6e6e6]">
        <button
          type="button"
          :data-song="s.id"
          :data-state="audio.isPlaying(s) ? 'playing' : 'paused'"
          :aria-label="`${audio.isPlaying(s) ? 'Pause' : 'Play'} ${s.title}`"
          class="flex min-h-11 w-full items-center gap-3 py-[7px] text-left"
          @click="audio.toggle(s)"
        >
          <span class="w-3 shrink-0 text-sm font-medium text-[#8a9291]">{{ i + 1 }}</span>
          <span class="min-w-0 flex-1">
            <span :class="[audio.state.current?.id === s.id ? 'font-bold' : 'font-medium', 'block truncate text-base']">{{ s.title }}</span>
            <span class="block truncate text-xs text-[#8a9291]">{{ s.artist }}</span>
          </span>
          <span v-if="s.genre" class="shrink-0 rounded-[10px] px-2 py-[3px] text-2xs font-semibold" :style="{ backgroundColor: GENRES[s.genre].tint, color: GENRES[s.genre].ink }" data-testid="genre-tag">{{ GENRES[s.genre].label }}</span>
          <span class="w-9 shrink-0 text-right text-sm text-[#8a9291]">{{ formatDuration(s.duration) }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
