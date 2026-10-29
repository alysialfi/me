import { createAudioStore } from '~/utils/audio-store'

export default defineNuxtPlugin(() => {
  const el = document.createElement('audio')
  el.preload = 'none'
  el.dataset.testid = 'shared-audio'
  document.body.appendChild(el)
  return { provide: { audio: createAudioStore(el) } }
})
