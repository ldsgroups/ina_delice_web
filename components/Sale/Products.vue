<script setup lang="ts">
import type { TBasketSchema } from '~/utils/schema'
import type { IProduct } from '~/utils/interfaces'

// const { $csSupabase } = useNuxtApp()
const categoryStore = useCategoryStore()
const productStore = useProductStore()
const screen = useAwesomeScreen()

const gridDisposition = computed(() => {
  // display 1, 2, 3 or 4 items depending screen width
  if (screen.screenSize.width <= 400)
    return 'grid-cols-1'
  else if (screen.screenSize.width > 400 && screen.screenSize.width <= 550)
    return 'grid-cols-2'
  else if (screen.screenSize.width > 550 && screen.screenSize.width <= 950)
    return 'grid-cols-3'
  else return 'grid-cols-4'
})

const activeCategory = ref<number>(1)
const basket = inject('basketRef') as Ref<TBasketSchema[]>
const search = inject('searchRef') as Ref<string>

// const { data: products, refresh } = await useAsyncData(async () => {
//   const { data } = await $csSupabase.from('products').select('id, name, price, image, categories(id)').eq('is_active', true).eq('category_id', activeCategory.value).ilike('name', `%${search.value}%`)

//   return data
// }, { immediate: false })

function refresh() {
  productStore.filterProducts({ search: search.value, category_id: activeCategory.value })
}

watchThrottled(search, () => {
  refresh()
}, { throttle: 700 })

function addItemToBasket(item: IProduct) {
  let found = 0

  const index = basket.value.findIndex(el => el.itemId === item.id)

  if (index === -1) {
    const draftItem: TBasketSchema = {
      itemId: item.id,
      itemName: item.name,
      quantity: 1,
      price: item.price,
      total: item.price,
    }

    basket.value.unshift(draftItem)
    found = index
  }

  if (found)
    return

  basket.value[index].quantity++
  basket.value[index].total += item.price
}

// const { data: categories } = useAsyncData(async () => {
//   const { data } = await $csSupabase.from('categories').select('id, name')
//   return data
// })

function setCategory(catId: number) {
  if (activeCategory.value === catId)
    return

  activeCategory.value = catId
  refresh()
}
</script>

<template>
  <section class="bg-kGrayColor/25 p-2 md:col-span-8">
    <ul class="mb-1.5 flex flex-row gap-x-4 rounded bg-white px-4 py-1 font-semibold leading-loose dark:bg-kGoldenColor/35">
      <li
        v-for="cat in categoryStore.categories" :key="cat.id"
        :class="`rounded px-2 py-0.5 cursor-pointer hover:bg-kOrangeColor/20 select-none ${activeCategory === cat.id ? 'border text-kOrangeColor border-kOrangeColor bg-kOrangeColor/20' : ''}`"
        @click="setCategory(cat.id)"
      >
        {{ cat.name }}
      </li>
    </ul>

    <div :class="`grid ${gridDisposition} max-h-lg gap-2 overflow-y-auto overflow-x-hidden py-4`">
      <div
        v-for="item in productStore.products" :key="item.id"
        class="w-full flex flex-col cursor-pointer select-none items-center justify-center rounded-md bg-white p-4 text-center shadow-md transition-all duration-300 ease-out hover:scale-105 space-x-4 dark:bg-kGoldenColor/35 hover:bg-kGoldenColor dark:hover:bg-kGoldenColor/65"
        @click="() => addItemToBasket(item as any)"
      >
        <nuxt-img
          class="h-28 w-28 rounded-full object-cover object-center"
          :src="productBucket(item.image)" :alt="item.name"
        />
        <div class="mt-4 text-center text-xs space-y-2">
          <div class="space-y-0.5">
            <p class="font-medium text-slate-500 dark:text-white/65">
              {{ item.name }}
            </p>
            <p class="truncate text-lg font-semibold text-black dark:text-white">
              {{ formatNumber(item.price, ' F') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
