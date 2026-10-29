<script setup lang="ts">
import type { AppWindow } from '~/utils/window-manager'

const props = defineProps<{ window: AppWindow }>()
const wm = useWindowManager()
const { projects } = await useProjects()

const project = computed(() => projects.value.find(p => p.slug === props.window.view.project))
const selected = ref<string>()

// Double-click on desktop, a single tap on touch screens.
const dblclick = computed(() => wm.mode.value === 'desktop')
function activate(open: () => void, id: string, e: Event) {
  if (e.type === 'click' && !dblclick.value) return open()
  if (e.type === 'click') selected.value = id
  else if (e.type === 'dblclick' && dblclick.value) open()
}

const openProject = (slug: string) => wm.open('finder', { project: slug })
const openFile = (file: string) => wm.open('finder', { project: props.window.view.project, file })
const back = () => wm.open('finder', {})
</script>

<template>
  <div class="flex h-full flex-col" data-testid="finder-app">
    <header class="flex min-h-11 shrink-0 items-center gap-xs border-b border-ink/10 px-sm">
      <button v-if="project" type="button" data-testid="finder-back" class="min-h-11 pr-xs text-md font-semibold" @click="back">‹ Back</button>
      <span class="text-md font-bold" data-testid="finder-path">{{ project ? project.name : 'Projects' }}</span>
    </header>

    <ul v-if="!project" data-testid="project-folders" class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-sm overflow-auto p-md">
      <li v-for="p in projects" :key="p.slug">
        <button
          type="button"
          :data-project="p.slug"
          :class="[selected === p.slug ? 'bg-accent-pink/60' : '', 'flex min-h-11 w-full flex-col items-center gap-1 rounded-window p-xs']"
          @click="activate(() => openProject(p.slug), p.slug, $event)"
          @dblclick="activate(() => openProject(p.slug), p.slug, $event)"
        >
          <FileIcon kind="folder" />
          <span class="text-center text-base font-medium">{{ p.name }}</span>
        </button>
      </li>
    </ul>

    <ul v-else data-testid="project-files" class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-sm overflow-auto p-md">
      <li v-for="f in project.files" :key="f.name">
        <button
          type="button"
          :data-file="f.name"
          :class="[selected === f.name ? 'bg-accent-pink/60' : '', 'flex min-h-11 w-full flex-col items-center gap-1 rounded-window p-xs']"
          @click="activate(() => openFile(f.name), f.name, $event)"
          @dblclick="activate(() => openFile(f.name), f.name, $event)"
        >
          <FileIcon :kind="f.type" />
          <span class="break-all text-center text-base font-medium">{{ f.name }}</span>
        </button>
      </li>
      <li v-if="!project.files.length" class="col-span-full text-md text-ink/70">This folder is empty.</li>
    </ul>
  </div>
</template>
