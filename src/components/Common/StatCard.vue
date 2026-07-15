<script setup lang="ts">
import { type Component } from 'vue'

defineProps<{
  label: string
  value: string | number
  icon: Component
  trend?: string
  accent?: 'blue' | 'amber'
}>()
</script>

<template>
  <div class="card-hover p-5">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-slate-500">
          {{ label }}
        </p>
        <p class="mt-2 font-display text-2xl font-bold text-slate-900">
          {{ value }}
        </p>
        <p
          v-if="trend"
          class="mt-1 text-xs font-medium text-emerald-600"
        >
          {{ trend }}
        </p>
      </div>
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl"
        :class="
          accent === 'amber'
            ? 'bg-amber-50 text-accent-amber'
            : 'bg-primary-50 text-primary-600'
        "
      >
        <component
          :is="icon"
          class="h-5 w-5"
        />
      </div>
    </div>
  </div>
</template>
