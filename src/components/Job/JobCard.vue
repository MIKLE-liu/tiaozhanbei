<script setup lang="ts">
import { Flame, TrendingUp, Wallet, Layers } from 'lucide-vue-next'
import type { Job } from '@/types/job'

defineProps<{
  job: Job
}>()

const emit = defineEmits<{
  (e: 'view-detail', id: string): void
  (e: 'compare', id: string): void
}>()

function fireLevel(level: number) {
  return Array.from({ length: 5 }, (_, i) => (i < level ? '🔥' : '·')).join('')
}
</script>

<template>
  <div class="card-hover flex flex-col p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-display text-lg font-semibold text-slate-900">
          {{ job.name }}
        </h3>
        <div class="mt-1 flex items-center gap-2 text-sm">
          <span class="text-accent-amber">{{ fireLevel(job.hot) }}</span>
          <span class="text-xs text-slate-500">热度</span>
        </div>
      </div>
      <span class="badge-slate">
        {{ job.domain }}
      </span>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="skill in job.skills"
        :key="skill"
        class="badge"
      >
        {{ skill }}
      </span>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div class="flex items-center gap-2 text-slate-600">
        <TrendingUp class="h-4 w-4 text-emerald-600" />
        <span>需求趋势 ↑{{ job.trend }}%</span>
      </div>
      <div class="flex items-center gap-2 text-slate-600">
        <Wallet class="h-4 w-4 text-accent-amber" />
        <span>平均薪资 {{ job.salary }}</span>
      </div>
      <div class="flex items-center gap-2 text-slate-600">
        <Layers class="h-4 w-4 text-slate-500" />
        <span>相关领域 {{ job.domain }}</span>
      </div>
      <div class="flex items-center gap-2 text-slate-600">
        <Flame class="h-4 w-4 text-red-400" />
        <span>热度指数 {{ job.hot }}/5</span>
      </div>
    </div>

    <div class="mt-5 flex gap-3">
      <button
        class="btn-primary flex-1 text-sm"
        @click="emit('view-detail', job.id)"
      >
        查看详情
      </button>
      <button
        class="btn-secondary flex-1 text-sm"
        @click="emit('compare', job.id)"
      >
        对比
      </button>
    </div>
  </div>
</template>
