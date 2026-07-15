import type {
  ChatMessage,
  GapAnalysisResult,
  MatchItem,
  ResumeUploadResult,
} from '@/types/resume'
import {
  mockGapAnalysis,
  mockMatches,
  mockUploadResult,
} from '@/mock/resume'
import { mockRequest } from './request'

export async function uploadResume(_file: File): Promise<ResumeUploadResult> {
  return mockRequest(mockUploadResult, 800)
}

export async function sendChatMessage(
  resumeId: string,
  messages: ChatMessage[],
): Promise<string> {
  const responses = [
    '我已看完你的简历。根据你的经历，你目前在算法方向有不错的基础。想深入了解一下几个方向：\n\n1️⃣ 推荐算法工程师 — 与你的项目最匹配\n2️⃣ 大模型应用开发 — 当前最热门\n3️⃣ 数据分析工程师 — 门槛较低\n\n你对哪个方向更感兴趣？',
    '推荐算法确实是个不错的选择。你的电商推荐系统项目已经覆盖了召回和排序的基础。接下来可以补充大模型在推荐中的应用，以及强化学习推荐策略。',
    '大模型应用开发方向需要补充 LangChain、RAG 和 Agent 相关知识。建议从实现一个 PDF 知识库问答开始，再逐步接触多 Agent 协作。',
  ]
  const lastUserMsg = messages.filter((m) => m.role === 'user').pop()
  const index = Math.min(
    messages.filter((m) => m.role === 'user').length - 1,
    responses.length - 1,
  )
  const text = lastUserMsg?.content?.includes('engineering') ?? false
    ? responses[2]
    : responses[Math.max(0, index)]
  return mockRequest(text, 600)
}

export async function fetchMatchResult(_resumeId: string): Promise<MatchItem[]> {
  return mockRequest(mockMatches, 600)
}

export async function fetchGapAnalysis(
  resumeId: string,
  jobId: string,
): Promise<GapAnalysisResult> {
  const result = mockGapAnalysis[jobId] ?? mockGapAnalysis['job-003']
  return mockRequest(result, 500)
}
