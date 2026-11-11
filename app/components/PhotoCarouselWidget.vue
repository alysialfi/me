<script setup lang="ts">
import type { WidgetSize } from '~/utils/widget-layout'

const props = withDefaults(defineProps<{ size?: WidgetSize }>(), { size: 'M' })
const wm = useWindowManager()
const { photos } = await usePhotos()
const touch = computed(() => wm.mode.value !== 'desktop')
const index = ref(0)
const current = computed(() => photos.value[index.value])
const yearChip = computed(() => {
  const year = current.value?.year
  return year ? `${year} · ${photos.value.filter(p => p.year === year).length} photos` : ''
})

// With many photos the dots would overflow the widget, so only a window of them around the current photo shows.
const MAX_DOTS = 7
const dots = computed(() => {
  const start = Math.min(Math.max(index.value - Math.floor(MAX_DOTS / 2), 0), Math.max(photos.value.length - MAX_DOTS, 0))
  return photos.value.slice(start, start + MAX_DOTS).map((p, k) => ({ p, i: start + k }))
})

// Advances every few seconds; picking a dot jumps to that photo.
let timer: ReturnType<typeof setInterval> | undefined
const advance = () => { if (photos.value.length) index.value = (index.value + 1) % photos.value.length }
const restart = () => { clearInterval(timer); timer = setInterval(advance, 4000) }
onMounted(restart)
onUnmounted(() => clearInterval(timer))
function pick(i: number) { index.value = i; restart() }
</script>

<template>
  <div class="relative h-full w-full" data-testid="carousel-widget">
    <button type="button" class="block size-full" aria-label="Open Photos" data-testid="carousel-open" @click="wm.open('photos')">
      <img v-if="current" :src="current.image" :alt="current.caption" class="size-full object-cover" data-testid="carousel-photo">
    </button>
    <span v-if="size === 'L' && yearChip" class="pointer-events-none absolute bottom-3 left-4 rounded-[12px] bg-white/85 px-2.5 py-1 text-xs font-semibold" data-testid="carousel-chip">{{ yearChip }}</span>
    <div v-if="size !== 'S'" class="pointer-events-none absolute bottom-3 left-1/2 flex h-[17px] -translate-x-1/2 items-center justify-center gap-[6px] rounded-[10px] bg-white/55 px-[6px]" data-testid="carousel-dots">
      <!-- On touch screens the dots only indicate position; the photo advances by itself. -->
      <template v-for="{ p, i } in dots" :key="p.id">
        <span v-if="touch" :class="[i === index ? 'bg-ink' : 'bg-ink/45', 'size-[7px] rounded-full']" aria-hidden="true" />
        <button
          v-else
          type="button"
          :aria-label="`Show photo ${i + 1}`"
          :aria-current="i === index ? 'true' : undefined"
          class="pointer-events-auto flex size-[10px] items-center justify-center"
          @click.stop="pick(i)"
        >
          <span :class="[i === index ? 'bg-ink' : 'bg-ink/45', 'size-[7px] rounded-full']" />
        </button>
      </template>
    </div>
  </div>
</template>
