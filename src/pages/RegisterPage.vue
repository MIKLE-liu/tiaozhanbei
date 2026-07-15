<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const nickname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    userStore.setToken('mock-token')
    userStore.setUser({
      id: 'u-001',
      email: email.value,
      nickname: nickname.value || '新用户',
    })
    router.push('/jobs')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-6">
    <div class="card w-full max-w-md p-8">
      <div class="mb-8 flex flex-col items-center text-center">
        <div
          class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100"
        >
          <Sparkles class="h-7 w-7 text-primary-600" />
        </div>
        <h1 class="font-display text-2xl font-bold text-slate-900">
          创建星火智岗账号
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          开启你的智能职业规划
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleRegister"
      >
        <div>
          <label class="mb-1.5 block text-sm text-slate-600">昵称</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="nickname"
              type="text"
              placeholder="怎么称呼你"
              class="input-field w-full pl-10"
              required
            >
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-slate-600">邮箱</label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="input-field w-full pl-10"
              required
            >
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-slate-600">密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="password"
              type="password"
              placeholder="设置密码"
              class="input-field w-full pl-10"
              required
            >
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-slate-600">确认密码</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="再次输入密码"
              class="input-field w-full pl-10"
              required
            >
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <span v-if="loading">注册中...</span>
          <span
            v-else
            class="flex items-center justify-center gap-2"
          >
            注册
            <ArrowRight class="h-4 w-4" />
          </span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        已有账号？
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-700"
        >
          立即登录
        </router-link>
      </p>
    </div>
  </div>
</template>
