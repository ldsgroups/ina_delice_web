<script setup lang="ts">
import type { TBasketSchema } from '~/utils/schema'

const discountBtnRef = ref()
const discountPopoverRef = ref()
const couponBtnRef = ref()
const couponPopoverRef = ref()
const noteBtnRef = ref()
const notePopoverRef = ref()

const isLoading = inject('isLoadingRef') as Ref<boolean>
const discount = inject('discountRef') as Ref<number>
const couponString = inject('couponStringRef') as Ref<string | null>
// const coupon = inject('couponRef') as Ref<number>
const note = inject('noteRef') as Ref<string | null>
const basket = inject('basketRef') as Ref<TBasketSchema[]>
const submitHandler = inject('submitHandlerRef') as () => Promise<void>

const subTotal = computed(() => basket.value.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0))

const amountTotal = computed(() => subTotal.value - discount.value)

function onClickOutsideDiscount() {
  unref(discountPopoverRef).popperRef?.delayHide?.()
}

// function onClickOutsideCoupon() {
//   unref(couponPopoverRef).popperRef?.delayHide?.()
// }

function onClickOutsideNote() {
  unref(notePopoverRef).popperRef?.delayHide?.()
}

// async function setCoupon() {
//   // check if coupon string is not empty
//   if (couponString.value === null || couponString.value.trim() === '')
//     return

//   // check if coupon string is valid, if true, set coupon value
//   const { data: _coupon } = await $csSupabase.from('coupons').select('*').eq('code', couponString.value).eq('is_active', true).single()

//   // coupon response is like { correct: true, value: 1000 }
//   if (_coupon)
//     coupon.value = _coupon.discount
//     // couponString.value = ''
// }
</script>

<template>
  <div class="absolute bottom-5 w-full">
    <div class="flex items-center justify-between rounded bg-kOrangeColor/25 p-2 text-xs font-bold text-kOrangeColor">
      <span text-kDarkColor dark:text-kGoldenColor>Ajouter</span>

      <div class="flex items-center gap-x-2">
        <el-popover
          ref="discountPopoverRef" :virtual-ref="discountBtnRef" trigger="click" title="Réduction"
          virtual-triggering
        >
          <el-input-number v-model="discount" :min="0" :max="100" size="small" />
        </el-popover>

        <el-popover ref="couponPopoverRef" :virtual-ref="couponBtnRef" trigger="click" title="Coupon" virtual-triggering>
          <el-input v-model="couponString" placeholder="Entrer votre coupon" size="small" clearable />
        </el-popover>

        <el-popover ref="notePopoverRef" :virtual-ref="noteBtnRef" trigger="click" title="Note" virtual-triggering>
          <el-input v-model="note" type="textarea" size="small" clearable />
        </el-popover>

        <button ref="discountBtnRef" :click-outside="onClickOutsideDiscount">
          Réduction
        </button>
        <!-- <button ref="couponBtnRef" :click-outside="onClickOutsideCoupon">
          Coupon
        </button> -->
        <button ref="noteBtnRef" :click-outside="onClickOutsideNote">
          Note
        </button>
      </div>
    </div>

    <div class="mt-2 bg-kGrayColor/15 p-2">
      <div class="grid grid-cols-3">
        <TitleValueListTile title="Sous total" :value="formatNumber(subTotal, ' F')" />
        <TitleValueListTile title="Réduction" :value="formatNumber(discount, ' F')" />
        <TitleValueListTile title="Sous total" :value="formatNumber(amountTotal, ' F')" :is-bold="true" />
      </div>
    </div>

    <div class="mt-4 flex flex-row items-center gap-x-4">
      <!-- <button class="w-full bg-kOrangeColor btn hover:bg-kOrangeColor/96">
        Mettre en Attente
      </button> -->
      <button w-full btn @click="submitHandler">
        <div class="flex flex-row items-center justify-center">
          <div v-if="isLoading" class="i-carbon-settings animate-spin" />
          <span>Valider</span>
        </div>
      </button>
    </div>
  </div>
</template>
