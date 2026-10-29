import { watch, nextTick, type Ref } from 'vue'
import type { Router } from 'vue-router'
import { buildRoute, parseRoute, type KnownContent } from './routes'
import type { WindowManager, WindowSnapshot } from './window-manager'

interface Options {
  wm: WindowManager
  router: Router
  notFound: Ref<boolean>
  known?: () => KnownContent | undefined
}

// The URL mirrors the window manager: opening, focusing or closing an app pushes a history
// entry; back/forward restore the window set saved with that entry. Dragging never navigates.
export function startUrlSync({ wm, router, notFound, known }: Options) {
  let applying = false
  const desktop = () => wm.mode.value === 'desktop'
  const desired = () => buildRoute(wm.windows.value, wm.focused.value, desktop())
  const stateOf = () => ({ wm: wm.snapshot() })
  const savedWindows = () => (window.history.state?.wm as WindowSnapshot[] | undefined)

  async function applyCurrentRoute(initial: boolean) {
    applying = true
    const route = router.currentRoute.value
    const saved = initial ? undefined : savedWindows()
    if (saved) {
      wm.restore(saved)
      notFound.value = false
    } else {
      const parsed = parseRoute(route.path, [route.query.with].flat()[0], known?.())
      notFound.value = parsed.notFound
      // Others open behind; the focused app (or the first-load Notes at /) goes in front.
      for (const app of parsed.others) wm.open(app)
      if (parsed.focus) wm.open(parsed.focus.app, parsed.focus.view)
      else if (parsed.home && !wm.isOpen('notes')) wm.open('notes', undefined, { overlay: true })
      else if (parsed.home) wm.focus('notes')
    }
    await nextTick()
    applying = false
    if (initial) {
      // Normalise the query (drops unknown names) and attach the window set to this first entry.
      const { query } = desired()
      const sameQuery = (route.query.with ?? undefined) === query.with
      if (sameQuery) window.history.replaceState({ ...window.history.state, ...stateOf() }, '')
      else await router.replace({ path: route.path, query, state: stateOf() })
    }
  }

  // Navigation not made by us: back/forward or a pasted link in the same page.
  let pushing = 0
  router.afterEach(() => {
    if (!pushing && !applying) applyCurrentRoute(false)
  })

  let lastMode = wm.mode.value
  let lastKey = ''
  watch(() => [JSON.stringify(desired()), wm.mode.value] as const, async ([key, mode]) => {
    if (applying) { lastKey = key; return }
    const { path, query } = desired()
    const current = router.currentRoute.value
    const same = current.path === path && (current.query.with ?? undefined) === query.with
    const modeChanged = mode !== lastMode
    lastMode = mode
    // A not-found URL stays until the windows change.
    if (same || key === lastKey) { lastKey = key; return }
    lastKey = key
    notFound.value = false
    pushing++
    try {
      if (modeChanged) await router.replace({ path, query, state: stateOf() })
      else await router.push({ path, query, state: stateOf() })
    } finally {
      pushing--
    }
  })

  return applyCurrentRoute(true)
}
