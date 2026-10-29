import { computed } from 'vue'
import { modeForWidth } from '~/utils/viewport'

// Width is tracked by the window-manager plugin; server-rendered output assumes desktop.
export function useViewport() {
  const width = useState('viewport-width', () => 1280)
  const mode = computed(() => modeForWidth(width.value))
  return { width, mode, isDesktop: computed(() => mode.value === 'desktop') }
}
