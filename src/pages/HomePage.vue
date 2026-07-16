<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Briefcase,
  FileText,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  Users,
  Award,
  BarChart3,
  Telescope,
} from 'lucide-vue-next'

const router = useRouter()

const features = [
  {
    icon: Briefcase,
    title: '岗位智能查询',
    desc: '覆盖互联网、金融、制造等热门领域，实时热度、薪资趋势、技能要求一目了然。',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FileText,
    title: 'AI 简历分析',
    desc: '上传简历即可智能解析，AI 对话式诊断竞争力，精准匹配岗位并给出提升建议。',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Compass,
    title: '职业规划',
    desc: '基于个人能力与市场趋势，生成专属成长路线与学习资源，助力长期职业发展。',
    color: 'bg-emerald-50 text-emerald-600',
  },
]

const highlights = [
  { icon: Target, label: '精准匹配', desc: 'AI 驱动的岗位推荐' },
  { icon: Zap, label: '即时反馈', desc: '秒级解析与对话分析' },
  { icon: BarChart3, label: '数据驱动', desc: '市场趋势与技能洞察' },
  { icon: Award, label: '成长路线', desc: '可执行的职业规划' },
]

const steps = [
  { num: '01', title: '探索岗位', desc: '浏览热门岗位与市场需求' },
  { num: '02', title: '上传简历', desc: 'AI 解析你的经历与技能' },
  { num: '03', title: '智能匹配', desc: '获取岗位匹配度与提升建议' },
  { num: '04', title: '规划未来', desc: '制定清晰的成长路线' },
]

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- 顶部导航 -->
    <header class="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100">
            <Sparkles class="h-5 w-5 text-primary-600" />
          </div>
          <span class="text-lg font-bold text-slate-900">星火智岗</span>
        </div>

        <nav class="hidden items-center gap-8 md:flex">
          <a href="#features" class="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600">核心功能</a>
          <a href="#how" class="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600">使用流程</a>
          <a href="#about" class="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600">关于我们</a>
        </nav>

        <div class="flex items-center gap-3">
          <button class="btn-ghost hidden sm:flex" @click="go('/login')">
            登录
          </button>
          <button class="btn-primary" @click="go('/jobs')">
            开始使用
          </button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-background pb-24 pt-40">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary-100/50 blur-3xl" />
        <div class="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-sky-100/40 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-7xl px-6 text-center">
        <div class="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-1.5 shadow-soft">
          <Sparkles class="h-4 w-4 text-primary-500" />
          <span class="text-xs font-medium text-primary-700">AI 驱动的职业成长平台</span>
        </div>

        <h1 class="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          为大学生打造的
          <span class="bg-gradient-to-r from-primary-600 to-sky-400 bg-clip-text text-transparent">智能就业助手</span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
          聚合热门岗位数据，AI 解析简历竞争力，生成专属职业规划。让每一步求职都有据可依。
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button class="btn-primary px-8 py-3 text-base" @click="go('/jobs')">
            浏览岗位
            <ArrowRight class="h-5 w-5" />
          </button>
          <button class="btn-secondary px-8 py-3 text-base" @click="go('/all-jobs')">
            <Telescope class="h-5 w-5" />
            探索职业星空
          </button>
        </div>

        <div class="mx-auto mt-20 max-w-5xl">
          <div class="relative rounded-3xl border border-slate-200 bg-white p-2 shadow-card">
            <div class="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary-100 to-sky-50 opacity-50 blur-sm" />
            <div class="relative rounded-2xl bg-slate-50 p-8">
              <div class="grid grid-cols-3 gap-6">
                <div class="rounded-2xl bg-white p-6 shadow-soft">
                  <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <TrendingUp class="h-5 w-5 text-blue-600" />
                  </div>
                  <div class="text-2xl font-bold text-slate-900">12,000+</div>
                  <div class="mt-1 text-sm text-slate-500">热门岗位数据</div>
                </div>
                <div class="rounded-2xl bg-white p-6 shadow-soft">
                  <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                    <Users class="h-5 w-5 text-sky-600" />
                  </div>
                  <div class="text-2xl font-bold text-slate-900">50,000+</div>
                  <div class="mt-1 text-sm text-slate-500">服务大学生</div>
                </div>
                <div class="rounded-2xl bg-white p-6 shadow-soft">
                  <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <CheckCircle2 class="h-5 w-5 text-emerald-600" />
                  </div>
                  <div class="text-2xl font-bold text-slate-900">92%</div>
                  <div class="mt-1 text-sm text-slate-500">简历匹配准确率</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section id="features" class="py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center">
          <h2 class="section-title text-3xl">三大核心功能</h2>
          <p class="mx-auto mt-3 max-w-2xl text-slate-500">
            从岗位洞察到简历优化，再到长期规划，覆盖求职全链路
          </p>
        </div>

        <div class="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="item in features"
            :key="item.title"
            class="card-hover p-8"
          >
            <div
              class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
              :class="item.color"
            >
              <component :is="item.icon" class="h-7 w-7" />
            </div>
            <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-500">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 亮点 -->
    <section class="bg-background py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 class="section-title text-3xl leading-snug">
              让数据与 AI 为你的职业决策
              <span class="text-primary-600">赋能</span>
            </h2>
            <p class="mt-5 text-slate-500">
              我们整合了市场需求、技能趋势与个人履历，帮助你更快找到适合自己的方向，避免盲目投递与试错。
            </p>
            <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div
                v-for="item in highlights"
                :key="item.label"
                class="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <component :is="item.icon" class="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div class="font-semibold text-slate-900">{{ item.label }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ item.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary-100/50 to-sky-100/50 blur-2xl" />
            <div class="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-full bg-slate-100" />
                  <div class="flex-1 space-y-2">
                    <div class="h-3 w-1/3 rounded bg-slate-100" />
                    <div class="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div class="rounded-2xl bg-slate-50 p-5">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-slate-700">AI 匹配度分析</span>
                    <span class="text-lg font-bold text-primary-600">86%</span>
                  </div>
                  <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full w-[86%] rounded-full bg-gradient-to-r from-primary-500 to-sky-400" />
                  </div>
                  <p class="mt-3 text-xs text-slate-500">
                    你的项目经验与该岗位匹配度较高，建议补充分布式系统相关知识。
                  </p>
                </div>
                <div class="flex gap-3">
                  <div class="badge">Java</div>
                  <div class="badge">Spring Boot</div>
                  <div class="badge">MySQL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section id="how" class="py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center">
          <h2 class="section-title text-3xl">简单四步，开启职业成长</h2>
          <p class="mx-auto mt-3 max-w-2xl text-slate-500">
            无需复杂配置，快速上手使用
          </p>
        </div>

        <div class="mt-14 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div
            v-for="(step, index) in steps"
            :key="step.num"
            class="relative"
          >
            <div v-if="index < steps.length - 1" class="absolute left-full top-12 hidden h-0.5 w-full -translate-x-6 bg-slate-100 md:block" />
            <div class="card p-6 text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-lg font-bold text-primary-600">
                {{ step.num }}
              </div>
              <h3 class="font-semibold text-slate-900">{{ step.title }}</h3>
              <p class="mt-2 text-xs text-slate-500">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24">
      <div class="mx-auto max-w-5xl px-6">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 px-8 py-16 text-center text-white shadow-float sm:px-16">
          <div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div class="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
          <div class="relative">
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">准备好找到你的理想岗位了吗？</h2>
            <p class="mx-auto mt-4 max-w-xl text-primary-100">
              立即体验星火智岗，让 AI 帮你洞察市场、优化简历、规划未来。
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button class="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-primary-600 shadow-soft transition-all hover:bg-primary-50 active:scale-[0.98]" @click="go('/jobs')">
                开始探索
              </button>
              <button class="rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]" @click="go('/register')">
                免费注册
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="about" class="border-t border-slate-100 bg-slate-50 py-12">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100">
              <Sparkles class="h-5 w-5 text-primary-600" />
            </div>
            <span class="text-lg font-bold text-slate-900">星火智岗</span>
          </div>
          <p class="text-sm text-slate-500">
            © 2026 星火智岗. 助力每一位大学生找到理想职业方向。
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-sm text-slate-500 hover:text-primary-600">关于我们</a>
            <a href="#" class="text-sm text-slate-500 hover:text-primary-600">使用条款</a>
            <a href="#" class="text-sm text-slate-500 hover:text-primary-600">隐私政策</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
