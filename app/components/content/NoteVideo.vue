<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <video :src="src" controls preload="none" class="w-full rounded-window" />
</template>
