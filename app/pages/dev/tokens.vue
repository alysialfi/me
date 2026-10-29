<script setup lang="ts">
const colors = [
  ['wallpaper-teal', 'bg-wallpaper-teal'],
  ['wallpaper-mist', 'bg-wallpaper-mist'],
  ['card', 'bg-card'],
  ['card-cream', 'bg-card-cream'],
  ['accent-pink', 'bg-accent-pink'],
  ['accent-green', 'bg-accent-green'],
  ['ink', 'bg-ink'],
  ['ink-inverse', 'bg-ink-inverse']
]
const radii = [['card', 'rounded-card'], ['icon', 'rounded-icon'], ['window', 'rounded-window'], ['widget', 'rounded-widget']]
const spaces = [['xs', 'w-xs'], ['sm', 'w-sm'], ['md', 'w-md'], ['lg', 'w-lg']]
const sizes = [['2xs', 'text-2xs'], ['xs', 'text-xs'], ['sm', 'text-sm'], ['base', 'text-base'], ['md', 'text-md'], ['lg', 'text-lg'], ['xl', 'text-xl'], ['2xl', 'text-2xl'], ['3xl', 'text-3xl'], ['4xl', 'text-4xl'], ['5xl', 'text-5xl'], ['6xl', 'text-6xl']]
</script>

<template>
  <main class="bg-wallpaper min-h-screen p-lg space-y-md">
    <section data-testid="colors" class="flex flex-wrap gap-sm">
      <div v-for="[name, cls] in colors" :key="name" class="text-sm">
        <div :class="[cls, 'h-16 w-24 rounded-card border border-ink/20']" :data-token="name" />
        {{ name }}
      </div>
    </section>
    <section data-testid="radii" class="flex gap-sm">
      <div v-for="[name, cls] in radii" :key="name" :class="[cls, 'bg-card h-20 w-20 shadow-card text-xs p-xs']" :data-token="name">{{ name }}</div>
    </section>
    <section data-testid="spacing" class="space-y-xs">
      <div v-for="[name, cls] in spaces" :key="name" class="text-xs">
        <div :class="[cls, 'bg-ink h-2']" :data-token="name" />{{ name }}
      </div>
    </section>
    <section data-testid="type" class="space-y-xs">
      <p v-for="[s, cls] in sizes" :key="s" :class="cls" :data-token="s">Plus Jakarta Sans {{ s }}</p>
    </section>
    <section data-testid="glass" class="p-lg">
      <div class="glass rounded-card p-md" data-token="glass">Glass panel</div>
    </section>
  </main>
</template>
