<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  Briefcase,
  FileText,
  Compass,
  LogIn,
  UserPlus,
  Sparkles,
  Telescope,
} from 'lucide-vue-next'

const route = useRoute()

const mainNav = [
  { name: 'jobs', label: '岗位查询', icon: Briefcase, path: '/jobs' },
  { name: 'all-jobs', label: '全部职业', icon: Telescope, path: '/all-jobs' },
  { name: 'resume', label: 'AI 简历分析', icon: FileText, path: '/resume' },
  { name: 'plan', label: '职业规划', icon: Compass, path: '/plan' },
]

const authNav = [
  { name: 'login', label: '登录', icon: LogIn, path: '/login' },
  { name: 'register', label: '注册', icon: UserPlus, path: '/register' },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white"
  >
    <div class="flex h-16 items-center gap-3 px-6">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100"
      >
        <Sparkles class="h-5 w-5 text-primary-600" />
      </div>
      <span class="font-display text-lg font-bold text-slate-900">星火智岗</span>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-4">
      <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        核心板块
      </p>
      <router-link
        v-for="item in mainNav"
        :key="item.name"
        :to="item.path"
        class="group flex items-center gap-3 rounded-r-xl px-3 py-2.5 text-sm font-medium transition-all"
        :class="
          isActive(item.path)
            ? 'border-l-4 border-primary-600 bg-primary-50 text-primary-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        "
      >
        <component
          :is="item.icon"
          class="h-[18px] w-[18px] transition-transform group-hover:scale-110"
        />
        {{ item.label }}
      </router-link>
    </nav>

    <div class="border-t border-slate-200 p-3">
      <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        账户
      </p>
      <router-link
        v-for="item in authNav"
        :key="item.name"
        :to="item.path"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
      >
        <component
          :is="item.icon"
          class="h-[18px] w-[18px] transition-transform group-hover:scale-110"
        />
        {{ item.label }}
      </router-link>
    </div>
  </aside>
</template>
