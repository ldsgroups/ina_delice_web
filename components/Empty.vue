<script setup lang="ts">
const { title, description } = defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center text-center">
    <div class="text-4xl font-semibold text-gray-400 dark:text-gray-400">
      {{ title ? title : 'Aucune donnée' }}
    </div>
    <div class="text-gray-400 dark:text-gray-400">
      {{ description ? description : 'Veillez créer ou sélectionner une donnée' }}
    </div>
  </div>
</template>
