export interface PhotoItem { id: string, image: string, caption: string, kind: 'personal' | 'project' }

// All photos in file-name order. Photos serves them as albums; the home carousel uses any of them.
export async function usePhotos() {
  const { data } = await useAsyncData('photos-list', async () => {
    const rows = await queryCollection('photos').select('id', 'image', 'caption', 'kind').all()
    return rows.map((r): PhotoItem => ({ id: r.id, image: r.image, caption: r.caption, kind: r.kind })).sort((a, b) => a.id.localeCompare(b.id))
  })
  return { photos: computed(() => data.value ?? []) }
}
