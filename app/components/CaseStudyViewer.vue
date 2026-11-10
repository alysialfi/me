<script setup lang="ts">
// A Markdown case study: frontmatter fills the side column, the body fills the main one.
const props = defineProps<{ slug: string, name: string }>()
const stem = computed(() => `projects/${props.slug}/${props.name.replace(/\.md$/i, '')}`)
const { data: doc } = await useAsyncData(() => `project-doc-${stem.value}`, () =>
  queryCollection('projectDocs').where('stem', '=', stem.value).first(),
{ watch: [stem] })
</script>

<template>
  <article v-if="doc" data-testid="case-study" class="@container h-full overflow-auto p-md">
    <div class="grid gap-md @2xl:grid-cols-[13rem_minmax(0,1fr)]">
      <aside class="space-y-sm text-base" data-testid="case-study-side">
        <div>
          <h1 class="text-md font-bold" data-testid="case-study-title">{{ doc.title }}</h1>
          <a v-if="doc.url" :href="doc.url" target="_blank" rel="noopener noreferrer" class="break-all underline underline-offset-2">{{ doc.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') }}</a>
          <p v-if="doc.period">{{ doc.period }}</p>
        </div>
        <div v-if="doc.role">
          <h2 class="font-bold">Role/Position</h2>
          <p>{{ doc.role }}</p>
        </div>
        <div v-if="doc.stack?.length">
          <h2 class="font-bold">Stacks</h2>
          <p>{{ doc.stack.join(', ') }}</p>
        </div>
        <div v-if="doc.links?.length">
          <h2 class="font-bold">Repository</h2>
          <ul class="space-y-1">
            <li v-for="l in doc.links" :key="l.url">
              <a :href="l.url" target="_blank" rel="noopener noreferrer" class="break-words underline underline-offset-2">{{ l.label }}</a>
            </li>
          </ul>
        </div>
      </aside>
      <ContentRenderer :value="doc" class="case-prose space-y-sm text-md leading-relaxed" data-testid="case-study-body" />
    </div>
  </article>
</template>

<style>
.case-prose h2 { font-weight: 700; margin-top: var(--spacing-md); }
.case-prose h2:first-child { margin-top: 0; }
.case-prose ul { list-style: disc; padding-left: var(--spacing-md); }
.case-prose img { width: 100%; border-radius: var(--radius-window); border: 1px solid color-mix(in srgb, currentColor 15%, transparent); }
.case-prose p:has(> img) { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--spacing-sm); }
</style>
