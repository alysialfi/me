import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { makeSchemas } from './shared/content-schemas'

const s = makeSchemas(z)

export default defineContentConfig({
  collections: {
    notes: defineCollection({ type: 'page', source: 'notes/*.md', schema: s.note }),
    projects: defineCollection({ type: 'data', source: 'projects/*/project.yml', schema: s.project }),
    photos: defineCollection({ type: 'data', source: 'photos/*.yml', schema: s.photo }),
    songs: defineCollection({ type: 'data', source: 'songs/*.yml', schema: s.song }),
    contact: defineCollection({ type: 'data', source: 'contact.yml', schema: s.contact }),
    snippet: defineCollection({ type: 'data', source: 'snippet.yml', schema: s.snippet }),
    history: defineCollection({ type: 'data', source: 'history/*.yml', schema: s.history })
  }
})
