<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { TBasketSchema } from '~/utils/schema'
import type { IError } from '~/utils/interfaces'
import { appName } from '~/constants'

useHead({
  title: `POS | ${appName}`,
})

definePageMeta({
  middleware: 'auth',
})

type IOrderInsert = Database['public']['Tables']['orders']['Insert']
type IOrderItemsInsert = Database['public']['Tables']['order_items']['Insert']

const { $csSupabase } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const showError = useErrorDisplayer()

const { appContext } = getCurrentInstance()!

let oldSellerId = ''
// routeParams look like "VT230901-true" mean "name(sequence)-is_paid"
const routeParams = (route.params as { name: string }).name.split('-')
const orderName = routeParams[0].toUpperCase()
const orderIsAlreadyPaid = routeParams[1] === 'true'
let oldBasket: TBasketSchema[] = []
let newBasket: TBasketSchema[] = []

const orderId = ref(0)
const isLoading = ref(false)
const customerId = ref<number>(1)
const discount = ref<number>(0)
const couponString = ref<string | null>(null)
const coupon = ref<number>(0)
const note = ref<string | null>(null)
const basket = ref<TBasketSchema[]>([])
provide('isLoadingRef', isLoading)
provide('basketRef', basket)
provide('discountRef', discount)
provide('couponStringRef', couponString)
provide('couponRef', coupon)
provide('noteRef', note)
provide('customerIdRef', customerId)

const showBasketDialog = inject('showBasketDialogRef') as Ref<boolean>

function resetOrder() {
  customerId.value = 1
  basket.value = []
  discount.value = 0
  couponString.value = null
  coupon.value = 0
  note.value = null
}

async function submitHandler() {
  // switch basket schema to array
  const _basketArraySchema = basketSchema.array().nonempty('Le panier ne peut pas être vide')

  try {
    if (isLoading.value)
      return

    isLoading.value = true

    // validate basket first
    _basketArraySchema.parse(basket.value)

    // if basket is valid, create draft order
    const draftOrder: IOrderInsert = {
      name: orderName,
      sub_total: basket.value.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0),
      discount: discount.value,
      coupon_code: couponString.value,
      note: note.value,
      total_amount: basket.value.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0) - discount.value - coupon.value,
      // order_items: draftOrderItem,
      customer_id: customerId.value,
      seller_id: oldSellerId,
      last_editor_id: user.value.id,
      updated_at: new Date().toISOString(),
    }

    // Save order
    const { data: newOrder, error: orderCreationError } = await $csSupabase.from('orders').update(draftOrder).match({ name: orderName }).select('id').single()

    if (orderCreationError)
      throw orderCreationError

    const draftOrderItem: IOrderItemsInsert[] = basket.value.map((el) => {
      return {
        order_id: newOrder!.id,
        product_id: el.itemId,
        quantity: el.quantity,
        price: el.price,
      }
    })

    // Save OrderItems
    const { error: orderItemDeletionError } = await $csSupabase.from('order_items').delete().match({ order_id: orderId.value })

    if (orderItemDeletionError)
      throw orderItemDeletionError

    const { error: orderItemCreationError } = await $csSupabase.from('order_items').insert(draftOrderItem)

    if (orderItemCreationError)
      throw orderItemCreationError

    // new basket is the merge of distinct oldBasket and basket based on itemId
    newBasket = oldBasket.concat(basket.value.filter(item => !oldBasket.some(el => el.itemId === item.itemId)))

    // update all item on newBasket with oldBasket quantity
    for (let i = 0; i < newBasket.length; i++) {
      const old = newBasket[i]
      const prodExist = oldBasket.findIndex(el => el.itemId === old.itemId)

      if (prodExist !== -1)
        old.quantity = oldBasket[prodExist].quantity
    }

    // substract basket quantity to newBasket quantity were item exist in oldBasket
    for (let i = 0; i < newBasket.length; i++) {
      const old = newBasket[i]
      const prodExist = oldBasket.findIndex(el => el.itemId === old.itemId)

      if (prodExist !== -1) {
        const basketItem = basket.value.find(el => el.itemId === old.itemId)
        newBasket[i].quantity = basketItem!.quantity - old.quantity
      }
    }

    // Update all product quantity of product table with basket by basket quantity
    for (let i = 0; i < newBasket.length; i++) {
      const basketItem = newBasket[i]
      const oldQty = await $csSupabase.from('products').select('quantity').eq('is_active', true).match({ id: basketItem.itemId }).single()
      // new quantity = initial quantity - remain quantity (remote - local)
      const newQty = oldQty.data!.quantity - basketItem.quantity

      const responseX = await $csSupabase.from('products').update({ quantity: newQty }).match({ id: basketItem.itemId })
      if (responseX.error)
        throw responseX.error.message
    }

    ElMessage({
      message: 'La commande a été enregistrée',
      type: 'success',
      appContext,
    })

    // reset order
    resetOrder()

    // redirect to order list
    router.push({ name: 'order', replace: true })
  }
  catch (error) {
    showError(error as IError)
  }
  finally {
    isLoading.value = false
  }
}

provide('submitHandlerRef', submitHandler)

onMounted(async () => {
  if (orderIsAlreadyPaid)
    return router.back()

  const { data: order } = await $csSupabase.from('orders').select('id, sub_total, discount, note, total_amount, customer_id, seller_id, coupons(code, discount), order_items(quantity, price, products(id, name))').match({ name: orderName }).single()

  oldSellerId = order?.seller_id ?? ''
  orderId.value = order?.id ?? 0
  customerId.value = order?.customer_id ?? 0
  discount.value = order?.discount ?? 0
  couponString.value = order?.coupons?.code ?? null
  coupon.value = order?.coupons?.discount ?? 0
  note.value = order?.note ?? null

  basket.value = order!.order_items.map((item) => {
    return {
      itemId: item.products?.id ?? 0,
      itemName: item.products?.name ?? '',
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }
  })

  oldBasket = order!.order_items.map((item) => {
    return {
      itemId: item.products?.id ?? 0,
      itemName: item.products?.name ?? '',
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }
  })
})
</script>

<template>
  <div class="h-full">
    <div class="dialogs">
      <el-dialog v-model="showBasketDialog" title="Votre panier" width="70%">
        <SaleBasket @clear-basket="resetOrder" />
      </el-dialog>
    </div>

    <div class="grid-cols-12 h-full gap-x-4 md:grid">
      <SaleProducts />

      <SaleBasket class="hidden md:block" @clear-basket="resetOrder" />
    </div>
  </div>
</template>
