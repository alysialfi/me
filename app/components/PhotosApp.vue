<script setup lang="ts">
import type { AppWindow } from '~/utils/window-manager'

defineProps<{ window: AppWindow }>()
const { photos } = await usePhotos()

// Newest year first, as in the Penpot design; photos without a year go last.
const years = computed(() => {
  const byYear = new Map<number | null, typeof photos.value>()
  for (const p of photos.value) byYear.set(p.year ?? null, [...(byYear.get(p.year ?? null) ?? []), p])
  return [...byYear.entries()]
    .sort(([a], [b]) => (b ?? -1) - (a ?? -1))
    .map(([year, list]) => ({ year, label: year === null ? 'Other' : String(year), photos: list }))
})
const wm = useWindowManager()
// A double click opens a photo with a mouse; on touch screens a tap does.
const touch = computed(() => wm.mode.value !== 'desktop')
const open = ref<string | null>(null)
const current = computed(() => photos.value.find(p => p.id === open.value))

// Left and right arrows step through the photos in the order the grid shows them, stopping at
// either end, while a photo is open and Photos is the focused window.
const order = computed(() => years.value.flatMap(y => y.photos))
const onKey = (e: KeyboardEvent) => {
  if (!open.value || wm.focused.value?.app !== 'photos') return
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  e.preventDefault()
  const next = order.value[order.value.findIndex(p => p.id === open.value) + step]
  if (next) open.value = next.id
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="relative flex h-full flex-col" data-testid="photos-app">
    <div class="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-4 max-md:p-1 max-md:pt-2" data-testid="photo-grid">
      <section v-for="y in years" :key="y.label" :data-year="y.label" class="flex flex-col gap-2">
        <h2 class="text-xl font-bold max-md:px-3">{{ y.label }}</h2>
        <ul class="grid grid-cols-[repeat(auto-fill,130px)] gap-3 max-md:grid-cols-3 max-md:gap-1">
          <li v-for="p in y.photos" :key="p.id">
            <button type="button" :data-photo="p.id" class="block min-h-11 w-full overflow-hidden rounded-[10px] max-md:rounded-none" :aria-label="p.caption" @click="touch && (open = p.id)" @dblclick="open = p.id">
              <img :src="p.image" :alt="p.caption" loading="lazy" class="aspect-square w-full object-cover">
            </button>
          </li>
        </ul>
      </section>
    </div>

    <div v-if="current" data-testid="photo-large" class="absolute inset-0 z-10 flex flex-col bg-white">
      <header class="flex min-h-11 shrink-0 items-center gap-xs border-b border-ink/10 px-sm">
        <button type="button" aria-label="Close photo" data-testid="photo-close" class="flex size-11 items-center justify-start" @click="open = null">
          <svg viewBox="0 0 9 18" class="h-[18px] w-[9px]" aria-hidden="true"><path d="M8 1L1.5 9 8 17" fill="none" stroke="#2f3b3a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span class="truncate text-md font-bold" data-testid="photo-caption">{{ current.caption }}</span>
      </header>
      <div class="flex min-h-0 flex-1 items-center justify-center bg-card p-sm">
        <img :src="current.image" :alt="current.caption" class="max-h-full max-w-full object-contain">
      </div>
    </div>
  </div>
</template>
