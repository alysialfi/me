export default defineNuxtPlugin(() => {
  const { mode } = useViewport()
  return { provide: { wm: createWindowManager(mode) } }
})
