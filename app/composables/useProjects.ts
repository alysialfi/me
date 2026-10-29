export interface ProjectFile { name: string, type: 'pdf' | 'image' }
export interface ProjectItem { slug: string, name: string, summary?: string, files: ProjectFile[] }

// One folder per project, sorted by name. Files come from the build-time folder scan.
export async function useProjects() {
  const files = useRuntimeConfig().public.projectFiles as Record<string, ProjectFile[]>
  const { data } = await useAsyncData('projects-list', async () => {
    const rows = await queryCollection('projects').select('stem', 'name', 'summary').all()
    return rows
      .map((r): ProjectItem => {
        const slug = r.stem.split('/')[1]!
        return { slug, name: r.name, summary: r.summary, files: files[slug] ?? [] }
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  })
  return { projects: computed(() => data.value ?? []) }
}
