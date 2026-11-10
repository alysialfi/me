import { linkKind, signalBars, type LinkKind } from '~/utils/network'

// The visitor's own connection, from the Network Information API (Chromium browsers).
// `supported` stays false elsewhere, so the status bar hides the signal instead of showing a made-up one.
interface Connection extends EventTarget { type?: string, effectiveType?: string, downlink?: number }

export function useNetwork() {
  const supported = useState('network-supported', () => false)
  const online = useState('network-online', () => true)
  const kind = useState<LinkKind>('network-kind', () => 'unknown')
  const bars = useState('network-bars', () => 4)
  onMounted(() => {
    const conn = (navigator as Navigator & { connection?: Connection }).connection
    if (!conn) return
    const read = () => {
      online.value = navigator.onLine
      kind.value = linkKind(conn.type)
      bars.value = online.value ? signalBars(conn.effectiveType, conn.downlink) : 0
    }
    supported.value = true
    read()
    conn.addEventListener('change', read)
    window.addEventListener('online', read)
    window.addEventListener('offline', read)
    onBeforeUnmount(() => {
      conn.removeEventListener('change', read)
      window.removeEventListener('online', read)
      window.removeEventListener('offline', read)
    })
  })
  return { supported, online, kind, bars }
}
