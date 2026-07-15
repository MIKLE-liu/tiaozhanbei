<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
} from 'lucide-vue-next'
import PageHeader from '@/components/Common/PageHeader.vue'
import Loading from '@/components/Common/Loading.vue'
import DirectionRanking from '@/components/Plan/DirectionRanking.vue'
import RoadmapTimeline from '@/components/Plan/RoadmapTimeline.vue'
import StageTaskList from '@/components/Plan/StageTaskList.vue'
import CourseCard from '@/components/Plan/CourseCard.vue'
import { mockPlanResult } from '@/mock/plan'
import type { PlanResult } from '@/types/plan'

const route = useRoute()
const router = useRouter()

const result = ref<PlanResult | null>(null)
const loading = ref(false)

function goBack() {
  router.push('/plan')
}

function toggleTask(index: number) {
  if (!result.value) return
  result.value.currentTasks[index].done = !result.value.currentTasks[index].done
}

onMounted(async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    result.value = {
      ...mockPlanResult,
      planId: route.params.id as string,
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <button
      class="btn-ghost pl-0"
      @click="goBack"
    >
      <ArrowLeft class="h-4 w-4" />
      返回评估
    </button>

    <PageHeader
      title="你的职业规划"
      subtitle="计算机科学与技术 · 大三 · 推荐方向：AI 工程师"
    />

    <Loading
      v-if="loading"
      text="加载规划结果..."
    />

    <div
      v-else-if="result"
      class="space-y-6"
    >
      <DirectionRanking :directions="result.directions" />

      <RoadmapTimeline :stages="result.roadmap" />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <StageTaskList
            :tasks="result.currentTasks"
            @toggle="toggleTask"
          />
        </div>
        <div>
          <div class="card p-5">
            <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
              推荐学习资源
            </h3>
            <div class="space-y-3">
              <CourseCard
                v-for="resource in result.resources"
                :key="resource.title"
                :resource="resource"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button class="btn-secondary">
          <Share2 class="h-4 w-4" />
          分享
        </button>
        <button class="btn-secondary">
          <RefreshCw class="h-4 w-4" />
          重新生成
        </button>
        <button class="btn-primary">
          <Download class="h-4 w-4" />
          导出规划
        </button>
      </div>
    </div>
  </div>
</template>
