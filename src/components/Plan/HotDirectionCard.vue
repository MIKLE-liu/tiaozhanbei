<script setup lang="ts">
import { TrendingUp, Minus, TrendingDown } from 'lucide-vue-next'

defineProps<{
  name: string
  heat: number
  trend: 'up' | 'flat' | 'down'
}>()

function trendIcon() {
  return { up: TrendingUp, flat: Minus, down: TrendingDown }
}

function trendColor(trend: string) {
  if (trend === 'up') return 'text-emerald-600'
  if (trend === 'down') return 'text-red-400'
  return 'text-slate-500'
}
</script>

<template>
  <div class="card-hover flex flex-col items-center justify-center p-5 text-center">
    <p class="font-display text-lg font-semibold text-slate-900">
      {{ name }}
    </p>
    <div class="mt-2 flex items-center gap-1.5 text-sm">
      <span class="text-accent-amber">🔥{{ heat }}%</span>
      <span class="text-slate-500">热度</span>
    </div>
    <div
      class="mt-2 flex items-center gap-1 text-xs"
      :class="trendColor(trend)"
    >
      <component
        :is="trendIcon()[trend]"
        class="h-3.5 w-3.5"
      />
      <span>{{ trend === 'up' ? '上升' : trend === 'down' ? '下降' : '平稳' }}</span>
    </div>
  </div>
</template>
