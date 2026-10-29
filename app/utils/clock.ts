import { ref, type Ref } from 'vue'

export const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
export const formatDate = (d: Date) => d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })

// A ref holding the current time, refreshed on an interval. Returns a stop function.
export function startClock(interval = 1000, now: () => Date = () => new Date()): { time: Ref<Date>, stop: () => void } {
  const time = ref(now())
  const id = setInterval(() => { time.value = now() }, interval)
  return { time, stop: () => clearInterval(id) }
}
