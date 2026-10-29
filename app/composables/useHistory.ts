import { normalizeEntry } from '~/utils/history'

export async function useHistory() {
  const { data } = await useAsyncData('history-list', async () => {
    const rows = await queryCollection('history').select('title', 'start', 'end', 'kind').all()
    return rows.map(r => normalizeEntry(r as any))
  })
  return { entries: computed(() => data.value ?? []) }
}
