<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: `Accueil | ${appName}`,
})
const online = useOnline()

definePageMeta({
  layout: 'welcome',
})
</script>

<template>
  <div>
    <Suspense>
      <ClientOnly>
        <PageView v-if="online" />
        <div v-else text-gray:80>
          You're offline
        </div>
      </ClientOnly>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
