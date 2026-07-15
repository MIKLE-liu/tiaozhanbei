<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  jobs: string[]
}>()

const emit = defineEmits<{
  (e: 'select', name: string): void
}>()
</script>

<template>
  <div class="card p-5">
    <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
      关联岗位
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="job in jobs"
        :key="job"
        class="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
        @click="emit('select', job)"
      >
        {{ job }}
        <ArrowRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  </div>
</template>
