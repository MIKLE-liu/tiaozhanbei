<script setup lang="ts">
import { Home } from 'lucide-vue-next'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-6 text-center">
    <div class="font-display text-8xl font-bold gradient-text">
      404
    </div>
    <h1 class="mt-4 text-2xl font-semibold text-slate-900">
      页面走丢了
    </h1>
    <p class="mt-2 text-slate-500">
      你访问的页面不存在或已被移除
    </p>
    <router-link
      to="/"
      class="btn-primary mt-6"
    >
      <Home class="h-4 w-4" />
      返回首页
    </router-link>
  </div>
</template>
