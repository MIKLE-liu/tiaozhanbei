<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    jobs: '岗位查询',
    'job-detail': '岗位详情',
    resume: 'AI 简历分析',
    'gap-analysis': '人岗差距分析',
    plan: '未来职业规划',
    'plan-result': '规划结果',
  }
  return titles[route.name as string] || ''
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <Sidebar />
    <TopBar>
      <template #title>
        <h1 class="font-display text-xl font-semibold text-slate-900">
          {{ pageTitle }}
        </h1>
      </template>
    </TopBar>

    <main class="ml-64 min-h-screen pt-16">
      <div class="animate-stagger p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
