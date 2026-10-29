import { clampPosition } from '~/utils/window-geometry'
import type { AppId } from '~/utils/window-manager'

// Drag a desktop window by its title bar; the URL is never touched.
export function useWindowDrag(app: AppId) {
  const wm = useWindowManager()

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
    const win = wm.windows.value.find(w => w.app === app)
    if (!win) return
    const bar = e.currentTarget as HTMLElement
    bar.setPointerCapture(e.pointerId)
    const start = { px: e.clientX, py: e.clientY, rect: { ...win.rect } }

    const move = (ev: PointerEvent) => {
      const next = { ...start.rect, x: start.rect.x + ev.clientX - start.px, y: start.rect.y + ev.clientY - start.py }
      wm.setRect(app, clampPosition(next, { w: window.innerWidth, h: window.innerHeight }))
    }
    const up = () => {
      bar.removeEventListener('pointermove', move)
      bar.removeEventListener('pointerup', up)
      bar.removeEventListener('pointercancel', up)
    }
    bar.addEventListener('pointermove', move)
    bar.addEventListener('pointerup', up)
    bar.addEventListener('pointercancel', up)
  }

  return { onPointerDown }
}
