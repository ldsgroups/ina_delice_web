<script setup lang="ts">
import type { TCustomerSchema } from '~/utils/schema'
import type { ICustomerHistoric } from '~/utils/interfaces'

import { appName } from '~/constants'

useHead({
  title: `Clients | ${appName}`,
})

definePageMeta({
  middleware: 'auth',
})

const selectedCustomer = ref<TCustomerSchema | null>(null)
const selectedCustomerHistoric = ref<ICustomerHistoric[]>([])

provide('selectedCustomerRef', selectedCustomer)
provide('selectedCustomerHistoricRef', selectedCustomerHistoric)
</script>

<template>
  <div class="grid grid-cols-12 h-full gap-x-4">
    <ContactCard />

    <ContactSelected :customer="selectedCustomer" :historic="selectedCustomerHistoric" />
  </div>
</template>
