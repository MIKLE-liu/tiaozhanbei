<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { JobSkill } from '@/types/job'

const props = defineProps<{
  skills: JobSkill[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const indicators = props.skills.map((skill) => ({
    name: skill.name,
    max: 5,
  }))
  const values = props.skills.map((skill) => skill.level)

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' },
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#334155',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      splitArea: {
        areaStyle: {
          color: ['#f8fafc', '#ffffff'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: '技能要求',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
              ]),
            },
            lineStyle: {
              color: '#3b82f6',
              width: 2,
            },
            itemStyle: {
              color: '#3b82f6',
            },
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

watch(() => props.skills, renderChart, { deep: true })
</script>

<template>
  <div
    ref="chartRef"
    class="h-72 w-full"
  />
</template>
