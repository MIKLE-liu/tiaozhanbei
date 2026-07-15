<script setup lang="ts">
import { BookOpen, Star } from 'lucide-vue-next'
import type { LearningResource } from '@/types/plan'

defineProps<{
  resource: LearningResource
}>()
</script>

<template>
  <div class="card-hover flex flex-col p-5">
    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
      <BookOpen class="h-5 w-5 text-primary-600" />
    </div>
    <h4 class="font-display text-base font-semibold text-slate-900">
      {{ resource.title }}
    </h4>
    <p class="mt-1 text-xs text-slate-500">
      {{ resource.type }}
    </p>
    <div class="mt-4 flex items-center gap-1.5 text-xs text-accent-amber">
      <Star class="h-3.5 w-3.5 fill-current" />
      {{ resource.tag }}
    </div>
  </div>
</template>
