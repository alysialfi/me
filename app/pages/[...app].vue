<script setup lang="ts">
// One page for every path: the URL only selects what the home screen shows.
definePageMeta({ key: 'home' })
</script>

<template>
  <ClientOnly>
    <HomeScreen />
  </ClientOnly>
</template>
