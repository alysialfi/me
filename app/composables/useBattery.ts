// The visitor's own battery, from the Battery Status API (Chromium browsers). `level` stays
// null where the API is missing, so the battery indicator is hidden instead of showing a made-up value.
interface BatteryManager extends EventTarget { level: number, charging: boolean }

export function useBattery() {
  const level = useState<number | null>('battery-level', () => null)
  const charging = useState('battery-charging', () => false)
  onMounted(async () => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
    if (!nav.getBattery) return
    try {
      const battery = await nav.getBattery()
      const read = () => { level.value = battery.level; charging.value = battery.charging }
      read()
      battery.addEventListener('levelchange', read)
      battery.addEventListener('chargingchange', read)
    } catch {
      // Blocked by a permissions policy: leave the indicator hidden.
    }
  })
  return { level, charging, percent: computed(() => level.value === null ? null : Math.round(level.value * 100)) }
}
