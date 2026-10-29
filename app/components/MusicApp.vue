<script setup lang="ts">
const audio = useAudio()
const { songs } = await useSongs()
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
</script>

<template>
  <div class="flex h-full flex-col" data-testid="music-app">
    <ul class="min-h-0 flex-1 divide-y divide-ink/10 overflow-auto" data-testid="song-list">
      <li v-for="s in songs" :key="s.id">
        <button
          type="button"
          :data-song="s.id"
          :data-state="audio.isPlaying(s) ? 'playing' : 'paused'"
          :aria-label="`${audio.isPlaying(s) ? 'Pause' : 'Play'} ${s.title}`"
          :class="[audio.state.current?.id === s.id ? 'bg-accent-pink/40' : '', 'flex min-h-14 w-full items-center gap-sm px-sm py-xs text-left']"
          @click="audio.toggle(s)"
        >
          <img v-if="s.cover" :src="s.cover" alt="" class="size-11 shrink-0 rounded-window object-cover">
          <span v-else data-testid="default-cover" class="flex size-11 shrink-0 items-center justify-center rounded-window bg-accent-green text-2xl" aria-hidden="true">♪</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-md font-bold">{{ s.title }}</span>
            <span class="block truncate text-sm text-ink/70">{{ s.artist }}</span>
          </span>
          <span class="shrink-0 text-xl" aria-hidden="true">{{ audio.isPlaying(s) ? '❚❚' : '▶' }}</span>
        </button>
      </li>
    </ul>
    <footer v-if="audio.state.current" class="shrink-0 border-t border-ink/10 bg-card px-sm py-xs text-sm" data-testid="now-playing">
      {{ audio.state.playing ? 'Playing' : 'Paused' }}: {{ audio.state.current.title }}
      <span class="text-ink/70">{{ fmt(audio.state.time) }} / {{ fmt(audio.state.duration) }}</span>
    </footer>
  </div>
</template>
