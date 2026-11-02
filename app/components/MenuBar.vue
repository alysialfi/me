<script setup lang="ts">
import { APPS } from '~/utils/apps'
import { formatDate, startClock } from '~/utils/clock'
const wm = useWindowManager()
const items = ['finder', 'notes', 'music'] as const
const now = ref(new Date())
let stop = () => {}
onMounted(() => {
  const clock = startClock()
  stop = clock.stop
  watch(clock.time, t => { now.value = t }, { immediate: true })
})
onUnmounted(() => stop())
</script>

<template>
  <header data-testid="menu-bar" class="fixed inset-x-0 top-0 z-[1000] flex h-7 items-center justify-between bg-white/55 px-4 text-base">
    <nav class="flex items-center gap-[18px]">
      <span class="font-bold">Portfolio</span>
      <button v-for="id in items" :key="id" type="button" @click="wm.open(id)">{{ APPS[id].title }}</button>
    </nav>
    <div class="flex items-center gap-1.5">
      <BatteryIndicator percentage />
      <span data-testid="menu-date">{{ formatDate(now) }}</span>
    </div>
  </header>
</template>
