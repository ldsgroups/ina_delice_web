<script setup lang="ts">
import type { TCustomerSchema } from '~/utils/schema'
import type { ICustomerHistoric } from '~/utils/interfaces'

const { customer, historic } = defineProps<{
  customer: TCustomerSchema | null
  historic: ICustomerHistoric[]
}>()
</script>

<template>
  <section class="col-span-4 px-2">
    <div v-if="customer" relative h-full w-full>
      <div class="mb-4 h-12 border-b">
        <h2 class="font-medium text-black">
          {{ customer.name }}
        </h2>
        <div class="block flex items-center justify-between text-xs">
          <h3>{{ formatPhoneNumber(customer.phone) }}</h3>
          <p>{{ customer.address }}</p>
        </div>
      </div>

      <div style="height: 300px">
        <h2 class="mb-2 text-lg">
          Historique d'achat
        </h2>
        <div class="max-h-md overflow-y-auto">
          <el-steps direction="vertical">
            <el-step
              v-for="(mv, i) in historic" :key="i"
              :title="formatHumanDate(mv.created_at)"
              :description="`Dépensé: ${formatNumber(mv.total_amount)} ${mv.coupon_code ? ' | Avec coupon' : ''}`"
            />
          </el-steps>
        </div>
      </div>
    </div>
  </section>
</template>
