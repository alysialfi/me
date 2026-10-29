<script setup lang="ts">
const { mode } = useViewport()
</script>

<template>
  <DesktopShell v-if="mode === 'desktop'" />
  <TouchShell v-else />
</template>
