<script setup lang="ts">
defineProps<{ src: string }>()

const { $posthog } = useNuxtApp()

const captureVideoPlay = () => {
  $posthog?.capture('note_video_played')
  $posthog?.logger.info('note video playback started', {
    action: 'play',
  })
}
</script>

<template>
  <video :src="src" controls preload="none" class="w-full rounded-window" @play="captureVideoPlay" />
</template>
