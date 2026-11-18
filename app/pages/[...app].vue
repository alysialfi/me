<script setup lang="ts">
import { SITE } from '~~/shared/site'

// One page for every path: the URL only selects what the home screen shows.
definePageMeta({ key: 'home' })
</script>

<template>
  <ClientOnly>
    <HomeScreen />
    <!-- Prerendered for crawlers and no-JS readers, hidden from view; the desktop replaces it once the browser mounts. -->
    <template #fallback>
      <main class="sr-only">
        <h1>{{ SITE.name }} ({{ SITE.nickname }}), {{ SITE.jobTitle }}</h1>
        <p>{{ SITE.description }}</p>
        <p>Based in {{ SITE.location }}.</p>
        <ul>
          <li v-for="p in SITE.profiles" :key="p.url">
            <a :href="p.url" rel="me noopener">{{ p.label }}</a>
          </li>
        </ul>
      </main>
    </template>
  </ClientOnly>
</template>
