<script setup lang="ts">
const emits = defineEmits(['clearBasket'])

const customerStore = useCustomerStore()

const selectedCustomer = inject('customerIdRef') as Ref<number>
</script>

<template>
  <section class="col-span-4 px-2">
    <div relative h-full w-full>
      <div class="h-12 flex items-center justify-between gap-x-4">
        <el-select v-model="selectedCustomer" filterable placeholder="Choisissez client">
          <el-option
            v-for="item in customerStore.customers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <div class="flex flex-row gap-x-2">
          <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
            <button class="i-carbon-add icon-btn text-kDarkColor" />
          </div>
          <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
            <button class="i-carbon-list icon-btn text-kDarkColor" />
          </div>
          <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
            <button class="i-carbon-reset icon-btn text-kDarkColor" @dblclick="emits('clearBasket')" />
          </div>
        </div>
      </div>

      <SaleBasketItem />

      <SaleBasketResume />
    </div>
  </section>
</template>
