import { createWindowManager } from '~/utils/window-manager'

export default defineNuxtPlugin((nuxtApp) => {
  const { width, mode } = useViewport()
  const wm = createWindowManager(mode)
  if (import.meta.client) {
    const update = () => { width.value = window.innerWidth }
    update()
    window.addEventListener('resize', update)
    // First load of the home page: Notes already open on "About me".
    nuxtApp.hook('app:mounted', () => {
      if (useRoute().path === '/') wm.open('notes', undefined, { overlay: true })
    })
  }
  return { provide: { wm } }
})
