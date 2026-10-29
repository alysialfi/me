<script setup lang="ts">
import { groupByYear, periodText } from '~/utils/history'

const { entries } = await useHistory()
const groups = computed(() => groupByYear(entries.value))

// Entry colours sampled from the Penpot "Widget / Calendar": tint, accent bar, text.
const THEMES = [
  { tint: '#e3f2fd', bar: '#3b8fd0', text: '#2b6ca0' },
  { tint: '#fce4ec', bar: '#c2185b', text: '#9c1450' },
  { tint: '#e8f5e2', bar: '#43a047', text: '#2e7d32' },
  { tint: '#fff6e0', bar: '#f2b600', text: '#a87e00' }
]
// Entries in display order, each with the next theme in the cycle.
const themed = computed(() => {
  let n = 0
  return groups.value.map(g => ({ ...g, entries: g.entries.map(e => ({ ...e, theme: THEMES[n++ % THEMES.length]! })) }))
})
</script>

<template>
  <div class="flex h-full flex-col gap-xs overflow-y-auto px-[10px] py-[14px]" data-testid="calendar-widget">
    <section v-for="(g, i) in themed" :key="g.year" :data-year="g.year" class="flex flex-col gap-1.5">
      <h3 :class="[i === 0 ? 'text-[#d8493e]' : 'text-[#6b7473]', 'text-xs font-bold']">{{ g.year }}</h3>
      <div
        v-for="e in g.entries"
        :key="e.title"
        data-testid="calendar-entry"
        class="flex min-h-[46px] items-center gap-[10px] rounded-md py-2 pr-[10px]"
        :style="{ backgroundColor: e.theme.tint, color: e.theme.text }"
      >
        <span class="h-[30px] w-[3px] shrink-0 rounded-sm" data-testid="calendar-bar" :style="{ backgroundColor: e.theme.bar }" />
        <span class="min-w-0 flex-1 truncate text-sm font-bold">{{ e.title }}</span>
        <span class="shrink-0 text-xs font-medium" data-testid="calendar-period">{{ periodText(e) }}</span>
      </div>
    </section>
  </div>
</template>
