<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-6">
    <h2 class="section-title">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="section-subtitle mt-1"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
