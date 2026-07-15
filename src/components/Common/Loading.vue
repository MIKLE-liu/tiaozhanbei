<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
    <div
      class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary-500"
    />
    <p
      v-if="text"
      class="text-sm"
    >
      {{ text }}
    </p>
  </div>
</template>
