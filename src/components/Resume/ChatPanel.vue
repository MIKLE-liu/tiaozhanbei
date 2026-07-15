<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Send, Bot, User } from 'lucide-vue-next'
import type { ChatMessage } from '@/types/resume'

const props = defineProps<{
  messages: ChatMessage[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
}>()

const input = ref('')
const scrollRef = ref<HTMLDivElement | null>(null)

watch(
  () => [...props.messages],
  () => {
    nextTick(() => {
      scrollRef.value?.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
    })
  },
  { deep: true },
)

function handleSend() {
  const content = input.value.trim()
  if (!content) return
  emit('send', content)
  input.value = ''
}
</script>

<template>
  <div class="card flex h-[520px] flex-col p-5">
    <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
      第三步：AI 对话分析
    </h3>

    <div
      ref="scrollRef"
      class="flex-1 space-y-4 overflow-y-auto pr-2"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex gap-3"
        :class="msg.role === 'user' ? 'flex-row-reverse' : ''"
      >
        <div
          class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
          :class="
            msg.role === 'user'
              ? 'bg-amber-50 text-accent-amber'
              : 'bg-primary-50 text-primary-600'
          "
        >
          <component
            :is="msg.role === 'user' ? User : Bot"
            class="h-4 w-4"
          />
        </div>
        <div
          class="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
          :class="
            msg.role === 'user'
              ? 'bg-amber-50 text-slate-800'
              : 'border border-slate-200 bg-slate-50 text-slate-800'
          "
        >
          <pre
            v-if="msg.role === 'assistant'"
            class="whitespace-pre-wrap font-sans"
          >{{ msg.content }}</pre>
          <span v-else>{{ msg.content }}</span>
          <span
            v-if="msg.typing"
            class="ml-1 inline-block animate-pulse"
          >▊</span>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex items-center gap-3 text-xs text-slate-500"
      >
        <Bot class="h-4 w-4" />
        <span>AI 正在输入...</span>
      </div>
    </div>

    <div class="mt-4 flex gap-3 border-t border-slate-200 pt-4">
      <input
        v-model="input"
        type="text"
        placeholder="输入你的问题或偏好..."
        class="input-field flex-1"
        @keyup.enter="handleSend"
      >
      <button
        class="btn-primary px-4"
        :disabled="loading"
        @click="handleSend"
      >
        <Send class="h-4 w-4" />
        发送
      </button>
    </div>
  </div>
</template>
