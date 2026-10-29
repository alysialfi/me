<script setup lang="ts">
defineProps<{ src: string, name: string }>()
</script>

<template>
  <div data-testid="image-viewer" class="flex h-full items-center justify-center overflow-auto bg-card p-sm">
    <img :src="src" :alt="name" class="max-h-full max-w-full object-contain">
  </div>
</template>
