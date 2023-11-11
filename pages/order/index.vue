<script setup lang="ts">
import type { IOrder } from '~/utils/interfaces'
import { appName } from '~/constants'

useHead({
  title: `Commandes | ${appName}`,
})

definePageMeta({
  middleware: 'auth',
})

const selectedOrder = ref<IOrder | null>(null)

provide('selectedOrderRef', selectedOrder)
</script>

<template>
  <div class="grid grid-cols-12 h-full gap-x-4">
    <OrderTables />

    <OrderSelected />
  </div>
</template>
