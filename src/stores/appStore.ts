import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ParsedResume } from '@/types/resume'

export const useAppStore = defineStore('app', () => {
  const resumeId = ref('')
  const parsedResume = ref<ParsedResume | null>(null)
  const selectedJobId = ref('')

  const setResume = (id: string, parsed: ParsedResume) => {
    resumeId.value = id
    parsedResume.value = parsed
  }

  const selectJob = (id: string) => {
    selectedJobId.value = id
  }

  const clearResume = () => {
    resumeId.value = ''
    parsedResume.value = null
    selectedJobId.value = ''
  }

  return {
    resumeId,
    parsedResume,
    selectedJobId,
    setResume,
    selectJob,
    clearResume,
  }
})
