<script setup lang="ts">
const notFound = useState('not-found', () => false)
const router = useRouter()

function goHome() {
  notFound.value = false
  router.replace('/')
}
</script>

<template>
  <div
    v-if="notFound"
    role="alert"
    data-testid="not-found"
    class="glass fixed left-1/2 top-20 z-[3000] flex w-[min(90vw,420px)] -translate-x-1/2 items-center justify-between gap-sm rounded-card px-md py-sm"
  >
    <div>
      <p class="text-lg font-bold">Page not found</p>
      <p class="text-sm">That link doesn't match anything here.</p>
    </div>
    <button type="button" class="min-h-11 shrink-0 rounded-icon bg-white px-sm text-base font-semibold" @click="goHome">Home</button>
  </div>
</template>
