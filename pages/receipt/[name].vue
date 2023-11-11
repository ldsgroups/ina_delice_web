<script setup lang="ts">
import type { IOrder } from '~/utils/interfaces'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const screen = useAwesomeScreen()
const color = useColorMode()
const { $csSupabase } = useNuxtApp()

const oldThemeMode = ref('')
const order = ref<IOrder | null>(null)

function generateDivider() {
  const nbStar = screen.screenSize.width * 0.148
  let _start = ''

  for (let i = 0; i < nbStar; i++)
    _start += '*'

  return _start
}

async function getOrder(orderName: string) {
  const result = await $csSupabase.from('orders').select('id, name, created_at, discount, coupon_code, total_amount, order_items(id, quantity, price, products(id, name))').order('created_at', { ascending: false }).match({ name: orderName }).single()
  const ord = result.data!

  order.value = {
    id: ord.id,
    name: ord.name,
    date: new Date(ord.created_at),
    discount: ord.discount,
    couponCode: ord.coupon_code,
    totalAmount: ord.total_amount,
    createdAt: ord.created_at,
    details: ord.order_items.map(item => ({
      id: item.id,
      productName: item.products!.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
  }
}

onBeforeMount(() => {
  oldThemeMode.value = color.value
  color.preference = 'light'
})

onBeforeUnmount(() => {
  color.preference = oldThemeMode.value
  oldThemeMode.value = ''
})

onMounted(async () => {
  await getOrder((route.params as { name: string }).name)
})
</script>

<template>
  <div>
    <div v-if="order === null" class="grid h-screen place-content-center">
      <Empty
        title="Chargement en cours"
        description="Veillez patientez, nous sommes entrain de récupérer les donnees"
      />
    </div>

    <div v-else id="order-receipt" class="text-xs">
      <div class="header text-center">
        <h1 class="text-md font-bold">
          INA DELICE MARQUE 4
        </h1>
        <p class="text-[0.5rem]">
          Adresse: Près du Collège Koffi Ackan
        </p>
        <p class="text-[0.5rem]">
          Contact: {{ formatPhoneNumber('0748494739') }}
        </p>

        <p>{{ generateDivider() }}</p>
        <h2>REÇU DE PAIEMENT</h2>
        <p>{{ generateDivider() }}</p>
      </div>

      <div class="relative max-h-md overflow-y-auto sm:rounded-lg">
        <table class="w-full text-left">
          <thead class="uppercase">
            <tr>
              <th scope="col" class="py-1 text-left">
                Description
              </th>
              <th scope="col" class="py-1 text-right">
                Montant Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in order.details" :key="idx">
              <td scope="row" class="truncate whitespace-nowrap text-left">
                {{ item.quantity }}x {{ item.productName }}
              </td>
              <td class="text-right">
                {{ formatNumber(item.total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="resume text-center">
        <p>{{ generateDivider() }}</p>
        <div class="grid grid-cols-2 text-left">
          <div class="font-semibold">
            Total
          </div>
          <div class="text-right font-semibold">
            {{ formatNumber(order.totalAmount!) }}
          </div>
          <div>Réduction</div>
          <div class="text-right">
            {{ formatNumber(order.discount!) }}
          </div>
          <div>Avec coupon</div>
          <div class="text-right uppercase">
            {{ order.couponCode ? 'oui' : 'non' }}
          </div>
        </div>
      </div>

      <div class="usual-info text-center">
        <p>{{ generateDivider() }}</p>
        <div class="grid grid-cols-2 text-left">
          <div>
            Date et Heure
          </div>
          <div class="text-right">
            {{ formatDate(order.createdAt!) }}
            {{ formatTime(order.createdAt!) }}
          </div>
          <div>
            N° reçu
          </div>
          <div class="text-right">
            {{ order.name }}
          </div>
        </div>
      </div>

      <div class="footer text-center">
        <p>{{ generateDivider() }}</p>
        <div class="font-bold uppercase">
          merci et à bientôt
        </div>
      </div>
    </div>
  </div>
</template>
