<script setup lang="ts">
import type { Direction } from '@/types/plan'

defineProps<{
  directions: Direction[]
}>()

const medals = ['🥇', '🥈', '🥉']

function progressColor(score: number) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 75) return 'bg-primary-500'
  return 'bg-accent-amber'
}
</script>

<template>
  <div class="card p-6">
    <h3 class="mb-5 font-display text-base font-semibold text-slate-900">
      推荐方向 Top 3
    </h3>
    <div class="space-y-4">
      <div
        v-for="(item, index) in directions"
        :key="item.name"
        class="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ medals[index] || '•' }}</span>
            <div>
              <p class="font-display text-lg font-semibold text-slate-900">
                {{ item.name }}
              </p>
              <p class="text-xs text-slate-500">
                {{ item.reason }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-display text-2xl font-bold text-slate-900">
              {{ item.score }}%
            </p>
            <p class="text-xs text-slate-500">
              匹配度
            </p>
          </div>
        </div>
        <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="progressColor(item.score)"
            :style="{ width: `${item.score}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
