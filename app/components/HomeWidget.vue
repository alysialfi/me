<script setup lang="ts">
import type { WidgetId } from '~/utils/widgets'
import type { WidgetSize } from '~/utils/widget-layout'

withDefaults(defineProps<{ id: WidgetId, size?: WidgetSize }>(), { size: 'M' })
</script>

<template>
  <ClockWidget v-if="id === 'clock'" />
  <PhotoCarouselWidget v-else-if="id === 'photo-carousel'" :size="size" />
  <CalendarWidget v-else-if="id === 'calendar'" :size="size" />
  <NotesWidget v-else-if="id === 'notes'" :size="size" />
  <MusicWidget v-else-if="id === 'music'" :size="size" />
</template>
