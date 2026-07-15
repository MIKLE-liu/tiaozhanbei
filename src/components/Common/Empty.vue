<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
      <Inbox class="h-7 w-7 text-slate-400" />
    </div>
    <h3 class="text-base font-semibold text-slate-900">
      {{ title || '暂无数据' }}
    </h3>
    <p
      v-if="description"
      class="max-w-xs text-sm text-slate-500"
    >
      {{ description }}
    </p>
  </div>
</template>
