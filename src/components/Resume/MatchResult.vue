<script setup lang="ts">
import { Target, ChevronRight } from 'lucide-vue-next'
import type { MatchItem } from '@/types/resume'

defineProps<{
  matches: MatchItem[]
}>()

const emit = defineEmits<{
  (e: 'view-gap', jobId: string): void
}>()

function progressColor(score: number) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-accent-amber'
  return 'bg-red-400'
}
</script>

<template>
  <div class="card p-5">
    <div class="mb-4 flex items-center gap-2">
      <Target class="h-5 w-5 text-primary-600" />
      <h3 class="font-display text-base font-semibold text-slate-900">
        匹配结果
      </h3>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in matches"
        :key="item.jobId"
        class="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1">
            <p class="font-medium text-slate-800">
              {{ item.jobName }}
            </p>
            <p
              v-if="item.gapSkills.length"
              class="mt-1 text-xs text-slate-500"
            >
              建议补齐：{{ item.gapSkills.join('、') }}
            </p>
            <p
              v-else
              class="mt-1 text-xs text-emerald-600"
            >
              技能已满足核心要求
            </p>
          </div>
          <div class="text-right">
            <p class="font-display text-xl font-bold text-slate-900">
              {{ item.score }}%
            </p>
            <p class="text-xs text-slate-500">
              匹配度
            </p>
          </div>
        </div>

        <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="progressColor(item.score)"
            :style="{ width: `${item.score}%` }"
          />
        </div>

        <button
          class="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
          @click="emit('view-gap', item.jobId)"
        >
          查看详细差距分析
          <ChevronRight class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
