import type { Domain, Job, JobDetail } from '@/types/job'

export const domains: Domain[] = [
  '全部领域',
  '人工智能',
  '大数据',
  '云计算',
  '后端开发',
  '前端开发',
  '产品经理',
  '网络安全',
]

export const hotSearches = ['AI工程师', '数据分析', '大模型', '产品经理', '后端开发', '云计算']

const trendMonths = [
  '2024-07',
  '2024-08',
  '2024-09',
  '2024-10',
  '2024-11',
  '2024-12',
  '2025-01',
  '2025-02',
  '2025-03',
  '2025-04',
  '2025-05',
  '2025-06',
]

function makeTrend(series: Record<string, number[]>) {
  return trendMonths.map((month, idx) => ({
    month,
    ...Object.fromEntries(Object.entries(series).map(([k, v]) => [k, v[idx]])),
  }))
}

export const jobDetails: Record<string, JobDetail> = {
  'job-001': {
    id: 'job-001',
    name: 'AI算法工程师',
    hot: 5,
    trend: 32,
    salary: '25-40K',
    domain: '人工智能',
    skills: ['Python', 'PyTorch', '深度学习', '大模型', '推荐系统', 'SQL'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责深度学习模型的研发、训练与部署，参与大模型应用落地，推动算法在业务场景中的效果优化。',
    skillList: [
      { name: 'Python', level: 5, type: '必备' },
      { name: 'PyTorch', level: 5, type: '必备' },
      { name: '深度学习', level: 5, type: '必备' },
      { name: '大模型', level: 4, type: '重要' },
      { name: '推荐系统', level: 3, type: '加分' },
      { name: 'SQL', level: 2, type: '加分' },
    ],
    trendData: makeTrend({
      Python: [82, 83, 84, 85, 86, 86, 87, 87, 88, 88, 89, 90],
      PyTorch: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
      大模型: [35, 40, 48, 55, 62, 68, 72, 75, 78, 80, 82, 84],
      TensorFlow: [60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49],
    }),
    relatedJobs: ['机器学习工程师', '推荐算法工程师', 'NLP工程师'],
  },
  'job-002': {
    id: 'job-002',
    name: '数据分析师',
    hot: 4,
    trend: 18,
    salary: '15-25K',
    domain: '大数据',
    skills: ['SQL', 'Python', 'BI', 'Excel', '统计学', '数据可视化'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '通过数据挖掘与分析为业务决策提供支持，搭建数据指标体系，输出可视化分析报告。',
    skillList: [
      { name: 'SQL', level: 5, type: '必备' },
      { name: 'Python', level: 4, type: '必备' },
      { name: 'BI工具', level: 4, type: '必备' },
      { name: '统计学', level: 4, type: '重要' },
      { name: '数据可视化', level: 3, type: '加分' },
      { name: 'Excel', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      SQL: [80, 81, 81, 82, 82, 83, 83, 84, 84, 85, 85, 86],
      Python: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
      BI: [60, 62, 64, 65, 67, 68, 70, 71, 72, 73, 74, 75],
      Excel: [65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
    }),
    relatedJobs: ['数据产品经理', '商业分析师', '数据开发工程师'],
  },
  'job-003': {
    id: 'job-003',
    name: '大模型应用开发',
    hot: 5,
    trend: 58,
    salary: '30-50K',
    domain: '人工智能',
    skills: ['Python', 'LangChain', '大模型', 'RAG', 'Agent', '向量数据库'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '基于大模型构建企业级应用，包括 RAG 知识库、Agent 工作流、智能客服等场景落地。',
    skillList: [
      { name: 'Python', level: 5, type: '必备' },
      { name: 'LangChain', level: 5, type: '必备' },
      { name: '大模型', level: 5, type: '必备' },
      { name: 'RAG', level: 4, type: '重要' },
      { name: 'Agent', level: 4, type: '重要' },
      { name: '向量数据库', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      Python: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
      LangChain: [40, 48, 55, 62, 68, 73, 77, 80, 83, 85, 87, 89],
      大模型: [45, 52, 60, 67, 73, 78, 82, 85, 87, 89, 90, 92],
      RAG: [30, 38, 47, 55, 62, 68, 73, 77, 80, 83, 85, 87],
    }),
    relatedJobs: ['AI算法工程师', 'Prompt工程师', '后端开发工程师'],
  },
  'job-004': {
    id: 'job-004',
    name: '云计算工程师',
    hot: 4,
    trend: 22,
    salary: '20-35K',
    domain: '云计算',
    skills: ['Linux', 'K8s', 'Docker', 'AWS/阿里云', 'Terraform', 'Python'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责云基础设施的建设与运维，容器化部署，CI/CD 流程优化，保障系统稳定性与可扩展性。',
    skillList: [
      { name: 'Linux', level: 5, type: '必备' },
      { name: 'K8s', level: 5, type: '必备' },
      { name: 'Docker', level: 5, type: '必备' },
      { name: '云服务', level: 4, type: '重要' },
      { name: 'Terraform', level: 3, type: '加分' },
      { name: 'Python', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      Linux: [78, 79, 79, 80, 80, 81, 81, 82, 82, 83, 83, 84],
      K8s: [70, 72, 73, 75, 76, 78, 79, 80, 81, 82, 83, 84],
      Docker: [75, 76, 77, 78, 79, 80, 80, 81, 81, 82, 82, 83],
      Terraform: [45, 47, 49, 51, 53, 55, 57, 58, 60, 61, 62, 63],
    }),
    relatedJobs: ['SRE运维工程师', 'DevOps工程师', '后端开发工程师'],
  },
  'job-005': {
    id: 'job-005',
    name: '后端开发工程师',
    hot: 4,
    trend: 12,
    salary: '18-30K',
    domain: '后端开发',
    skills: ['Java', 'Spring', 'MySQL', 'Redis', 'Kafka', '微服务'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责服务端架构设计与开发，高并发系统优化，数据库设计与缓存策略制定。',
    skillList: [
      { name: 'Java', level: 5, type: '必备' },
      { name: 'Spring', level: 5, type: '必备' },
      { name: 'MySQL', level: 4, type: '必备' },
      { name: 'Redis', level: 4, type: '重要' },
      { name: 'Kafka', level: 3, type: '加分' },
      { name: '微服务', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      Java: [82, 82, 83, 83, 84, 84, 85, 85, 86, 86, 87, 87],
      Spring: [78, 79, 79, 80, 80, 81, 81, 82, 82, 83, 83, 84],
      MySQL: [75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81],
      微服务: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    }),
    relatedJobs: ['Java开发工程师', '架构师', '全栈工程师'],
  },
  'job-006': {
    id: 'job-006',
    name: '前端开发工程师',
    hot: 3,
    trend: 8,
    salary: '15-28K',
    domain: '前端开发',
    skills: ['Vue/React', 'TypeScript', 'CSS', 'Webpack/Vite', 'Node.js'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责 Web 前端页面开发，组件库建设，性能优化，与设计师和后端协作完成产品功能。',
    skillList: [
      { name: 'Vue/React', level: 5, type: '必备' },
      { name: 'TypeScript', level: 4, type: '必备' },
      { name: 'CSS', level: 4, type: '必备' },
      { name: '工程化', level: 4, type: '重要' },
      { name: 'Node.js', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      Vue: [70, 71, 72, 72, 73, 73, 74, 74, 75, 75, 76, 76],
      React: [72, 73, 73, 74, 74, 75, 75, 76, 76, 77, 77, 78],
      TypeScript: [65, 67, 69, 71, 72, 74, 75, 76, 77, 78, 79, 80],
      CSS: [60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65, 66],
    }),
    relatedJobs: ['全栈工程师', '移动端开发', 'UI工程师'],
  },
  'job-007': {
    id: 'job-007',
    name: '产品经理',
    hot: 3,
    trend: 5,
    salary: '18-30K',
    domain: '产品经理',
    skills: ['需求分析', '原型设计', '数据分析', '项目管理', '用户研究'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责产品规划与需求管理，推动产品从 0 到 1 落地，协调设计、开发、运营等资源。',
    skillList: [
      { name: '需求分析', level: 5, type: '必备' },
      { name: '原型设计', level: 4, type: '必备' },
      { name: '数据分析', level: 4, type: '重要' },
      { name: '项目管理', level: 4, type: '重要' },
      { name: '用户研究', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      需求分析: [75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81],
      原型设计: [70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75, 76],
      数据分析: [55, 57, 59, 61, 62, 64, 65, 66, 67, 68, 69, 70],
      项目管理: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    }),
    relatedJobs: ['产品运营', '数据产品经理', '策略产品经理'],
  },
  'job-008': {
    id: 'job-008',
    name: '网络安全工程师',
    hot: 4,
    trend: 24,
    salary: '20-35K',
    domain: '网络安全',
    skills: ['Linux', '渗透测试', '安全攻防', 'Python', '逆向分析'],
    education: '本科及以上',
    experience: '1-3年',
    description:
      '负责企业安全体系建设，漏洞挖掘与修复，安全事件应急响应，安全策略制定。',
    skillList: [
      { name: 'Linux', level: 5, type: '必备' },
      { name: '渗透测试', level: 5, type: '必备' },
      { name: '安全攻防', level: 4, type: '必备' },
      { name: 'Python', level: 4, type: '重要' },
      { name: '逆向分析', level: 3, type: '加分' },
    ],
    trendData: makeTrend({
      Linux: [75, 76, 77, 78, 79, 80, 80, 81, 81, 82, 82, 83],
      渗透测试: [70, 72, 74, 76, 78, 79, 80, 81, 82, 83, 84, 85],
      安全攻防: [68, 70, 72, 74, 76, 77, 78, 79, 80, 81, 82, 83],
      Python: [55, 57, 59, 61, 63, 64, 65, 66, 67, 68, 69, 70],
    }),
    relatedJobs: ['安全研究员', '安全运营', '合规工程师'],
  },
}

export const jobs: Job[] = Object.values(jobDetails).map((detail) => ({
  id: detail.id,
  name: detail.name,
  hot: detail.hot,
  trend: detail.trend,
  salary: detail.salary,
  domain: detail.domain,
  skills: detail.skills.slice(0, 3),
}))

export function getJobById(id: string): JobDetail | undefined {
  return jobDetails[id]
}

export function queryJobs(params: {
  keyword?: string
  domain?: string
  page?: number
  pageSize?: number
}): { list: Job[]; total: number } {
  let list = [...jobs]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    list = list.filter(
      (job) =>
        job.name.toLowerCase().includes(kw) ||
        job.skills.some((s) => s.toLowerCase().includes(kw)),
    )
  }

  if (params.domain && params.domain !== '全部领域') {
    list = list.filter((job) => job.domain === params.domain)
  }

  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 12
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total: list.length,
  }
}
