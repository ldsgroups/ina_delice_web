import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ProductQuery, ProductType } from '~/utils/interfaces'

export const useProductStore = defineStore('product', () => {
  const { $csSupabase } = useNuxtApp()

  const isLoading = ref(false)
  const sourceProducts = ref<ProductType[]>([])
  const products = ref<ProductType[]>([])

  const fetchProducts = async () => {
    isLoading.value = true
    const { data } = await $csSupabase.from('products').select('id, name, price, profit, image, quantity, categories (id, name)').eq('is_active', true).order('name')

    sourceProducts.value = data!
    isLoading.value = false
  }

  const filterProducts = (query: ProductQuery) => {
    isLoading.value = true

    const category_id = query.category_id
    const search = query.search

    if (category_id && search.trim().length)
      products.value = sourceProducts.value.filter(product => product.name.toLowerCase().includes(search.trim().toLowerCase()))

    else if (search.trim().length)
      products.value = sourceProducts.value.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))

    else if (category_id)
      products.value = sourceProducts.value.filter(product => product.categories!.id === category_id)

    else
      products.value = sourceProducts.value

    isLoading.value = false
  }

  return {
    isLoading,
    products,
    fetchProducts,
    filterProducts,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
