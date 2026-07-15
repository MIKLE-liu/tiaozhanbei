<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/Common/PageHeader.vue'
import Loading from '@/components/Common/Loading.vue'
import Empty from '@/components/Common/Empty.vue'
import SearchBar from '@/components/Job/SearchBar.vue'
import DomainTabs from '@/components/Job/DomainTabs.vue'
import JobFilterBar from '@/components/Job/JobFilterBar.vue'
import JobCard from '@/components/Job/JobCard.vue'
import { fetchDomains, fetchHotSearches, fetchJobs } from '@/api/jobs'
import type { Domain, Job, JobQueryParams } from '@/types/job'

const router = useRouter()

const keyword = ref('')
const domain = ref<Domain>('全部领域')
const sortBy = ref('hot')
const education = ref('')
const experience = ref('')

const jobs = ref<Job[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 12

const domains = ref<Domain[]>([])
const hotSearches = ref<string[]>([])

async function loadJobs() {
  loading.value = true
  try {
    const params: JobQueryParams = {
      keyword: keyword.value,
      domain: domain.value,
      sortBy: sortBy.value as 'hot' | 'salary' | 'trend',
      education: education.value,
      experience: experience.value,
      page: page.value,
      pageSize,
    }
    const res = await fetchJobs(params)
    jobs.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  loadJobs()
}

function onSelectHot(value: string) {
  keyword.value = value
  onSearch()
}

function viewDetail(id: string) {
  router.push(`/jobs/${id}`)
}

function compareJob(id: string) {
  // TODO: 实现岗位对比功能
  window.alert(`已加入对比：${id}`)
}

onMounted(async () => {
  domains.value = (await fetchDomains()) as Domain[]
  hotSearches.value = await fetchHotSearches()
  await loadJobs()
})

watch([domain, sortBy, education, experience], onSearch)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="岗位查询"
      subtitle="探索热门岗位趋势，找到与你技能匹配的机会"
    />

    <SearchBar
      v-model="keyword"
      :hot-searches="hotSearches"
      @search="onSearch"
      @select-hot="onSelectHot"
    />

    <DomainTabs
      v-model="domain"
      :domains="domains"
    />

    <JobFilterBar
      v-model:sort-by="sortBy"
      v-model:education="education"
      v-model:experience="experience"
    />

    <Loading
      v-if="loading"
      text="正在加载岗位数据..."
    />

    <div
      v-else
      class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        @view-detail="viewDetail"
        @compare="compareJob"
      />
    </div>

    <Empty
      v-if="!loading && jobs.length === 0"
      title="未找到匹配的岗位"
      description="换个关键词或筛选条件试试吧"
    />

    <div
      v-if="!loading && total > pageSize"
      class="flex items-center justify-center gap-3 pt-4"
    >
      <button
        :disabled="page === 1"
        class="btn-secondary py-1.5 pl-3 pr-4 text-sm disabled:opacity-40"
        @click="page--; loadJobs()"
      >
        上一页
      </button>
      <span class="text-sm text-slate-500">第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页</span>
      <button
        :disabled="page * pageSize >= total"
        class="btn-secondary py-1.5 pl-4 pr-3 text-sm disabled:opacity-40"
        @click="page++; loadJobs()"
      >
        下一页
      </button>
    </div>
  </div>
</template>
