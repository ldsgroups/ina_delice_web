<script setup lang="ts">
import type { TCustomerSchema } from '~/utils/schema'
import { customerSchema } from '~/utils/schema'
import type { IError } from '~/utils/interfaces'

const { customer, isCreationMode } = defineProps<{
  isCreationMode: boolean
  customer?: TCustomerSchema | null
}>()

const emits = defineEmits(['closeForm', 'refresh'])

const { $csSupabase } = useNuxtApp()
const showError = useErrorDisplayer()
const { appContext } = getCurrentInstance()!

const isLoading = ref(false)
const formData = inject('customerFormDataRef') as Ref<TCustomerSchema>
const customerOnEditionId = inject('customerOnEditionIdRef') as Ref<number>

const alias = computed(() => {
  const _name = formData.value.name.toUpperCase()

  const names = _name.split(' ')

  const isFullName = names.length > 1
  if (isFullName)
    return names[0].substring(0, 1) + names[1].substring(0, 1)
  else return names[0].substring(0, 1)
})

function clearForm() {
  formData.value.name = ''
  formData.value.phone = ''
  formData.value.address = ''
}

function onClose() {
  clearForm()
  emits('closeForm')
}

async function saveCustomer() {
  try {
    if (isLoading.value)
      return

    isLoading.value = true
    // validate data
    customerSchema.parse(formData.value)

    const draftCustomer = {
      name: formData.value.name,
      phone: formData.value.phone,
      address: formData.value.address,
      updated_at: (new Date()).toISOString(),
    }

    const { error } = await $csSupabase.from('customers').insert(draftCustomer)

    if (error)
      throw error

    ElMessage({
      message: 'Le client a été enregistrée',
      type: 'success',
      appContext,
    })

    emits('refresh')

    // close card
    onClose()
  }
  catch (error) { showError(error as IError) }
  finally { isLoading.value = false }
}

async function editCustomer() {
  try {
    if (isLoading.value)
      return

    isLoading.value = true
    // validate data
    customerSchema.parse(formData.value)

    const draftCustomer = {
      name: formData.value.name,
      phone: formData.value.phone,
      address: formData.value.address,
      updated_at: (new Date()).toISOString(),
    }

    const { error } = await $csSupabase.from('customers').update(draftCustomer).eq('id', customer?.id)

    if (error)
      throw error

    ElMessage({
      message: `Le client ${customer?.name} a été modifié`,
      type: 'success',
      appContext,
    })

    emits('refresh')

    // close card
    onClose()
    customerOnEditionId.value = -1
  }
  catch (error) { showError(error as IError) }
  finally { isLoading.value = false }
}

async function archiveCustomer() {
  try {
    if (isLoading.value)
      return

    isLoading.value = true
    // validate data
    customerSchema.parse(formData.value)

    // Save Data
    const { error } = await $csSupabase.from('customers').update({ is_active: false }).eq('id', customer?.id)

    if (error)
      throw error

    ElMessage({
      message: `Le client ${customer?.name} a été archivé`,
      type: 'success',
      appContext,
    })

    emits('refresh')

    // close card
    onClose()
    customerOnEditionId.value = -1
  }
  catch (error) { showError(error as IError) }
  finally { isLoading.value = false }
}
</script>

<template>
  <div class="w-full flex items-center rounded-xl bg-white p-6 shadow-lg space-x-4 dark:bg-kGrayColor/15">
    <div class="shrink-0">
      <div class="grid h-20 w-20 place-content-center rounded-lg from-cyan-500 to-blue-500 bg-gradient-to-r text-center text-4xl text-white">
        {{ alias }}
      </div>
    </div>
    <div w-full>
      <div class="text-xl font-medium text-black">
        <input id="name" v-model="formData.name" type="text" class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="Entrer le nom du client" required>
      </div>
      <div class="mt-4 flex flex-row items-center gap-2 text-slate-500">
        <input id="phone" v-model="formData.phone" type="text" class="block w-28 border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 lg:w-full dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="Son numéro" required>
        <input id="address" v-model="formData.address" type="text" class="block w-42 border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 lg:w-full dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="Son quartier">
      </div>
      <div class="mt-4 w-26 flex flex-col items-start justify-between gap-4 sm:w-full sm:flex-row sm:items-end">
        <button v-if="isCreationMode" class="i-carbon-save icon-btn" @click="saveCustomer" />

        <div v-else class="space-x-2">
          <button class="i-carbon-edit icon-btn" @click="editCustomer" />
          <button class="i-carbon-trash-can icon-btn" @dblclick="archiveCustomer" />
        </div>

        <button class="border-kOrangeColor text-kGreenColor text-kOrangeColor btn-outlined hover:bg-kOrangeColor/96" @click="onClose">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>
