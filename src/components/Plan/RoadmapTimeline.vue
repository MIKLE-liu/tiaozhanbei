<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { RoadmapStage } from '@/types/plan'

defineProps<{
  stages: RoadmapStage[]
}>()
</script>

<template>
  <div class="card p-6">
    <h3 class="mb-5 font-display text-base font-semibold text-slate-900">
      成长路线图
    </h3>
    <div class="relative flex flex-col gap-6 md:flex-row md:items-start">
      <div
        class="absolute left-6 top-0 hidden h-full w-px bg-slate-200 md:block"
      />

      <div
        v-for="stage in stages"
        :key="stage.stage"
        class="relative flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div
          class="absolute -left-2 top-4 hidden h-4 w-4 rounded-full border-2 border-white bg-primary-500 md:block"
        />
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {{ stage.stage }}
        </p>
        <p class="mt-1 font-display text-base font-semibold text-slate-900">
          {{ stage.title }}
        </p>
        <ul class="mt-3 space-y-1.5">
          <li
            v-for="item in stage.items"
            :key="item"
            class="flex items-center gap-2 text-sm text-slate-600"
          >
            <ArrowRight class="h-3 w-3 text-primary-500" />
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
