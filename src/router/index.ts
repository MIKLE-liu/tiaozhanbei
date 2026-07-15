import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/Layout/AppLayout.vue'
import JobListPage from '@/pages/JobListPage.vue'
import JobDetailPage from '@/pages/JobDetailPage.vue'
import ResumeAnalysisPage from '@/pages/ResumeAnalysisPage.vue'
import GapAnalysisPage from '@/pages/GapAnalysisPage.vue'
import PlanPage from '@/pages/PlanPage.vue'
import PlanResultPage from '@/pages/PlanResultPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'jobs',
        name: 'jobs',
        component: JobListPage,
      },
      {
        path: 'jobs/:id',
        name: 'job-detail',
        component: JobDetailPage,
      },
      {
        path: 'resume',
        name: 'resume',
        component: ResumeAnalysisPage,
      },
      {
        path: 'resume/gap/:jobId',
        name: 'gap-analysis',
        component: GapAnalysisPage,
      },
      {
        path: 'plan',
        name: 'plan',
        component: PlanPage,
      },
      {
        path: 'plan/result/:id',
        name: 'plan-result',
        component: PlanResultPage,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
