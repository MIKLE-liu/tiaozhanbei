<script setup lang="ts">
import { AlertTriangle, Lightbulb } from 'lucide-vue-next'
import type { GapSuggestion } from '@/types/resume'

defineProps<{
  suggestions: GapSuggestion[]
}>()

function gapColor(gap: string) {
  if (gap === '完全缺失') return 'text-red-500 bg-red-50'
  if (gap === '严重') return 'text-orange-500 bg-orange-50'
  if (gap === '中等') return 'text-amber-600 bg-amber-50'
  return 'text-emerald-600 bg-emerald-50'
}
</script>

<template>
  <div class="card p-5">
    <div class="mb-4 flex items-center gap-2">
      <Lightbulb class="h-5 w-5 text-accent-amber" />
      <h3 class="font-display text-base font-semibold text-slate-900">
        短板 & 改进建议
      </h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <th class="pb-3 pl-2 font-medium">
              技能
            </th>
            <th class="pb-3 font-medium">
              差距
            </th>
            <th class="pb-3 font-medium">
              建议行动
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="item in suggestions"
            :key="item.skill"
            class="group"
          >
            <td class="py-4 pl-2">
              <div class="flex items-center gap-2">
                <AlertTriangle
                  class="h-4 w-4"
                  :class="item.gap === '完全缺失' || item.gap === '严重' ? 'text-red-400' : 'text-accent-amber'"
                />
                <span class="font-medium text-slate-800">{{ item.skill }}</span>
              </div>
            </td>
            <td class="py-4">
              <span
                class="rounded-lg px-2.5 py-1 text-xs font-medium"
                :class="gapColor(item.gap)"
              >
                {{ item.gap }}
              </span>
            </td>
            <td class="py-4">
              <ul class="space-y-1">
                <li
                  v-for="(action, idx) in item.actions"
                  :key="idx"
                  class="flex items-start gap-2 text-slate-500"
                >
                  <span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary-500" />
                  {{ action }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
