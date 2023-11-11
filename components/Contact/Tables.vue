<script setup lang="ts">
import type { TCustomerSchema } from '~/utils/schema'
import type { ICustomerHistoric, IError } from '~/utils/interfaces'

const { customers } = defineProps<{
  customers: TCustomerSchema[]
}>()
const emits = defineEmits(['onEditCustomer'])
const showError = useErrorDisplayer()

const { $csSupabase } = useNuxtApp()
const isLoading = ref(false)

const customerFormData = inject('customerFormDataRef') as Ref<TCustomerSchema>

const customerOnEditionId = inject('customerOnEditionIdRef') as Ref<number>
const selectedCustomer = inject('selectedCustomerRef') as Ref<TCustomerSchema | null>
const selectedCustomerHistoric = inject('selectedCustomerHistoricRef') as Ref<ICustomerHistoric[]>

const isViewing = (customerId: number) => computed(() => selectedCustomer.value?.id === customerId)
const isEditing = (customerId: number) => computed(() => customerOnEditionId.value === customerId)

function alias(name: string) {
  return computed(() => {
    const names = name.toUpperCase().split(' ')

    const isFullName = names.length > 1
    if (isFullName)
      return names[0].substring(0, 1) + names[1].substring(0, 1)
    else return names[0].substring(0, 1)
  }).value
}

function showAddress(address: string | null) {
  return computed(() => {
    return address === null ? '' : ` - ${address}`
  }).value
}

async function setSelectedCustomer(customer: TCustomerSchema) {
  if (selectedCustomer.value !== null && selectedCustomer.value?.id === customer.id) {
    selectedCustomer.value = null
  }

  else {
    selectedCustomer.value = customer

    try {
      isLoading.value = true
      const { data } = await $csSupabase.from('orders').select('name,  created_at,  coupon_code,  total_amount').eq('customer_id', customer.id).order('created_at', { ascending: false })
      selectedCustomerHistoric.value = data ?? []
    }
    catch (error) { showError(error as IError) }
    finally { isLoading.value = false }
  }
}

function setEditingCustomer(customer: TCustomerSchema) {
  customerOnEditionId.value = customer.id!

  customerFormData.value.name = customer.name
  customerFormData.value.phone = customer.phone
  customerFormData.value.address = customer.address

  emits('onEditCustomer', customer)
}
</script>

<template>
  <div>
    <ul class="max-h-md overflow-y-auto space-y-2">
      <li
        v-for="(customer, idx) in customers" :key="idx"
        :class="`w-full flex items-center px-2 space-x-4 rounded ${isPairItem(idx).value ? ' py-1.5 bg-kGrayColor/15' : ''}`"
      >
        <div class="grid h-10 w-10 place-content-center rounded-lg from-cyan-500 to-blue-500 bg-gradient-to-r text-center text-lg text-white">
          {{ alias(customer.name) }}
        </div>
        <div w-full>
          <div class="text-md font-medium text-black dark:text-white">
            {{ customer.name }}
          </div>
          <p class="text-sm text-slate-500">
            {{ formatPhoneNumber(customer.phone) }} {{ showAddress(customer.address!) }}
          </p>
        </div>
        <div class="flex flex-row gap-x-4">
          <button :class="[isEditing(customer.id!).value ? 'i-carbon-pen' : 'i-carbon-edit-off opacity-25']" @click="setEditingCustomer(customer)" />

          <button
            :class="[isViewing(customer.id!).value ? 'i-carbon-view-filled' : 'i-carbon-view-off opacity-25']"
            @click="setSelectedCustomer(customer)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
