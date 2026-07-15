import type { PlanResult } from '@/types/plan'

export const mockPlanResult: PlanResult = {
  planId: 'p-001',
  directions: [
    {
      name: 'AI工程师',
      score: 92,
      reason: '技能匹配 + 市场热度高',
    },
    {
      name: '数据分析师',
      score: 85,
      reason: 'Python 基础好，门槛低',
    },
    {
      name: '后端开发',
      score: 70,
      reason: 'Java 基础 + 可补充',
    },
  ],
  roadmap: [
    {
      stage: '大一~大二',
      title: '基础阶段',
      items: ['Python', '数学基础', '数据结构'],
    },
    {
      stage: '大三',
      title: '核心进阶',
      items: ['机器学习', 'PyTorch', '深度学习'],
    },
    {
      stage: '大四',
      title: '实战与求职',
      items: ['AI 项目实战', '简历 & 面试', 'GitHub 作品集'],
    },
  ],
  currentTasks: [
    {
      title: '机器学习基石（吴恩达）',
      duration: '6周',
      done: false,
    },
    {
      title: '动手学深度学习（李沐）',
      duration: '8周',
      done: false,
    },
    {
      title: '参加 Kaggle 入门竞赛',
      duration: '持续',
      done: false,
    },
    {
      title: '每周刷 2 道 LeetCode',
      duration: '持续',
      done: false,
    },
  ],
  resources: [
    {
      title: '吴恩达机器学习',
      tag: '免费',
      type: '课程',
    },
    {
      title: '李沐动手学深度学习',
      tag: '免费',
      type: '课程',
    },
    {
      title: 'Kaggle 入门竞赛',
      tag: '实战',
      type: '竞赛',
    },
  ],
}
