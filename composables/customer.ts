import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Database } from '~/types/supabase'

type ICustomer = Database['public']['Tables']['customers']['Row']

export const useCustomerStore = defineStore('customer', () => {
  const { $csSupabase } = useNuxtApp()

  const fetchError = ref<any | null>(null)
  const isLoading = ref(false)
  const customers = ref<ICustomer[]>([])

  const fetchCustomers = async () => {
    isLoading.value = true
    const { data, error } = await $csSupabase.from('customers').select('*').eq('is_active', true).order('name', { ascending: true })

    customers.value = data!
    fetchError.value = error!
    isLoading.value = false
  }

  async function refresh() {
    await fetchCustomers()
  }

  return {
    fetchError,
    isLoading,
    customers,
    refresh,
    fetchCustomers,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCustomerStore, import.meta.hot))
