<script setup lang="ts">
import { SlidersHorizontal, ArrowDownUp } from 'lucide-vue-next'

defineProps<{
  sortBy: string
  education: string
  experience: string
}>()

const emit = defineEmits<{
  (e: 'update:sortBy', value: string): void
  (e: 'update:education', value: string): void
  (e: 'update:experience', value: string): void
}>()

const sortOptions = [
  { value: 'hot', label: '热度' },
  { value: 'salary', label: '薪资' },
  { value: 'trend', label: '趋势' },
]

const educationOptions = ['不限', '大专', '本科', '硕士', '博士']
const experienceOptions = ['不限', '应届', '1-3年', '3-5年', '5年以上']
</script>

<template>
  <div class="card flex flex-wrap items-center gap-4 px-5 py-3">
    <div class="flex items-center gap-2 text-sm text-slate-600">
      <ArrowDownUp class="h-4 w-4 text-slate-500" />
      <span>排序：</span>
      <select
        :value="sortBy"
        class="input-field py-1.5 pr-8 text-sm"
        @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in sortOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="h-5 w-px bg-slate-200" />

    <div class="flex items-center gap-2 text-sm text-slate-600">
      <SlidersHorizontal class="h-4 w-4 text-slate-500" />
      <span>筛选：</span>
      <select
        :value="education"
        class="input-field py-1.5 pr-8 text-sm"
        @change="emit('update:education', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in educationOptions"
          :key="opt"
          :value="opt === '不限' ? '' : opt"
        >
          学历 {{ opt }}
        </option>
      </select>
      <select
        :value="experience"
        class="input-field py-1.5 pr-8 text-sm"
        @change="emit('update:experience', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in experienceOptions"
          :key="opt"
          :value="opt === '不限' ? '' : opt"
        >
          经验 {{ opt }}
        </option>
      </select>
    </div>
  </div>
</template>
