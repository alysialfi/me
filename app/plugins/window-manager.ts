import { createWindowManager } from '~/utils/window-manager'

export default defineNuxtPlugin(() => {
  const { width, mode } = useViewport()
  if (import.meta.client) {
    const update = () => { width.value = window.innerWidth }
    update()
    window.addEventListener('resize', update)
  }
  return { provide: { wm: createWindowManager(mode) } }
})
