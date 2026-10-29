<script setup lang="ts">
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow }>()
const wm = useWindowManager()
const { notes, aboutSlug } = await useNotes()

const slug = computed(() => props.window.view.note ?? aboutSlug.value)
const { data: note } = await useAsyncData(() => `note-${slug.value}`, () =>
  slug.value ? queryCollection('notes').where('stem', '=', `notes/${slug.value}`).first() : Promise.resolve(null),
{ watch: [slug] })

// Narrow containers (phones) show the list or the note, wide ones both.
const showList = ref(false)
const select = (s: string) => { wm.open('notes', { note: s }); showList.value = false }
const formatDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="@container h-full" data-testid="notes-app">
    <div class="flex h-full">
      <nav
        data-testid="note-list"
        :class="[showList ? 'flex' : 'hidden @md:flex', 'w-full shrink-0 flex-col overflow-auto bg-card @md:w-56']"
      >
        <button
          v-for="n in notes"
          :key="n.slug"
          type="button"
          :data-note="n.slug"
          :aria-current="n.slug === slug ? 'true' : undefined"
          :class="[n.slug === slug ? 'bg-accent-pink/60' : '', 'flex min-h-11 flex-col items-start gap-0.5 border-b border-ink/10 px-sm py-xs text-left']"
          @click="select(n.slug)"
        >
          <span class="text-md font-bold">{{ n.title }}</span>
          <span class="text-xs text-ink/70">{{ formatDate(n.date) }}</span>
        </button>
      </nav>
      <article :class="[showList ? 'hidden @md:block' : 'block', 'min-w-0 flex-1 overflow-auto p-md']" data-testid="note-body">
        <button type="button" data-testid="note-back" class="mb-xs min-h-11 text-md font-semibold @md:hidden" @click="showList = true">‹ Notes</button>
        <ContentRenderer v-if="note" :value="note" class="note-prose space-y-sm text-md leading-relaxed" />
      </article>
    </div>
  </div>
</template>

<style>
.note-prose h1 { font-size: var(--text-4xl); font-weight: 700; }
.note-prose img { max-width: 100%; border-radius: var(--radius-window); }
</style>
