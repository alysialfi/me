<script setup lang="ts">
import { SITE } from '~~/shared/site'

const route = useRoute()
useHead({
  link: [{ rel: 'canonical', href: () => SITE.url + (route.path === '/' ? '/' : route.path.replace(/\/$/, '')) }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE.name,
      alternateName: SITE.nickname,
      url: SITE.url,
      image: SITE.url + SITE.image,
      jobTitle: SITE.jobTitle,
      description: SITE.description,
      homeLocation: { '@type': 'Place', name: SITE.location },
      sameAs: SITE.profiles.map(p => p.url)
    })
  }]
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
