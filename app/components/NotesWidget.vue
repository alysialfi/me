<script setup lang="ts">
const wm = useWindowManager()
const { notes } = await useNotes()
const formatDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="flex h-full flex-col gap-[10px] overflow-y-auto px-[14px] py-[16px]" data-testid="notes-widget">
    <button type="button" class="flex min-h-11 shrink-0 items-center gap-[10px] lg:min-h-8" aria-label="Open Notes" data-testid="notes-widget-header" @click="wm.open('notes')">
      <span class="flex size-8 shrink-0 flex-col justify-center gap-[4px] rounded-full bg-[#e9983a] px-[9px]" aria-hidden="true">
        <i v-for="n in 3" :key="n" class="block h-0.5 rounded-full bg-white" />
      </span>
      <span class="flex-1 text-left text-lg font-semibold text-[#e9983a]">Notes</span>
      <span class="text-3xl font-bold text-[#1f2a29]" data-testid="notes-count">{{ notes.length }}</span>
    </button>
    <template v-for="(n, i) in notes" :key="n.slug">
      <hr v-if="i > 0" class="border-0 border-t border-[#e6e6e6]">
      <button type="button" :data-note="n.slug" class="flex min-h-11 shrink-0 flex-col items-start gap-0.5 text-left" @click="wm.open('notes', { note: n.slug })">
        <span class="text-base text-[#1f2a29]">{{ n.title }}</span>
        <span class="text-xs text-[#8a9291]">{{ formatDate(n.date) }}</span>
      </button>
    </template>
  </div>
</template>
