<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Target, Compass } from 'lucide-vue-next'
import PageHeader from '@/components/Common/PageHeader.vue'
import Loading from '@/components/Common/Loading.vue'
import GapRadar from '@/components/Resume/GapRadar.vue'
import SuggestionTable from '@/components/Resume/SuggestionTable.vue'
import { fetchGapAnalysis } from '@/api/resume'
import type { GapAnalysisResult } from '@/types/resume'

const route = useRoute()
const router = useRouter()

const result = ref<GapAnalysisResult | null>(null)
const loading = ref(false)

function goBack() {
  router.push('/resume')
}

function goPlan() {
  router.push('/plan')
}

onMounted(async () => {
  const jobId = route.params.jobId as string
  loading.value = true
  try {
    result.value = await fetchGapAnalysis('r-001', jobId)
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
      返回简历分析
    </button>

    <PageHeader
      :title="`人岗差距分析 — ${result?.jobName || ''}`"
      subtitle="量化当前能力与岗位要求的差距，获取针对性提升建议"
    />

    <Loading
      v-if="loading"
      text="正在生成差距分析..."
    />

    <div
      v-else-if="result"
      class="space-y-6"
    >
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="card p-5">
          <div class="mb-4 flex items-center gap-2">
            <Target class="h-5 w-5 text-primary-600" />
            <h3 class="font-display text-base font-semibold text-slate-900">
              能力对比雷达图
            </h3>
          </div>
          <GapRadar
            :current-skills="result.currentSkills"
            :required-skills="result.requiredSkills"
          />
        </div>

        <div class="card p-5">
          <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
            能力明细
          </h3>
          <div class="space-y-3">
            <div
              v-for="(skill, index) in result.requiredSkills"
              :key="skill.name"
              class="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-800">{{ skill.name }}</span>
                <span class="text-xs text-slate-500">
                  当前 {{ result.currentSkills[index]?.score ?? 0 }} / 要求 {{ skill.score }}
                </span>
              </div>
              <div class="mt-2 flex h-2 gap-1 overflow-hidden rounded-full bg-white">
                <div
                  class="h-full rounded-full bg-accent-amber"
                  :style="{ width: `${result.currentSkills[index]?.score ?? 0}%` }"
                />
                <div
                  class="h-full rounded-full bg-slate-200"
                  :style="{ width: `${Math.max(0, skill.score - (result.currentSkills[index]?.score ?? 0))}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuggestionTable :suggestions="result.suggestions" />

      <div class="flex justify-end">
        <button
          class="btn-primary"
          @click="goPlan"
        >
          <Compass class="h-4 w-4" />
          生成职业规划
        </button>
      </div>
    </div>
  </div>
</template>
