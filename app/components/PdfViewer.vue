<script setup lang="ts">
// Renders every page of a PDF to a canvas with pdf.js, so mobile browsers show all pages too.
const props = defineProps<{ src: string }>()
const container = ref<HTMLElement>()
const pages = ref(0)
const failed = ref(false)

onMounted(async () => {
  try {
    const pdfjs = await import('pdfjs-dist')
    const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
    pdfjs.GlobalWorkerOptions.workerSrc = worker
    const pdf = await pdfjs.getDocument({ url: props.src }).promise
    pages.value = pdf.numPages
    await nextTick()
    const width = Math.max(container.value!.clientWidth - 32, 200)
    const ratio = window.devicePixelRatio || 1
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n)
      const base = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: (width / base.width) * ratio })
      const canvas = container.value!.querySelector<HTMLCanvasElement>(`[data-page="${n}"]`)!
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${width}px`
      await page.render({ canvas, viewport }).promise
    }
  } catch (e) {
    console.error('pdf viewer failed', e)
    failed.value = true
  }
})
</script>

<template>
  <div ref="container" data-testid="pdf-viewer" class="flex flex-col items-center gap-sm overflow-auto bg-card p-sm">
    <p v-if="failed" class="text-md">This PDF could not be shown.</p>
    <canvas v-for="n in pages" :key="n" :data-page="n" class="bg-white shadow-card" />
  </div>
</template>
