<script setup lang="ts">
import { GENRES } from '~/utils/genres'
import type { WidgetSize } from '~/utils/widget-layout'

const props = withDefaults(defineProps<{ size?: WidgetSize }>(), { size: 'M' })
const audio = useAudio()
const { songs } = await useSongs()

// Shows the song that is loaded, or the first one before anything has played.
const song = computed(() => audio.state.current ?? songs.value[0])
const index = computed(() => songs.value.findIndex(s => s.id === song.value?.id))
const playing = computed(() => !!song.value && audio.isPlaying(song.value))
const progress = computed(() => audio.state.duration ? Math.min(100, (audio.state.time / audio.state.duration) * 100) : 0)

// The next songs after the one shown, wrapping around.
const upNext = computed(() => songs.value.length > 1 ? Array.from({ length: Math.min(3, songs.value.length - 1) }, (_, i) => songs.value[(Math.max(index.value, 0) + 1 + i) % songs.value.length]!) : [])

const step = (delta: number) => {
  const list = songs.value
  if (list.length) audio.play(list[(Math.max(index.value, 0) + delta + list.length) % list.length]!)
}
</script>

<template>
  <div v-if="song" class="flex h-full flex-col gap-3 px-5 py-[18px]" data-testid="music-widget">
    <div class="flex items-center gap-3">
      <img v-if="song.cover" :src="song.cover" alt="" class="size-14 shrink-0 rounded-[12px] object-cover">
      <span v-else class="size-14 shrink-0 rounded-[12px] bg-wallpaper-teal" aria-hidden="true" />
      <div class="min-w-0">
        <p class="truncate text-md font-semibold" data-testid="widget-title">{{ song.title }}</p>
        <p class="truncate text-sm">{{ song.artist }}</p>
      </div>
    </div>
    <div v-if="size !== 'S'" class="h-1 shrink-0 rounded-full bg-ink/15" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100">
      <div class="h-full rounded-full bg-wallpaper-teal" :style="{ width: `${progress}%` }" data-testid="widget-progress" />
    </div>
    <div class="flex items-center justify-center gap-7 lg:gap-7">
      <button type="button" aria-label="Previous song" data-testid="widget-prev" class="flex size-11 items-center justify-center lg:size-6" @click="step(-1)">
        <svg viewBox="0 0 10 16" class="h-4 w-2.5 fill-ink"><path d="M10 0v16L0 8z" /></svg>
      </button>
      <button type="button" :aria-label="playing ? 'Pause' : 'Play'" :data-state="playing ? 'playing' : 'paused'" data-testid="widget-play" class="flex size-11 items-center justify-center lg:size-6" @click="audio.toggle(song)">
        <svg v-if="!playing" viewBox="0 0 20 24" class="h-6 w-5 fill-ink"><path d="M0 0l20 12L0 24z" /></svg>
        <svg v-else viewBox="0 0 20 24" class="h-6 w-5 fill-ink"><path d="M1 0h6v24H1zM13 0h6v24h-6z" /></svg>
      </button>
      <button type="button" aria-label="Next song" data-testid="widget-next" class="flex size-11 items-center justify-center lg:size-6" @click="step(1)">
        <svg viewBox="0 0 10 16" class="h-4 w-2.5 fill-ink"><path d="M0 0v16l10-8z" /></svg>
      </button>
    </div>
    <div v-if="size === 'L' && upNext.length" class="flex flex-col gap-2" data-testid="up-next">
      <p class="text-xs font-semibold">Up next</p>
      <p v-for="s in upNext" :key="s.id" class="flex items-center justify-between gap-2 text-sm">
        <span class="truncate">{{ s.title }}</span>
        <span v-if="s.genre" class="shrink-0 rounded-[10px] px-2 py-0.5 text-2xs font-semibold" :style="{ backgroundColor: GENRES[s.genre].tint, color: GENRES[s.genre].ink }">{{ GENRES[s.genre].label }}</span>
      </p>
    </div>
  </div>
</template>
