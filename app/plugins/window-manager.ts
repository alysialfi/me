import { createWindowManager } from '~/utils/window-manager'
import { startUrlSync } from '~/utils/url-sync'
import type { KnownContent } from '~/utils/routes'

export default defineNuxtPlugin((nuxtApp) => {
  const { width, mode } = useViewport()
  const wm = createWindowManager(mode, () => import.meta.client ? { w: window.innerWidth, h: window.innerHeight } : { w: 1280, h: 820 })
  const notFound = useState('not-found', () => false)
  if (import.meta.client) {
    const update = () => { width.value = window.innerWidth }
    update()
    window.addEventListener('resize', update)
    // Build the window set from the first URL (shared links, first-load Notes at /).
    nuxtApp.hook('app:mounted', () => {
      startUrlSync({ wm, router: useRouter(), notFound, known: () => useRuntimeConfig().public.knownContent as KnownContent })
    })
  }
  return { provide: { wm } }
})
