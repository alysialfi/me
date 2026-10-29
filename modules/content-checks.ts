import { defineNuxtModule } from '@nuxt/kit'
import { join } from 'node:path'
import { checkAboutMe, checkProjectFiles } from '../shared/content-checks'

// Fails the build on invalid content and publishes the project file lists.
export default defineNuxtModule({
  meta: { name: 'content-checks' },
  setup(_options, nuxt) {
    const content = join(nuxt.options.rootDir, 'content')
    checkAboutMe(join(content, 'notes'))
    const projectFiles = checkProjectFiles(join(content, 'projects'))
    nuxt.options.runtimeConfig.public.projectFiles = projectFiles
    nuxt.options.nitro.publicAssets = [
      ...(nuxt.options.nitro.publicAssets || []),
      { dir: join(content, 'projects'), baseURL: '/projects', maxAge: 60 * 60 }
    ]
  }
})
