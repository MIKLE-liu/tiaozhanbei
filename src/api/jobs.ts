import type { JobDetail, JobListResult, JobQueryParams } from '@/types/job'
import { domains, getJobById, hotSearches, queryJobs } from '@/mock/jobs'
import { mockRequest } from './request'

export async function fetchJobs(params: JobQueryParams): Promise<JobListResult> {
  return mockRequest(queryJobs(params))
}

export async function fetchJobDetail(id: string): Promise<JobDetail> {
  const detail = getJobById(id)
  if (!detail) {
    throw new Error('岗位不存在')
  }
  return mockRequest(detail)
}

export async function fetchHotSearches(): Promise<string[]> {
  return mockRequest(hotSearches)
}

export async function fetchDomains(): Promise<string[]> {
  return mockRequest(domains)
}
