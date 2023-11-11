<script setup lang="ts">
import type { IOrder } from '~/utils/interfaces'

const order = inject('selectedOrderRef') as Ref<IOrder | null>

const { appContext } = getCurrentInstance()!

const isLoading = ref(false)

async function printReceipt() {
  if (isLoading.value)
    return

  isLoading.value = true

  try {
    await $fetch('/api/scrape/', {
      method: 'POST',
      body: { orderName: order.value?.name },
    })
  }
  catch (error) {
    ElMessage({
      message: 'Nous n\'avons pas pu générer le pdf',
      type: 'error',
      duration: 5000,
      appContext,
    })
  }
  finally {
    isLoading.value = false
  }

  isLoading.value = false
}
</script>

<template>
  <section v-if="!order" class="col-span-4 px-2">
    <Empty title="Aucune commande sélectionnée" description="Sélectionnez une commande pour voir les détails" />
  </section>

  <section v-else class="col-span-4 px-2">
    <div relative h-full w-full>
      <div class="h-12 border-b">
        <h2 class="font-medium text-black dark:text-gray-400">
          {{ order?.name }}
        </h2>
        <div class="block flex items-center justify-between text-xs">
          <h3>{{ formatDate(order?.createdAt!) }}</h3>
          <p>{{ formatNumber(order?.totalAmount!) }}</p>
        </div>
      </div>

      <ul class="max-h-xs overflow-y-auto">
        <li
          v-for="(el, idx) in order?.details" :key="el.productId"
          class="flex items-center justify-between rounded-lg px-4 py-2"
          :class="`${isPairItem(idx).value ? '' : 'bg-kGrayColor/15'}`"
        >
          <div flex flex-row items-center>
            <div class="i-carbon-chevron-right" />
            <span font-semibold>
              {{ el.quantity }}x {{ el.productName }}
            </span>
          </div>

          <div flex flex-row items-center gap-x-2>
            <div truncate text-center>
              {{ formatNumber(el.price) }} F
              <p class="text-xs text-kGrayColor/85">
                {{ formatNumber(el.total) }} F
              </p>
            </div>
          </div>
        </li>
      </ul>

      <div class="absolute bottom-5 w-full">
        <div class="mt-2 bg-kGrayColor/15 p-2">
          <div class="grid grid-cols-3">
            <TitleValueListTile title="Sous total" :value="order === null ? '0' : order.totalAmount.toString()!" />
            <TitleValueListTile title="Réduction" value="0" />
            <TitleValueListTile
              title="Sous total" :value="order === null ? '0' : order.totalAmount.toString()!"
              :is-bold="true"
            />
          </div>
        </div>

        <div class="mt-4 flex flex-row items-center gap-x-4">
          <button class="mx-auto w-full text-center btn" @click="printReceipt">
            <div class="flex flex-row items-center justify-center">
              <div v-if="isLoading" class="i-carbon-settings animate-spin" />
              <span>Imprimer reçu</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
