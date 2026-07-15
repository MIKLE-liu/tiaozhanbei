<script setup lang="ts">
import { User, GraduationCap, Clock, Tag, FolderGit2, Pencil } from 'lucide-vue-next'
import type { ParsedResume } from '@/types/resume'

defineProps<{
  data: ParsedResume
}>()
</script>

<template>
  <div class="card p-6">
    <div class="mb-5 flex items-center justify-between">
      <h3 class="font-display text-base font-semibold text-slate-900">
        第二步：AI 解析结果
      </h3>
      <button class="btn-ghost py-1.5 text-xs text-primary-600 hover:text-primary-700">
        <Pencil class="h-3.5 w-3.5" />
        编辑修正
      </button>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="space-y-3">
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <User class="h-4 w-4 text-primary-600" />
          <div>
            <p class="text-xs text-slate-500">
              姓名
            </p>
            <p class="text-sm font-medium text-slate-800">
              {{ data.name }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <GraduationCap class="h-4 w-4 text-primary-600" />
          <div>
            <p class="text-xs text-slate-500">
              学历
            </p>
            <p class="text-sm font-medium text-slate-800">
              {{ data.education }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Clock class="h-4 w-4 text-primary-600" />
          <div>
            <p class="text-xs text-slate-500">
              经验
            </p>
            <p class="text-sm font-medium text-slate-800">
              {{ data.experience }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div class="mb-3 flex items-center gap-2">
          <Tag class="h-4 w-4 text-accent-amber" />
          <span class="text-sm font-semibold text-slate-800">技能标签</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in data.skills"
            :key="skill"
            class="badge-amber"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div class="mb-3 flex items-center gap-2">
        <FolderGit2 class="h-4 w-4 text-emerald-600" />
        <span class="text-sm font-semibold text-slate-800">项目 / 工作经历</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="project in data.projects"
          :key="project.name"
          class="border-l-2 border-primary-200 pl-4"
        >
          <p class="text-sm font-medium text-slate-800">
            {{ project.name }}
            <span class="ml-2 text-xs text-slate-500">({{ project.period }})</span>
          </p>
          <p class="mt-1 text-xs text-slate-500">
            技术栈：{{ project.stack }}
          </p>
          <p
            v-if="project.description"
            class="mt-1 text-xs text-slate-500"
          >
            {{ project.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
