<script setup lang="ts">
const { title, color } = defineProps<{
  title: string
  color: string
}>()

const theColor = computed(() => `bg-${color}-600`)
</script>

<template>
  <div class="flex flex-row items-center gap-x-1 text-xs">
    <div
      class="h-3 w-3 rounded-full"
      :class="theColor"
    />
    <span>{{ title }}</span>
  </div>
</template>
