<template>
  <header data-testid="status-bar" class="fixed inset-x-0 top-0 z-[1000] flex h-11 items-center justify-between bg-white/55 px-7">
    <span class="text-lg font-semibold">9:41</span>
    <div class="flex items-center gap-1.5" aria-hidden="true">
      <span class="flex items-end gap-0.5">
        <i v-for="h in [4, 6, 8, 10]" :key="h" class="block w-[3px] rounded-[1px] bg-ink" :style="{ height: `${h}px` }" />
      </span>
      <span class="relative inline-block h-3 w-[27px]">
        <span class="absolute left-0 top-0 h-3 w-6 rounded-[4px] border border-ink/60" />
        <span class="absolute left-1 top-1 h-2 w-4 rounded-sm bg-ink" />
        <span class="absolute right-0 top-[3.5px] h-[5px] w-0.5 rounded-sm bg-ink/60" />
      </span>
    </div>
  </header>
</template>
