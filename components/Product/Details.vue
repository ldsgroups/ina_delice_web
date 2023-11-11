<script setup lang="ts">
const { $csSupabase } = useNuxtApp()

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

const lastShowedProductMovementId = ref<number | null>(null)
const showProductMovements = ref(false)
const movements = ref<{
  id: number
  quantity: number
  price: number
  order: {
    name: string
    createdAt: Date
  }
}[] | null>(null)

async function onShowProductMovements() {
  const productId = selectedProduct.value?.id
  if (lastShowedProductMovementId.value === productId) {
    showProductMovements.value = true
    lastShowedProductMovementId.value = productId
    return
  }

  const { data: asyncMovements } = await $csSupabase.from('order_items').select('id, quantity, price, orders(name, created_at)').eq('product_id', productId!).order('created_at', { ascending: false })

  movements.value = asyncMovements!.map(mv => ({
    id: mv.id,
    quantity: mv.quantity,
    price: mv.price,
    order: {
      name: 'a name',
      createdAt: new Date(),
    },
  }))
  showProductMovements.value = true
  lastShowedProductMovementId.value = productId!
}
</script>

<template>
  <section v-if="!selectedProduct" class="col-span-4 px-2">
    <Empty
      title="Aucun produit sélectionné"
      description="Sélectionnez un produit pour voir les détails"
    />
  </section>

  <section v-else class="col-span-4 px-2">
    <el-drawer
      v-model="showProductMovements"
      :title="`Mouvements de stock de ${selectedProduct?.name}`"
      direction="rtl"
    >
      <div style="height: 300px">
        <el-steps direction="vertical">
          <el-step
            v-for="(mv, i) in movements" :key="i"
            :title="formatHumanDate(mv.order.createdAt)" :description="`Quantité: ${mv.quantity} | Profit: ${formatNumber(mv.price * selectedProduct.profit, ' F')}`"
          />
        </el-steps>
      </div>
    </el-drawer>

    <div class="mb-1.5 h-[48px] flex flex-row justify-between border-b rounded bg-white px-4 py-1 font-semibold leading-loose dark:bg-kGoldenColor/35">
      <div class="rounded bg-kGrayColor/45 px-2.5 pt-2 hover:bg-kGrayColor/75" @click="onShowProductMovements">
        <button class="icon-btn text-kDarkColor">
          <IconHistory class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="w-full flex items-center rounded-xl bg-white p-6 shadow-sm space-x-4 dark:bg-kGrayColor/15">
      <div class="shrink-0">
        <nuxt-img class="h-20 w-20" :src="productBucket(selectedProduct.image)" alt="photo du produit" />
      </div>

      <div w-full>
        <div class="text-xl font-medium text-black dark:text-gray-300">
          {{ selectedProduct?.name }}
        </div>
        <p class="text-slate-500">
          {{ selectedProduct?.category.name }}
        </p>
      </div>
    </div>

    <div mt-6>
      <p class="border-y px-4 py-4 text-gray-400 dark:text-gray-400">
        <span class="text-3xl text-black dark:text-gray-300">{{ selectedProduct?.quantity }} unités</span> disponible{{ selectedProduct === null || selectedProduct.quantity <= 1 ? '' : 's' }}
      </p>
      <p class="border-b px-4 py-4 text-gray-400 dark:text-gray-400">
        <span class="text-3xl text-black dark:text-gray-300">{{ formatNumber(selectedProduct?.profit ?? 0, ' F') }}</span> comme profit
      </p>
      <div>
        <!-- Card of created at and updated at -->
        <div class="grid mt-4 gap-4">
          <div class="w-full border rounded border-dashed px-4 py-2">
            <p class="text-gray-400 dark:text-gray-400">
              Créé le
            </p>
            <p>12/12/2021</p>
          </div>
          <div class="w-full border rounded border-dashed px-4 py-2">
            <p class="text-gray-400 dark:text-gray-400">
              Modifié le
            </p>
            <p>12/12/2021</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
