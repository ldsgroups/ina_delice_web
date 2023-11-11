<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: `Paramètre | ${appName}`,
})
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div>
    Paramètre
  </div>
</template>
