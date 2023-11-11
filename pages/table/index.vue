<script setup lang="ts">
import type { IOption, ITable } from '~/utils/interfaces'

import { appName } from '~/constants'

useHead({
  title: `Tables | ${appName}`,
})

definePageMeta({
  middleware: 'auth',
})

const activeTableFilter = ref<string>('all')

const filterTable = ref<IOption[]>([
  { label: 'Toutes', value: 'all' },
  { label: 'Vacante', value: 'vacant' },
  { label: 'Occupée', value: 'occupied' },
  { label: 'Panne', value: 'disabled' },
])

const csTables = ref<ITable[]>([
  { id: 'T1', shape: 'round', chairs: 4, name: 'Table 1', state: 'vacant' },
  { id: 'T2', shape: 'rectangular', chairs: 4, name: 'Table 2', state: 'on-order-hold' },
  { id: 'T3', shape: 'rectangular', chairs: 2, name: 'Table 3', state: 'vacant' },
  { id: 'T4', shape: 'round', chairs: 3, name: 'Table 4', state: 'occupied' },
  { id: 'T5', shape: 'rectangular', chairs: 6, name: 'Table 5', state: 'occupied' },
  { id: 'T5', shape: 'rectangular', chairs: 6, name: 'Table 6', state: 'vacant' },
])

const filteredTable = computed<ITable[]>(() => activeTableFilter.value === 'all' ? csTables.value : csTables.value.filter(el => el.state === activeTableFilter.value))
</script>

<template>
  <section class="col-span-8 bg-kGrayColor/25 p-2">
    <ul class="mb-1.5 flex flex-row gap-x-4 rounded bg-white px-4 py-1 font-semibold leading-loose dark:bg-kGoldenColor/35">
      <li
        v-for="filterTb in filterTable" :key="filterTb.value"
        :class="`rounded px-2 py-0.5 cursor-pointer hover:bg-kOrangeColor/20 ${activeTableFilter === filterTb.value ? 'border text-kOrangeColor border-kOrangeColor bg-kOrangeColor/20' : ''}`"
        @click="activeTableFilter = filterTb.value"
      >
        {{ filterTb.label }}
      </li>
    </ul>

    <div flex gap-6>
      <RestaurantLayout :tables="filteredTable" />
    </div>

    <div class="mt-6 flex gap-x-4 rounded bg-white px-4 py-2 font-semibold leading-loose dark:bg-kGoldenColor/35">
      <TableState title="Occupée" color="red" />
      <TableState title="Commande en cours" color="blue" />
      <TableState title="Vacante" color="green" />
    </div>
  </section>
</template>
