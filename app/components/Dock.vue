<script setup lang="ts">
import { DOCK_ORDER } from '~/utils/apps'
const wm = useWindowManager()
</script>

<template>
  <nav data-testid="dock" aria-label="Dock" class="glass fixed bottom-5 left-1/2 z-[1000] flex -translate-x-1/2 items-center justify-center gap-[18px] rounded-card px-[19px] py-[11px]">
    <AppIcon v-for="id in DOCK_ORDER" :key="id" :app="id" :running="wm.isOpen(id)" @click="wm.open(id)" />
  </nav>
</template>
