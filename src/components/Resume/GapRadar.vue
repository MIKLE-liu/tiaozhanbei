<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { SkillScore } from '@/types/resume'

const props = defineProps<{
  currentSkills: SkillScore[]
  requiredSkills: SkillScore[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value || props.currentSkills.length === 0) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const indicators = props.currentSkills.map((skill) => ({
    name: skill.name,
    max: 100,
  }))
  const current = props.currentSkills.map((skill) => skill.score)
  const required = props.requiredSkills.map((skill) => skill.score)

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' },
    },
    legend: {
      data: ['当前能力', '岗位要求'],
      textStyle: { color: '#334155' },
      bottom: 0,
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: '#334155', fontSize: 12 },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      splitArea: {
        areaStyle: {
          color: ['#f8fafc', '#ffffff'],
        },
      },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: current,
            name: '当前能力',
            areaStyle: { color: 'rgba(245, 158, 11, 0.2)' },
            lineStyle: { color: '#f59e0b', width: 2 },
            itemStyle: { color: '#f59e0b' },
          },
          {
            value: required,
            name: '岗位要求',
            areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
            lineStyle: { color: '#3b82f6', width: 2 },
            itemStyle: { color: '#3b82f6' },
          },
        ],
      },
    ],
  })
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})

watch(() => [props.currentSkills, props.requiredSkills], renderChart, { deep: true })
</script>

<template>
  <div
    ref="chartRef"
    class="h-80 w-full"
  />
</template>
