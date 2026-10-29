<script setup lang="ts">
const { data: contact } = await useAsyncData('contact', () => queryCollection('contact').first())
const tel = computed(() => `tel:${(contact.value?.phone ?? '').replace(/[^\d+]/g, '')}`)
const row = 'flex min-h-11 items-center justify-between gap-sm rounded-window bg-card px-sm py-xs text-md'
</script>

<template>
  <div v-if="contact" data-testid="contact-app" class="mx-auto flex max-w-md flex-col gap-sm p-md">
    <h1 class="text-4xl font-bold" data-testid="contact-name">{{ contact.fullName }}</h1>
    <a :class="row" :href="`mailto:${contact.email}`" data-contact="email">
      <span class="text-ink/70">email</span><span class="font-semibold">{{ contact.email }}</span>
    </a>
    <a :class="row" :href="tel" data-contact="phone">
      <span class="text-ink/70">phone</span><span class="font-semibold">{{ contact.phone }}</span>
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
      <span class="text-ink/70">social</span><span class="font-semibold">{{ s.label }}</span>
    </a>
  </div>
</template>
