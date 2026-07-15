<script setup lang="ts">
import { ref, computed } from 'vue'
import { GraduationCap, Rocket, Plus, X } from 'lucide-vue-next'
import type { Grade, Interest, PlanForm } from '@/types/plan'

const props = defineProps<{
  modelValue: PlanForm
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PlanForm): void
  (e: 'submit'): void
}>()

const grades: Grade[] = ['大一', '大二', '大三', '大四', '研究生']
const interests: Interest[] = ['算法', '开发', '产品', '数据', '安全', '硬件']
const skillOptions = ['Python', 'Java', 'SQL', '数据结构', 'C++', 'JavaScript', 'PyTorch', 'Vue/React']

const newSkill = ref('')

const local = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function toggleInterest(item: Interest) {
  const list = [...local.value.interests]
  const idx = list.indexOf(item)
  if (idx > -1) {
    list.splice(idx, 1)
  } else {
    list.push(item)
  }
  local.value = { ...local.value, interests: list }
}

function addSkill() {
  const skill = newSkill.value.trim()
  if (skill && !local.value.skills.includes(skill)) {
    local.value = { ...local.value, skills: [...local.value.skills, skill] }
    newSkill.value = ''
  }
}

function removeSkill(skill: string) {
  local.value = {
    ...local.value,
    skills: local.value.skills.filter((s) => s !== skill),
  }
}

function addPresetSkill(skill: string) {
  if (!local.value.skills.includes(skill)) {
    local.value = { ...local.value, skills: [...local.value.skills, skill] }
  }
}
</script>

<template>
  <div class="card p-6">
    <h3 class="mb-5 font-display text-base font-semibold text-slate-900">
      第一步：认识自己
    </h3>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label class="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap class="h-4 w-4 text-primary-600" />
          专业
        </label>
        <input
          v-model="local.major"
          type="text"
          placeholder="例如：计算机科学与技术"
          class="input-field w-full"
        >
      </div>

      <div>
        <label class="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <Rocket class="h-4 w-4 text-primary-600" />
          年级
        </label>
        <select
          v-model="local.grade"
          class="input-field w-full"
        >
          <option
            v-for="g in grades"
            :key="g"
            :value="g"
          >
            {{ g }}
          </option>
        </select>
      </div>
    </div>

    <div class="mt-5">
      <label class="mb-2 block text-sm text-slate-600">兴趣方向（多选）</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in interests"
          :key="item"
          class="rounded-xl px-4 py-2 text-sm font-medium transition-all"
          :class="
            local.interests.includes(item)
              ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          "
          @click="toggleInterest(item)"
        >
          {{ local.interests.includes(item) ? '✓ ' : '' }}{{ item }}
        </button>
      </div>
    </div>

    <div class="mt-5">
      <label class="mb-2 block text-sm text-slate-600">已有技能（可搜索添加）</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="skill in skillOptions"
          :key="skill"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
          @click="addPresetSkill(skill)"
        >
          + {{ skill }}
        </button>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span
          v-for="skill in local.skills"
          :key="skill"
          class="badge-amber flex items-center gap-1"
        >
          {{ skill }}
          <button
            class="hover:text-red-500"
            @click="removeSkill(skill)"
          >
            <X class="h-3 w-3" />
          </button>
        </span>
        <div class="flex items-center gap-2">
          <input
            v-model="newSkill"
            type="text"
            placeholder="输入技能"
            class="input-field w-32 py-1.5 text-xs"
            @keyup.enter="addSkill"
          >
          <button
            class="rounded-xl bg-slate-100 p-1.5 text-slate-600 transition-colors hover:bg-slate-200"
            @click="addSkill"
          >
            <Plus class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <button
      class="btn-primary mt-6 w-full"
      @click="emit('submit')"
    >
      <Rocket class="h-4 w-4" />
      生成我的职业规划
    </button>
  </div>
</template>
