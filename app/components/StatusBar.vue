<script setup lang="ts">
import { formatStatusTime, startClock } from '~/utils/clock'
import { wifiArcs } from '~/utils/network'

// The time is the visitor's own, filled in after mount so the prerendered page has none to get wrong.
const time = ref('')
const network = useNetwork()
onMounted(() => {
  const clock = startClock(1000)
  const stopWatch = watchEffect(() => { time.value = formatStatusTime(clock.time.value) })
  onBeforeUnmount(() => { clock.stop(); stopWatch() })
})
</script>

<template>
  <header data-testid="status-bar" class="fixed inset-x-0 top-0 z-[1000] flex h-11 items-center justify-between bg-white/55 px-7">
    <span class="min-w-10 text-lg font-semibold" data-testid="status-time">{{ time }}</span>
    <div class="flex items-center gap-1.5" aria-hidden="true">
      <template v-if="network.supported.value">
        <svg v-if="network.kind.value === 'wifi'" viewBox="0 0 16 12" class="h-3 w-4" data-testid="signal-wifi" :data-arcs="wifiArcs(network.bars.value)">
          <path d="M1 4.2a10 10 0 0 1 14 0" fill="none" stroke-width="1.8" stroke-linecap="round" :class="wifiArcs(network.bars.value) >= 3 ? 'stroke-ink' : 'stroke-ink/25'" />
          <path d="M3.4 6.8a6.5 6.5 0 0 1 9.2 0" fill="none" stroke-width="1.8" stroke-linecap="round" :class="wifiArcs(network.bars.value) >= 2 ? 'stroke-ink' : 'stroke-ink/25'" />
          <path d="M5.8 9.3a3.2 3.2 0 0 1 4.4 0" fill="none" stroke-width="1.8" stroke-linecap="round" :class="wifiArcs(network.bars.value) >= 1 ? 'stroke-ink' : 'stroke-ink/25'" />
          <circle cx="8" cy="11" r="1" :class="wifiArcs(network.bars.value) >= 1 ? 'fill-ink' : 'fill-ink/25'" />
        </svg>
        <span v-else class="flex items-end gap-0.5" data-testid="signal-bars" :data-bars="network.bars.value">
          <i v-for="(h, i) in [4, 6, 8, 10]" :key="h" :class="[i < network.bars.value ? 'bg-ink' : 'bg-ink/25', 'block w-[3px] rounded-[1px]']" :style="{ height: `${h}px` }" />
        </span>
      </template>
      <BatteryIndicator />
    </div>
  </header>
</template>
