<script setup lang="ts">
defineProps<{
  domains: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="domain in domains"
      :key="domain"
      class="rounded-xl px-4 py-2 text-sm font-medium transition-all"
      :class="
        modelValue === domain
          ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
      "
      @click="emit('update:modelValue', domain)"
    >
      {{ domain }}
    </button>
  </div>
</template>
