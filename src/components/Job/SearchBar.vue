<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  hotSearches?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'select-hot', value: string): void
}>()

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  },
)

function handleSearch() {
  emit('update:modelValue', localValue.value)
  emit('search')
}
</script>

<template>
  <div class="card p-5">
    <div class="flex gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="localValue"
          type="text"
          placeholder="输入岗位 / 技能 / 关键词"
          class="input-field w-full pl-10"
          @keyup.enter="handleSearch"
        >
      </div>
      <button
        class="btn-primary px-6"
        @click="handleSearch"
      >
        <Search class="h-4 w-4" />
        查询
      </button>
    </div>

    <div
      v-if="hotSearches?.length"
      class="mt-4 flex flex-wrap items-center gap-2"
    >
      <span class="text-xs text-slate-500">热门搜索：</span>
      <button
        v-for="tag in hotSearches"
        :key="tag"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
        @click="emit('select-hot', tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>
