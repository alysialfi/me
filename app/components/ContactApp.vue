<script setup lang="ts">
const { data: contact } = await useAsyncData('contact', () => queryCollection('contact').first())
const tel = computed(() => `tel:${(contact.value?.phone ?? '').replace(/[^\d+]/g, '')}`)
const initials = computed(() => (contact.value?.fullName ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join(''))
// Rows from the Penpot "Window / Contact": label above value, divided by a hairline.
const row = 'flex min-h-11 flex-col gap-0.5 p-[14px] [&+&]:border-t [&+&]:border-[#e6e6e6]'
</script>

<template>
  <div v-if="contact" data-testid="contact-app" class="mx-auto flex max-w-2xl flex-col items-center gap-5 p-lg">
    <span class="flex size-24 items-center justify-center rounded-full bg-wallpaper-teal text-5xl font-semibold text-white" aria-hidden="true" data-testid="contact-avatar">{{ initials }}</span>
    <h1 class="text-4xl font-bold" data-testid="contact-name">{{ contact.fullName }}</h1>
    <div class="flex w-full flex-col overflow-hidden rounded-[12px] bg-card">
      <a :class="row" :href="`mailto:${contact.email}`" data-contact="email">
        <span class="text-xs font-medium text-[#8a9291]">email</span><span class="text-lg font-medium">{{ contact.email }}</span>
      </a>
      <a :class="row" :href="tel" data-contact="phone">
        <span class="text-xs font-medium text-[#8a9291]">phone</span><span class="text-lg font-medium">{{ contact.phone }}</span>
      </a>
      <a
        v-for="s in contact.socials"
        :key="s.url"
        :class="row"
        :href="s.url"
        target="_blank"
        rel="noopener noreferrer"
        data-contact="social"
      >
        <span class="text-xs font-medium text-[#8a9291]">social</span><span class="text-lg font-medium">{{ s.label }}</span>
      </a>
    </div>
  </div>
</template>
