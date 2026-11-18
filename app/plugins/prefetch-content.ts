// The home screen is client-only, so its queries would otherwise run in the browser and download the
// whole content database (SQLite wasm + dumps) on first load. Running the first-load lists here puts
// them in the prerendered payload; the widgets and apps find them there under the same keys.
// Runs on both sides so the browser registers the payload entries during hydration instead of querying.
// A plugin (not the page) so the page stays synchronous and the router keeps its hydration timing.
export default defineNuxtPlugin(async () => {
  const [{ aboutSlug }] = await Promise.all([useNotes(), usePhotos(), useHistory(), useSongs(), useProjects()])
  // Notes opens on About me, so its body is needed on first load too (same key as NotesApp).
  if (aboutSlug.value) {
    await useAsyncData(`note-${aboutSlug.value}`, () => queryCollection('notes').where('stem', '=', `notes/${aboutSlug.value}`).first())
  }
})
