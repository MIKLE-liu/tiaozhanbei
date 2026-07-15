<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Flame,
  TrendingUp,
  Wallet,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-vue-next'
import Loading from '@/components/Common/Loading.vue'
import SkillRadar from '@/components/Job/SkillRadar.vue'
import TrendChart from '@/components/Job/TrendChart.vue'
import RelatedJobs from '@/components/Job/RelatedJobs.vue'
import { fetchJobDetail } from '@/api/jobs'
import type { JobDetail } from '@/types/job'
import { useAppStore } from '@/stores/appStore'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const job = ref<JobDetail | null>(null)
const loading = ref(false)

function starLevel(level: number) {
  return '⭐'.repeat(level)
}

function goBack() {
  router.push('/jobs')
}

function analyzeMatch() {
  appStore.selectJob(job.value!.id)
  router.push('/resume')
}

function addToCompare() {
  // TODO: 实现岗位对比功能
}

function onRelatedSelect(name: string) {
  // TODO: 实现关联岗位跳转
  window.alert(`关联岗位：${name}`)
}

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    job.value = await fetchJobDetail(id)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    v-if="loading"
    class="py-20"
  >
    <Loading text="加载岗位详情中..." />
  </div>

  <div
    v-else-if="job"
    class="space-y-6"
  >
    <button
      class="btn-ghost pl-0"
      @click="goBack"
    >
      <ArrowLeft class="h-4 w-4" />
      返回列表
    </button>

    <div class="card p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h2 class="font-display text-3xl font-bold text-slate-900">
            {{ job.name }}
          </h2>
          <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span class="flex items-center gap-1.5">
              <Flame class="h-4 w-4 text-accent-amber" />
              热度 {{ '🔥'.repeat(job.hot) }}
            </span>
            <span class="flex items-center gap-1.5">
              <TrendingUp class="h-4 w-4 text-emerald-600" />
              需求趋势 ↑{{ job.trend }}%
            </span>
            <span class="flex items-center gap-1.5">
              <Wallet class="h-4 w-4 text-primary-600" />
              平均薪资 {{ job.salary }}
            </span>
            <span class="flex items-center gap-1.5">
              <GraduationCap class="h-4 w-4 text-slate-500" />
              学历要求 {{ job.education }}
            </span>
            <span class="flex items-center gap-1.5">
              <Briefcase class="h-4 w-4 text-slate-500" />
              经验要求 {{ job.experience }}
            </span>
            <span class="flex items-center gap-1.5">
              <Layers class="h-4 w-4 text-slate-500" />
              相关领域 {{ job.domain }}
            </span>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="btn-secondary"
            @click="addToCompare"
          >
            <Plus class="h-4 w-4" />
            加入对比
          </button>
          <button
            class="btn-primary"
            @click="analyzeMatch"
          >
            <Sparkles class="h-4 w-4" />
            AI 分析匹配度
          </button>
        </div>
      </div>
      <p
        v-if="job.description"
        class="mt-5 text-sm leading-relaxed text-slate-600"
      >
        {{ job.description }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card p-5">
        <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
          技能要求雷达图
        </h3>
        <SkillRadar :skills="job.skillList" />
      </div>

      <div class="card p-5">
        <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
          技能清单
        </h3>
        <div class="space-y-3">
          <div
            v-for="skill in job.skillList"
            :key="skill.name"
            class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <span
                class="rounded-lg px-2.5 py-1 text-xs font-medium"
                :class="
                  skill.type === '必备'
                    ? 'badge'
                    : skill.type === '重要'
                      ? 'badge-amber'
                      : 'badge-slate'
                "
              >
                {{ skill.type }}
              </span>
              <span class="text-sm font-medium text-slate-800">{{ skill.name }}</span>
            </div>
            <span class="text-sm tracking-wider text-slate-600">{{ starLevel(skill.level) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
        技能需求趋势变化（近 12 个月）
      </h3>
      <TrendChart :data="job.trendData" />
    </div>

    <RelatedJobs
      :jobs="job.relatedJobs"
      @select="onRelatedSelect"
    />
  </div>
</template>
