<script setup lang="ts">
import { Bell, User, LogOut } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <header
    class="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8"
  >
    <div>
      <slot name="title" />
    </div>

    <div class="flex items-center gap-4">
      <button
        class="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
      >
        <Bell class="h-5 w-5" />
        <span
          class="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-amber"
        />
      </button>

      <div
        v-if="userStore.isLoggedIn() && userStore.user"
        class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-1.5"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100"
        >
          <User class="h-4 w-4 text-primary-600" />
        </div>
        <span class="text-sm font-medium text-slate-800">
          {{ userStore.user.nickname }}
        </span>
        <button
          class="ml-2 text-slate-500 transition-colors hover:text-red-500"
          @click="userStore.logout"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>

      <router-link
        v-else
        to="/login"
        class="btn-secondary py-1.5"
      >
        <User class="h-4 w-4" />
        登录
      </router-link>
    </div>
  </header>
</template>
