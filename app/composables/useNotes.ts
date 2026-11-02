// Notes from the content directory, newest first. `about` marks the note shown first.
export interface NoteItem {
  slug: string
  title: string
  date: string
  about: boolean
  summary?: string
}

export async function useNotes() {
  const { data } = await useAsyncData('notes-list', async () => {
    const rows = await queryCollection('notes').select('stem', 'title', 'date', 'about', 'summary').order('date', 'DESC').all()
    return rows.map((r): NoteItem => ({ slug: r.stem.split('/').pop()!, title: r.title, date: r.date, about: !!r.about, summary: r.summary }))
  })
  const notes = computed(() => data.value ?? [])
  const aboutSlug = computed(() => notes.value.find(n => n.about)?.slug ?? notes.value[0]?.slug)
  return { notes, aboutSlug }
}
