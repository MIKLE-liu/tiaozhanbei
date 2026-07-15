import type { PlanForm, PlanResult } from '@/types/plan'
import { mockPlanResult } from '@/mock/plan'
import { mockRequest } from './request'

export async function generatePlan(_form: PlanForm): Promise<PlanResult> {
  return mockRequest(
    {
      ...mockPlanResult,
      planId: `p-${Date.now()}`,
    },
    1000,
  )
}
