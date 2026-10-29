<script setup lang="ts">
// Read-only: the snippet is rendered as highlighted markup, there is no editor.
const { data: snippet } = await useAsyncData('snippet', () => queryCollection('snippet').first())
const markdown = computed(() => snippet.value ? `\`\`\`${snippet.value.language}\n${snippet.value.code.replace(/\n$/, '')}\n\`\`\`` : '')
</script>

<template>
  <div v-if="snippet" class="flex h-full flex-col bg-white text-ink" data-testid="vscode-app">
    <div class="flex shrink-0 bg-card text-sm">
      <span class="flex min-h-11 items-center gap-xs border-t-2 border-[#0078d4] bg-white px-sm" data-testid="vscode-file">{{ snippet.file }}</span>
    </div>
    <div class="min-h-0 flex-1 overflow-auto p-sm text-sm leading-relaxed" data-testid="vscode-code" :data-language="snippet.language">
      <MDC :value="markdown" tag="div" class="vscode-code" />
    </div>
  </div>
</template>

<style>
/* The theme is picked by the code block; keep the editor background consistent. */
.vscode-code pre { background: transparent !important; margin: 0; padding: 0; white-space: pre; }
</style>
