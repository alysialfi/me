// Content schemas, written against a passed-in `z` so the same definitions run
// inside Nuxt Content (its bundled zod) and in unit tests (the zod package).
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg']
export const PROJECT_FILE_EXTENSIONS = ['pdf', ...IMAGE_EXTENSIONS]

export function makeSchemas(z: any) {
  const year = z.number().int().min(1900).max(2200)
  return {
    note: z.object({
      title: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      about: z.boolean().optional()
    }),
    project: z.object({
      name: z.string().min(1),
      summary: z.string().optional()
    }),
    photo: z.object({
      image: z.string().min(1),
      caption: z.string().min(1),
      kind: z.enum(['personal', 'project'])
    }),
    song: z.object({
      title: z.string().min(1),
      artist: z.string().min(1),
      cover: z.string().optional(),
      audio: z.string().min(1)
    }),
    contact: z.object({
      fullName: z.string().min(1),
      email: z.string().regex(/^[^@\s]+@[^@\s]+$/),
      phone: z.string().min(1),
      socials: z.array(z.object({ label: z.string().min(1), url: z.string().url() }))
    }),
    snippet: z.object({
      file: z.string().min(1),
      language: z.string().min(1),
      code: z.string().min(1)
    }),
    history: z.object({
      title: z.string().min(1),
      start: year,
      end: z.union([year, z.literal('present')]),
      kind: z.enum(['education', 'work'])
    })
  }
}
