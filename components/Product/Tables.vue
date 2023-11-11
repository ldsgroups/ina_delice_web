<script setup lang="ts">
// const { $csSupabase } = useNuxtApp()

const productStore = useProductStore()

// const { data: products, pending, error } = useAsyncData(async () => {
//   const { data } = await $csSupabase.from('products').select('id, name, price, profit, image, quantity, categories (id, name)').order('name')
//   return data
// }, { immediate: true })

const selectedProduct = inject('selectedProductRef') as Ref<{
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
} | null>

const isViewing = (productId: number) => computed(() => selectedProduct.value?.id === productId)

function refresh() {
  productStore.filterProducts({ search: '' })
}

function setSelectedProduct(ord: any) {
  if (selectedProduct.value !== null && selectedProduct.value!.id === ord.id) {
    selectedProduct.value = null
  }
  else {
    selectedProduct.value = {
      id: ord.id,
      name: ord.name,
      price: ord.price,
      profit: ord.profit,
      image: ord.image,
      quantity: ord.quantity,
      category: {
        id: ord.categories.id,
        name: ord.categories.name,
      },
    }
  }
}

onMounted(async () => {
  refresh()
})
</script>

<template>
  <section class="col-span-8 p-2">
    <p v-if="productStore.isLoading">
      Chargement
    </p>

    <template v-else>
      <div class="relative max-h-lg overflow-x-auto sm:rounded-lg">
        <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 text-left">
                Nom du produit
              </th>
              <th scope="col" class="px-6 py-3 text-center">
                Catégorie
              </th>
              <th scope="col" class="px-6 py-3 text-right">
                Disponible
              </th>
              <th scope="col" class="px-6 py-3 text-right">
                Prix de vente
              </th>
              <th scope="col" class="px-6 py-3 text-center">
                Voir
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, idx) in productStore.products" :key="product.id"
              :class="`${isPairItem(idx).value ? 'bg-kGrayColor/15' : ''}`"
            >
              <th scope="row" class="whitespace-nowrap px-6 py-4 text-left font-medium text-gray-900 dark:text-white">
                {{ product.name }}
              </th>
              <td class="px-6 py-4 text-center">
                {{ product.categories?.name }}
              </td>
              <td class="px-6 py-4 text-right">
                {{ formatNumber(product.quantity) }}
              </td>
              <td class="px-6 py-4 text-right">
                {{ formatNumber(product.price, ' F') }}
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  :class="[isViewing(product.id).value ? 'i-carbon-view-filled' : 'i-carbon-view-off opacity-25']"
                  @click="setSelectedProduct(product)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <el-pagination
        small layout="prev, pager, next" :page-size="pageSize" :total="products?.count"
        @next-click="() => nextPage()" @prev-click="() => prevPage()" @current-change="handlePageChange"
      /> -->
    </template>
  </section>
</template>
