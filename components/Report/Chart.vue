<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Line, Radar } from 'vue-chartjs'

definePageMeta({
  middleware: 'auth',
})

ChartJS.register(
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)
</script>

<template>
  <div class="h-[200px] w-full flex gap-4 p-4">
    <div class="w-1/3">
      <Radar :data="saleDataPerHour" :options="saleDataPerHourOptions" />
    </div>
    <div class="w-2/3">
      <Line :data="chartJsData" :options="options" />
    </div>
  </div>
</template>
