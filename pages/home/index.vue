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

const { $csSupabase, $csSequencer } = useNuxtApp()

const user = useSupabaseUser()
const showError = useErrorDisplayer()

const { appContext } = getCurrentInstance()!

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
      name: await $csSequencer(),
      sub_total: basket.value.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0),
      discount: discount.value,
      coupon_code: couponString.value,
      note: note.value,
      total_amount: basket.value.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0) - discount.value - coupon.value,
      // order_items: draftOrderItem,
      customer_id: customerId.value,
      seller_id: user.value.id,
      last_editor_id: user.value.id,
      updated_at: new Date().toISOString(),
    }

    // Save order
    const { data: newOrder, error: orderCreationError } = await $csSupabase.from('orders').insert(draftOrder).select('id').single()

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
    const { error: orderItemCreationError } = await $csSupabase.from('order_items').insert(draftOrderItem)

    if (orderItemCreationError)
      throw orderItemCreationError

    // Update all product quantity of product table with basket by basket quantity
    for (let i = 0; i < basket.value.length; i++) {
      const prod = basket.value[i]
      const oldQty = await $csSupabase.from('products').select('quantity').eq('is_active', true).match({ id: prod.itemId }).single()
      const newQty = oldQty.data!.quantity - prod.quantity

      const responseX = await $csSupabase.from('products').update({ quantity: newQty }).match({ id: prod.itemId })
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
  }
  catch (error) {
    showError(error as IError)
  }
  finally {
    isLoading.value = false
  }
}

provide('submitHandlerRef', submitHandler)
</script>

<template>
  <div class="h-full">
    <div class="dialogs">
      <el-dialog
        v-model="showBasketDialog" title="Votre panier"
        width="70%"
      >
        <SaleBasket @clear-basket="resetOrder" />
      </el-dialog>
    </div>

    <div class="grid-cols-12 h-full gap-x-4 md:grid">
      <SaleProducts />

      <SaleBasket class="hidden md:block" @clear-basket="resetOrder" />
    </div>
  </div>
</template>
