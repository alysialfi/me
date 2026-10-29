<script setup lang="ts">
defineProps<{ kind: 'folder' | 'pdf' | 'image' }>()
</script>

<template>
  <svg v-if="kind === 'folder'" viewBox="0 0 64 52" class="h-12 w-14" aria-hidden="true">
    <path d="M4 8a4 4 0 0 1 4-4h14l6 6h28a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#8DC8F0" />
    <path d="M4 16h56v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#BFE2FA" />
  </svg>
  <svg v-else viewBox="0 0 48 56" class="h-12 w-10" aria-hidden="true">
    <path d="M6 4h26l10 10v38a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#2F3B3A" stroke-opacity=".35" />
    <path d="M32 4v10h10z" fill="#D5D4CD" />
    <rect v-if="kind === 'pdf'" x="9" y="34" width="26" height="12" rx="2" fill="#E5484D" />
    <text v-if="kind === 'pdf'" x="22" y="43.5" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="sans-serif">PDF</text>
    <template v-else>
      <rect x="9" y="26" width="26" height="20" rx="2" fill="#CDE6C5" />
      <circle cx="16" cy="32" r="3" fill="#F1C8CC" />
      <path d="M9 46l9-10 6 6 5-4 6 8z" fill="#809B98" />
    </template>
  </svg>
</template>
