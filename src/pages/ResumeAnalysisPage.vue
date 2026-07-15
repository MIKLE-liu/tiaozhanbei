<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/Common/PageHeader.vue'
import ResumeUploader from '@/components/Resume/ResumeUploader.vue'
import ParsedResult from '@/components/Resume/ParsedResult.vue'
import ChatPanel from '@/components/Resume/ChatPanel.vue'
import MatchResult from '@/components/Resume/MatchResult.vue'
import Loading from '@/components/Common/Loading.vue'
import Empty from '@/components/Common/Empty.vue'
import { uploadResume, sendChatMessage, fetchMatchResult } from '@/api/resume'
import { useAppStore } from '@/stores/appStore'
import type { ChatMessage, MatchItem, ParsedResume } from '@/types/resume'

const router = useRouter()
const appStore = useAppStore()

const parsed = ref<ParsedResume | null>(null)
const resumeId = ref('')
const uploading = ref(false)
const chatting = ref(false)
const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content:
      '你好！我是你的 AI 职业顾问。上传简历后，我会帮你解析经历，并通过对话推荐最适合你的岗位方向。',
  },
])
const matches = ref<MatchItem[]>([])
const matchLoading = ref(false)

async function handleUpload(file: File) {
  uploading.value = true
  try {
    const res = await uploadResume(file)
    resumeId.value = res.resumeId
    parsed.value = res.parsed
    appStore.setResume(res.resumeId, res.parsed)

    messages.value.push({
      role: 'assistant',
      content: `简历解析完成！你好 ${res.parsed.name}，我注意到你有 ${res.parsed.experience} 经验，技能包括 ${res.parsed.skills.join('、')}。想聊聊你未来的职业方向吗？`,
    })

    await loadMatches()
  } finally {
    uploading.value = false
  }
}

async function loadMatches() {
  matchLoading.value = true
  try {
    matches.value = await fetchMatchResult(resumeId.value)
  } finally {
    matchLoading.value = false
  }
}

async function handleSend(content: string) {
  messages.value.push({ role: 'user', content })
  chatting.value = true

  try {
    const reply = await sendChatMessage(resumeId.value, messages.value)
    messages.value.push({ role: 'assistant', content: reply })
    await loadMatches()
  } finally {
    chatting.value = false
  }
}

function viewGap(jobId: string) {
  router.push(`/resume/gap/${jobId}`)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="AI 简历分析"
      subtitle="上传简历，与 AI 对话，发现最适合你的职业方向"
    />

    <ResumeUploader @upload="handleUpload" />

    <Loading
      v-if="uploading"
      text="AI 正在解析简历..."
    />

    <template v-if="parsed && !uploading">
      <ParsedResult :data="parsed" />

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <ChatPanel
            :messages="messages"
            :loading="chatting"
            @send="handleSend"
          />
        </div>
        <div>
          <Loading
            v-if="matchLoading"
            text="计算匹配度..."
          />
          <MatchResult
            v-else
            :matches="matches"
            @view-gap="viewGap"
          />
        </div>
      </div>
    </template>

    <Empty
      v-if="!parsed && !uploading"
      title="上传简历以开始分析"
      description="AI 将自动解析并开启职业分析对话"
    />
  </div>
</template>
