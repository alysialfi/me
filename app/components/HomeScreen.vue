<script setup lang="ts">
const { mode } = useViewport()
const audio = useAudio()
const { songs } = await useSongs()

// Background track: starts only once the page has fully loaded, so it never competes with first paint.
// Browsers block sound until the visitor interacts, so a blocked attempt retries on the first gesture.
onMounted(() => {
  const start = async () => {
    const song = songs.value.find(s => s.id === 'the-way-home')
    if (!song || audio.state.current) return
    await audio.play(song)
    if (!audio.state.playing) armGesture()
  }
  const armGesture = () => {
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const once = () => { events.forEach(e => removeEventListener(e, once)); start() }
    events.forEach(e => addEventListener(e, once, { once: true }))
  }
  const afterLoad = () => setTimeout(start, 0)
  if (document.readyState === 'complete') afterLoad()
  else addEventListener('load', afterLoad, { once: true })
})
</script>

<template>
  <DesktopShell v-if="mode === 'desktop'" />
  <TouchShell v-else />
</template>
