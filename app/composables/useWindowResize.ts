import { resizeRect, type Handle } from '~/utils/window-geometry'
import type { AppId } from '~/utils/window-manager'

export const RESIZE_HANDLES: Handle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

// Resize a desktop window from its edges and corners; the URL is never touched.
export function useWindowResize(app: AppId) {
  const wm = useWindowManager()

  function onPointerDown(handle: Handle, e: PointerEvent) {
    if (e.button !== 0) return
    const win = wm.windows.value.find(w => w.app === app)
    if (!win || win.state !== 'normal') return
    e.stopPropagation()
    wm.focus(app)
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const start = { px: e.clientX, py: e.clientY, rect: { ...win.rect } }

    const move = (ev: PointerEvent) => {
      wm.setRect(app, resizeRect(start.rect, handle, ev.clientX - start.px, ev.clientY - start.py, { w: window.innerWidth, h: window.innerHeight }))
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  return { onPointerDown }
}
