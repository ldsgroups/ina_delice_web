<script lang="ts" setup>
import { appName } from '~/constants'

useHead({
  title: `Produits | ${appName}`,
})

definePageMeta({
  middleware: 'auth',
})

const selectedProduct = ref<{
  id: number
  name: string
  price: number
  profit: number
  image: string
  quantity: number
  category: {
    id: number
    name: string
  }
} | null>(null)

provide('selectedProductRef', selectedProduct)
</script>

<template>
  <div class="grid grid-cols-12 h-full gap-x-4">
    <ProductTables />

    <ProductDetails />
  </div>
</template>
