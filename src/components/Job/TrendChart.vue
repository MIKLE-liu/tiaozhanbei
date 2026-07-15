<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { TrendPoint } from '@/types/job'

const props = defineProps<{
  data: TrendPoint[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444']

function renderChart() {
  if (!chartRef.value || props.data.length === 0) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const months = props.data.map((item) => item.month)
  const seriesKeys = Object.keys(props.data[0]).filter((key) => key !== 'month')

  const series = seriesKeys.map((key, index) => ({
    name: key,
    type: 'line',
    smooth: true,
    showSymbol: false,
    data: props.data.map((item) => item[key]),
    lineStyle: {
      color: colors[index % colors.length],
      width: 2,
    },
    itemStyle: {
      color: colors[index % colors.length],
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: `${colors[index % colors.length]}33` },
        { offset: 1, color: `${colors[index % colors.length]}05` },
      ]),
    },
  }))

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' },
    },
    legend: {
      data: seriesKeys,
      textStyle: { color: '#334155' },
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#334155' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#334155' },
    },
    series,
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

watch(() => props.data, renderChart, { deep: true })
</script>

<template>
  <div
    ref="chartRef"
    class="h-72 w-full"
  />
</template>
