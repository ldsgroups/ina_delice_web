<script setup lang="ts">
import type { TBasketSchema } from '~/utils/schema'

const basket = inject('basketRef') as Ref<TBasketSchema[]>

function removeItemFromBasket(item: TBasketSchema) {
  basket.value = basket.value.filter(el => el.itemId !== item.itemId)
}
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="max-h-xs overflow-x-hidden overflow-y-auto">
    <li
      v-for="(item, idx) in basket" :key="item.itemId"
      class="flex items-center justify-between rounded-lg px-4 py-2"
      :class="`${isPairItem(idx).value ? '' : 'bg-kGrayColor/15'}`"
    >
      <div flex flex-row items-center>
        <div class="i-carbon-chevron-right" />
        <span font-semibold>
          {{ formatNumber(item.quantity, 'x') }} {{ item.itemName }}
        </span>
      </div>

      <div flex flex-row items-center gap-x-2>
        <div text-center>
          {{ formatNumber(item.total, ' F') }}
          <p class="text-xs text-kGrayColor/85">
            {{ formatNumber(item.price, ' F') }}
          </p>
        </div>
        <div
          class="i-carbon-close-outline cursor-pointer transition-all duration-300 ease-in-out hover:i-carbon-trash-can"
          @click="removeItemFromBasket(item)"
        />
      </div>
    </li>
  </TransitionGroup>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
