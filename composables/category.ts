import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ICategory } from '~/utils/interfaces'

export const useCategoryStore = defineStore('category', () => {
  const { $csSupabase } = useNuxtApp()

  const isLoading = ref(false)
  const categories = ref<ICategory[]>([])

  const fetchCategories = async () => {
    isLoading.value = true
    const { data } = await $csSupabase.from('categories').select('id, name')

    categories.value = data!
    isLoading.value = false
  }

  return {
    isLoading,
    categories,
    fetchCategories,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
