<script setup lang="ts">
import { formatTime, startClock } from '~/utils/clock'

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
  <div class="@container flex h-full items-start max-sm:justify-center" data-testid="clock-widget">
    <span class="font-clock text-[48px] font-semibold leading-[1.2] lg:text-[37.7cqw]" data-testid="clock-time">{{ formatTime(time) }}</span>
  </div>
</template>
