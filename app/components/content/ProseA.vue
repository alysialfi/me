<script setup lang="ts">
import { parseRoute } from '~/utils/routes'

// Links in a note lead to a project, another app, or an external page (new tab).
defineOptions({ inheritAttrs: false })
const props = defineProps<{ href?: string, target?: string }>()
const wm = useWindowManager()
const external = computed(() => /^(https?:)?\/\//.test(props.href ?? ''))

function onClick(e: MouseEvent) {
  if (external.value || !props.href?.startsWith('/')) return
  const { focus } = parseRoute(props.href.split('?')[0]!)
  if (!focus) return
  e.preventDefault()
  wm.open(focus.app, focus.view)
}
</script>

<template>
  <a
    v-bind="$attrs"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="font-semibold underline underline-offset-2"
    @click="onClick"
  ><slot /></a>
</template>
