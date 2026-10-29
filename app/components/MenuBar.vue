<script setup lang="ts">
import { APPS } from '~/utils/apps'
const wm = useWindowManager()
const items = ['finder', 'notes', 'music'] as const
</script>

<template>
  <header data-testid="menu-bar" class="fixed inset-x-0 top-0 z-[1000] flex h-7 items-center justify-between bg-white/55 px-4 text-base">
    <nav class="flex items-center gap-[18px]">
      <span class="font-bold">Portfolio</span>
      <button v-for="id in items" :key="id" type="button" @click="wm.open(id)">{{ APPS[id].title }}</button>
    </nav>
    <div class="flex items-center gap-1.5">
      <span aria-hidden="true" class="relative inline-block h-3 w-[27px]">
        <span class="absolute left-0 top-0 h-3 w-6 rounded-[4px] border border-ink/60" />
        <span class="absolute left-1 top-1 h-2 w-4 rounded-sm bg-ink" />
        <span class="absolute right-0 top-[3.5px] h-[5px] w-0.5 rounded-sm bg-ink/60" />
      </span>
      <span>87%</span>
    </div>
  </header>
</template>
