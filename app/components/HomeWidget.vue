<script setup lang="ts">
import type { WidgetId } from '~/utils/widgets'

defineProps<{ id: WidgetId }>()
</script>

<template>
  <ClockWidget v-if="id === 'clock'" />
  <PhotoCarouselWidget v-else-if="id === 'photo-carousel'" />
  <CalendarWidget v-else-if="id === 'calendar'" />
  <NotesWidget v-else-if="id === 'notes'" />
  <MusicWidget v-else-if="id === 'music'" />
</template>
