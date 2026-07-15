<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/Common/PageHeader.vue'
import SelfAssessment from '@/components/Plan/SelfAssessment.vue'
import HotDirectionCard from '@/components/Plan/HotDirectionCard.vue'
import Loading from '@/components/Common/Loading.vue'
import { generatePlan } from '@/api/plan'
import type { PlanForm, PlanResult } from '@/types/plan'

const router = useRouter()

const form = ref<PlanForm>({
  major: '计算机科学与技术',
  grade: '大三',
  interests: ['算法', '开发'],
  skills: ['Python', 'Java', 'SQL', '数据结构'],
})

const generating = ref(false)

const hotDirections = [
  { name: 'AI', heat: 32, trend: 'up' as const },
  { name: '后端', heat: 18, trend: 'flat' as const },
  { name: '前端', heat: 12, trend: 'down' as const },
  { name: '数据', heat: 25, trend: 'up' as const },
  { name: '安全', heat: 15, trend: 'up' as const },
]

async function handleSubmit() {
  generating.value = true
  try {
    const result: PlanResult = await generatePlan(form.value)
    router.push(`/plan/result/${result.planId}`)
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="未来职业规划"
      subtitle="认识自己，结合市场热度，生成专属成长路线"
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <SelfAssessment
          v-model="form"
          @submit="handleSubmit"
        />
        <Loading
          v-if="generating"
          text="AI 正在生成职业规划..."
        />
      </div>

      <div>
        <div class="card p-6">
          <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
            热门方向速览
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <HotDirectionCard
              v-for="item in hotDirections"
              :key="item.name"
              v-bind="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
