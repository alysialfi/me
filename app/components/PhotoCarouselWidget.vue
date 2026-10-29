<script setup lang="ts">
const wm = useWindowManager()
const { photos } = await usePhotos()
const touch = computed(() => wm.mode.value !== 'desktop')
const index = ref(0)
const current = computed(() => photos.value[index.value])

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
    <div class="pointer-events-none absolute bottom-3 left-1/2 flex h-[17px] -translate-x-1/2 items-center justify-center gap-[6px] rounded-[10px] bg-white/55 px-[6px]" data-testid="carousel-dots">
      <!-- On touch screens the dots only indicate position; the photo advances by itself. -->
      <template v-for="(p, i) in photos" :key="p.id">
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
