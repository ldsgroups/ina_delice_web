<script setup lang="ts">
import type { TCustomerSchema } from '~/utils/schema'

type Mode = 'creation' | 'edition'

const customerStore = useCustomerStore()

const customerToEdit = ref<TCustomerSchema | null>(null)
const customerOnEditionId = ref<number>(-1)
const showCard = ref(false)
const isCreationMode = ref(false)

const customerFormData = ref<TCustomerSchema>({
  name: '',
  phone: '',
  address: '',
})

provide('customerFormDataRef', customerFormData)
provide('customerOnEditionIdRef', customerOnEditionId)

function toggleMode(mode: Mode, isClosing: boolean) {
  showCard.value = !showCard.value

  if (mode === 'creation') {
    if (isClosing)
      isCreationMode.value = false
    else isCreationMode.value = !isCreationMode.value
  }
}

function enableEditingCustomerMode(customer: TCustomerSchema) {
  customerToEdit.value = customer
  toggleMode('edition', false)
}
</script>

<template>
  <section class="col-span-8 p-2">
    <div class="mb-1.5 flex flex-row items-center justify-between gap-x-4 rounded bg-white px-4 py-1 font-semibold leading-loose dark:bg-kGoldenColor/35">
      <h2>Clients</h2>

      <Transition name="fade-customer">
        <button v-show="!isCreationMode" class="flex flex-row items-center bg-kOrangeColor btn" @click="toggleMode('creation', false)">
          <div class="i-carbon-add" />
          Ajouter client
        </button>
      </Transition>
    </div>

    <Transition name="fade-customer">
      <ContactForm
        v-show="showCard"
        :customer="customerToEdit"
        :is-creation-mode="isCreationMode"
        @close-form="toggleMode('creation', true)"
        @refresh="customerStore.refresh"
      />
    </Transition>

    <div class="mt-4">
      <h1 class="px-2 text-lg font-medium">
        Client recent
      </h1>

      <div v-if="customerStore.isLoading || customerStore.fetchError" class="grid h-md place-content-center overflow-y-auto">
        <p v-if="customerStore.isLoading">
          Chargement en cours
        </p>
        <p v-if="customerStore.fetchError">
          Une erreur est survenu, veillez réessayer
        </p>
      </div>

      <div>
        <div v-if="customerStore.customers?.length === 0" class="grid h-md place-content-center overflow-y-auto">
          <Empty />
        </div>

        <ContactTables
          v-else
          :customers="customerStore.customers as unknown as TCustomerSchema[]"
          @on-edit-customer="(val: TCustomerSchema) => enableEditingCustomerMode(val)"
        />
      </div>
    </div>
  </section>
</template>

<style>
.fade-customer-enter-active,
.fade-customer-leave-active {
  transition: opacity 0.5s ease;
}

.fade-customer-enter-from,
.fade-customer-leave-to {
  transition: opacity 0;
}
</style>
