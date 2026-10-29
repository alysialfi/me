import { computed, onMounted, onUnmounted, ref } from 'vue'

// Server-rendered output assumes a desktop width; the real width is read on mount.
export function useViewport() {
  const width = useState('viewport-width', () => 1280)
  const mode = computed(() => modeForWidth(width.value))
  const update = () => { width.value = window.innerWidth }
  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })
  onUnmounted(() => window.removeEventListener('resize', update))
  return { width, mode, isDesktop: computed(() => mode.value === 'desktop') }
}
