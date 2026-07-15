<script setup lang="ts">
import { CheckSquare, Square, Clock } from 'lucide-vue-next'
import type { StageTask } from '@/types/plan'

const props = defineProps<{
  tasks: StageTask[]
}>()

const emit = defineEmits<{
  (e: 'toggle', index: number): void
}>()
</script>

<template>
  <div class="card p-6">
    <div class="mb-5 flex items-center gap-2">
      <Clock class="h-5 w-5 text-accent-amber" />
      <h3 class="font-display text-base font-semibold text-slate-900">
        当前阶段任务清单
      </h3>
    </div>

    <div class="space-y-3">
      <button
        v-for="(task, index) in props.tasks"
        :key="task.title"
        class="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-slate-300"
        @click="emit('toggle', index)"
      >
        <component
          :is="task.done ? CheckSquare : Square"
          class="h-5 w-5 flex-shrink-0"
          :class="task.done ? 'text-emerald-600' : 'text-slate-500'"
        />
        <div class="flex-1">
          <p
            class="text-sm font-medium"
            :class="task.done ? 'text-slate-500 line-through' : 'text-slate-800'"
          >
            {{ task.title }}
          </p>
        </div>
        <span class="text-xs text-slate-500">{{ task.duration }}</span>
      </button>
    </div>
  </div>
</template>
