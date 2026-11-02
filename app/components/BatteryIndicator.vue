<script setup lang="ts">
// The visitor's battery: outline, a fill that follows the level, and the percentage when asked for.
defineProps<{ percentage?: boolean }>()
const { percent, charging } = useBattery()
</script>

<template>
  <div v-if="percent !== null" class="flex items-center gap-1.5" data-testid="battery" :data-level="percent" :data-charging="charging">
    <span aria-hidden="true" class="relative inline-block h-3 w-[27px]">
      <span class="absolute left-0 top-0 h-3 w-6 rounded-[4px] border border-ink/60" />
      <span class="absolute left-[2px] top-[2px] h-2 rounded-sm" :class="percent <= 20 && !charging ? 'bg-[#e0483e]' : 'bg-ink'" :style="{ width: `${Math.max(1, (percent / 100) * 20)}px` }" data-testid="battery-level" />
      <span class="absolute right-0 top-[3.5px] h-[5px] w-0.5 rounded-sm bg-ink/60" />
    </span>
    <span v-if="percentage" :aria-label="`Battery ${percent}%${charging ? ', charging' : ''}`" data-testid="battery-percent">{{ percent }}%</span>
  </div>
</template>
