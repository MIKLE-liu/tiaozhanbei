import axios, { type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/common'

const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    if (response.data.code !== 0) {
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
    return response
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '网络错误'
    return Promise.reject(new Error(message))
  },
)

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockRequest<T>(data: T, delay = 400): Promise<T> {
  if (isMock) {
    await sleep(delay)
  }
  return data
}

export function wrapApiResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 0,
    data,
  }
}

export default request
export { isMock }
