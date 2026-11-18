<script setup lang="ts">
import type { Component } from 'vue'
import type { WidgetId } from '~/utils/widgets'
import { CalendarWidget, ClockWidget, CoffeeWidget, MusicWidget, NotesWidget, PhotoCarouselWidget } from '#components'

defineProps<{ id: WidgetId }>()

// Every catalogue entry must have a component: a missing one fails the type check.
const COMPONENTS: Record<WidgetId, Component> = {
  'clock': ClockWidget,
  'photo-carousel': PhotoCarouselWidget,
  'coffee': CoffeeWidget,
  'calendar': CalendarWidget,
  'notes': NotesWidget,
  'music': MusicWidget
}
</script>

<template>
  <component :is="COMPONENTS[id]" />
</template>
