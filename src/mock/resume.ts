import type {
  GapAnalysisResult,
  MatchItem,
  ParsedResume,
  ResumeUploadResult,
} from '@/types/resume'

export const mockParsedResume: ParsedResume = {
  name: '张三',
  education: '硕士',
  experience: '2年',
  skills: ['Python', 'SQL', 'PyTorch', '数据结构', '推荐系统'],
  projects: [
    {
      name: '电商推荐系统',
      period: '2024-2025',
      stack: 'Python、PyTorch、Flink',
      description: '基于深度学习的商品推荐模型，提升 CTR 约 15%。',
    },
    {
      name: '数据可视化平台',
      period: '2023-2024',
      stack: 'Vue、ECharts、Node.js',
      description: '为内部运营团队搭建的数据看板，支持实时数据刷新。',
    },
  ],
}

export const mockUploadResult: ResumeUploadResult = {
  resumeId: 'r-001',
  parsed: mockParsedResume,
}

export const mockMatches: MatchItem[] = [
  {
    jobId: 'job-002',
    jobName: '推荐算法工程师',
    score: 82,
    gapSkills: ['大模型基础'],
  },
  {
    jobId: 'job-003',
    jobName: '大模型应用开发',
    score: 65,
    gapSkills: ['LangChain', 'RAG', 'Agent'],
  },
  {
    jobId: 'job-004',
    jobName: '数据分析师',
    score: 90,
    gapSkills: [],
  },
]

export const mockGapAnalysis: Record<string, GapAnalysisResult> = {
  'job-003': {
    jobName: '大模型应用开发',
    currentSkills: [
      { name: 'Python', score: 90 },
      { name: 'PyTorch', score: 75 },
      { name: '大模型', score: 20 },
      { name: 'LangChain', score: 0 },
      { name: 'RAG', score: 10 },
      { name: 'Agent', score: 5 },
    ],
    requiredSkills: [
      { name: 'Python', score: 90 },
      { name: 'PyTorch', score: 90 },
      { name: '大模型', score: 90 },
      { name: 'LangChain', score: 85 },
      { name: 'RAG', score: 80 },
      { name: 'Agent', score: 75 },
    ],
    suggestions: [
      {
        skill: '大模型',
        gap: '严重',
        actions: ['吴恩达《大模型》课程', '动手实现一个 RAG 项目'],
      },
      {
        skill: 'LangChain',
        gap: '完全缺失',
        actions: ['LangChain 官方教程', '构建一个 Agent Demo'],
      },
      {
        skill: 'RAG',
        gap: '严重',
        actions: ['学习向量数据库基础', '实现 PDF 知识库问答'],
      },
    ],
  },
  'job-002': {
    jobName: '推荐算法工程师',
    currentSkills: [
      { name: 'Python', score: 90 },
      { name: 'PyTorch', score: 75 },
      { name: '推荐系统', score: 70 },
      { name: 'SQL', score: 65 },
      { name: '大模型', score: 20 },
      { name: '深度学习', score: 60 },
    ],
    requiredSkills: [
      { name: 'Python', score: 90 },
      { name: 'PyTorch', score: 85 },
      { name: '推荐系统', score: 85 },
      { name: 'SQL', score: 70 },
      { name: '大模型', score: 60 },
      { name: '深度学习', score: 80 },
    ],
    suggestions: [
      {
        skill: '大模型基础',
        gap: '中等',
        actions: ['学习大模型在推荐中的应用', '了解 Embedding 召回'],
      },
      {
        skill: '深度学习',
        gap: '中等',
        actions: ['复现经典推荐模型', '参加 Kaggle 推荐竞赛'],
      },
    ],
  },
}
