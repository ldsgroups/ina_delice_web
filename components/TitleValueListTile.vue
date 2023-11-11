<script setup lang="ts">
const { title, value, isBold = false } = defineProps<{
  title: string
  value: string
  isBold?: boolean
}>()
</script>

<template>
  <div :class="`col-span-2 text-sm ${isBold ? 'font-semibold' : ''}`">
    {{ title }}
  </div>
  <div :class="`col-span-1 text-sm text-right ${isBold ? 'font-semibold' : ''}`">
    {{ value }}
  </div>
</template>
