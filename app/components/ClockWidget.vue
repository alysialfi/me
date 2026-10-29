<script setup lang="ts">
import { formatDate, formatTime, startClock } from '~/utils/clock'

const time = ref(new Date())
let stop = () => {}
onMounted(() => {
  const clock = startClock()
  stop = clock.stop
  watch(clock.time, t => { time.value = t }, { immediate: true })
})
onUnmounted(() => stop())
</script>

<template>
  <div class="flex h-full flex-col justify-center gap-1 p-sm" data-testid="clock-widget">
    <span class="text-6xl font-light leading-none" data-testid="clock-time">{{ formatTime(time) }}</span>
    <span class="text-md font-medium" data-testid="clock-date">{{ formatDate(time) }}</span>
  </div>
</template>
