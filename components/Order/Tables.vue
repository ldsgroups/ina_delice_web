<script setup lang="ts">
import type { IError, IOption, IOrder } from '~/utils/interfaces'

const router = useRouter()
const { $csSupabase } = useNuxtApp()
const showError = useErrorDisplayer()
const { appContext } = getCurrentInstance()!
const today = ref(new Date().toISOString().substring(0, 10))
const tomorrow = ref(new Date(new Date(today.value).setDate(new Date().getDate() + 1)).toISOString().substring(0, 10))

watch(today, () => {
  if (today.value === null)
    return

  tomorrow.value = checkTomorrow()
})

type TOrderStatus = 'pending' | 'paid' | 'delivered' | 'cancelled'

const orderStatus = [
  {
    label: 'En cours',
    value: 'pending',
  },
  {
    label: 'Livrée',
    value: 'delivered',
  },
  {
    label: 'Payée',
    value: 'paid',
  },
  {
    label: 'Annulée',
    value: 'cancelled',
  },
]

function filterOrderStatus(status: TOrderStatus) {
  return computed(() => {
    switch (status) {
      case 'pending':
        return orderStatus.filter(el => el.value !== 'pending')
      case 'delivered':
        return orderStatus.filter(el => el.value !== 'pending' && el.value !== 'delivered')
      case 'paid':
        return orderStatus.filter(el => el.value === 'cancelled')
      case 'cancelled':
        return []

      default:
        break
    }
  }).value
}

function checkTomorrow() {
  const _date = new Date(new Date(today.value).setDate(new Date(today.value).getDate() + 1))
  return _date.toISOString().substring(0, 10)
}

const selectedOrder = inject('selectedOrderRef') as Ref<IOrder | null>

const activeStatus = ref<string>('historic')

const { data: orders, pending, error, refresh } = useAsyncData(async () => {
  if (activeStatus.value === 'historic') {
    const { data } = await $csSupabase.from('orders').select('id, name, created_at, total_amount, status, order_items(id, quantity, price, products(id, name))').gt('created_at', today.value).lte('created_at', tomorrow.value).order('created_at', { ascending: false })

    return data
  }
  else if (activeStatus.value === 'is-not-paid') {
    const { data } = await $csSupabase.from('orders').select('id, name, created_at, total_amount, status, order_items(id, quantity, price, products(id, name))').gt('created_at', today.value).lte('created_at', tomorrow.value).neq('status', 'paid').order('created_at', { ascending: false })

    return data
  }
  else {
    const { data } = await $csSupabase.from('orders').select('id, name, created_at, total_amount, status, order_items(id, quantity, price, products(id, name))').gt('created_at', today.value).lte('created_at', tomorrow.value).eq('status', activeStatus.value).order('created_at', { ascending: false })

    return data
  }
})

const categories = ref<IOption[]>([
  { value: 'historic', label: 'Historique' },
  { value: 'pending', label: 'En cours' },
  { value: 'is-not-paid', label: 'Non payé' },
  { value: 'cancelled', label: 'Commande annulée' },
])

const isViewing = (orderId: number) => computed(() => selectedOrder.value?.id === orderId)

const dateShortcuts = [
  {
    text: 'Aujourd\'hui',
    value: new Date(),
  },
  {
    text: 'Hier',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
]

function goToEdit(orderName: string, status: TOrderStatus) {
  if (status !== 'pending') {
    ElMessage({
      message: 'Veillez contacter votre responsable pour modifier cette commande',
      type: 'warning',
      duration: 7000,
      appContext,
    })

    return
  }

  router.push({ name: 'home-name-edit', params: { name: orderName } })
}

function setActiveStatus(value: string) {
  activeStatus.value = value
  refresh()
}

function setSelectedOrder(ord: any) {
  if (selectedOrder.value !== null && selectedOrder.value!.id === ord.id) {
    selectedOrder.value = null
  }
  else {
    selectedOrder.value = {
      id: ord.id,
      name: ord.name,
      date: ord.created_at,
      totalAmount: ord.total_amount,
      createdAt: ord.created_at,
      details: ord.order_items.map((item: any) => ({
        id: item.id,
        productName: item.products.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
    }
  }
}

async function updateStatus(orderName: string, status: TOrderStatus) {
  try {
    const { error: changeStatusError } = await $csSupabase.from('orders').update({ status }).match({ name: orderName }).single()

    if (changeStatusError)
      throw changeStatusError
  }
  catch (error) {
    showError(error as IError)
  }
}
</script>

<template>
  <p v-if="pending">
    Chargement ...
  </p>
  <p v-else-if="error">
    Erreur de chargement
  </p>

  <section v-else class="col-span-8 p-2">
    <div class="flex flex-row items-center justify-between rounded bg-white shadow-md">
      <ul
        class="mb-1.5 flex flex-row gap-x-4 px-4 py-1 font-semibold leading-loose dark:bg-kGoldenColor/35"
      >
        <li
          v-for="cat in categories" :key="cat.value"
          :class="`rounded px-2 py-0.5 cursor-pointer hover:bg-kOrangeColor/20 ${activeStatus === cat.value ? 'border text-kOrangeColor border-kOrangeColor bg-kOrangeColor/20' : ''}`"
          @click="setActiveStatus(cat.value)"
        >
          {{ cat.label }}
        </li>
      </ul>

      <el-date-picker
        v-model="today" type="date"
        placeholder="Filtrer par date"
        :shortcuts="dateShortcuts"
        format="DD-MM-YYYY"
        value-format="YYYY-MM-DD"
        @change="() => {
          if (today === null)
            return
        }"
      />
    </div>

    <div class="relative max-h-md overflow-y-auto sm:rounded-lg">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3 text-left">
              Référence
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-right">
              Montant Total
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Modifier
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Voir
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, idx) in orders" :key="order.name"
            :class="`${isPairItem(idx).value ? 'bg-kGrayColor/15' : ''}`"
          >
            <th scope="row" class="whitespace-nowrap px-6 py-4 text-left font-medium text-gray-900 dark:text-white">
              {{ order.name }}
            </th>
            <td class="truncate px-6 py-4 text-center">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-6 py-4 text-right">
              {{ formatNumber(order.total_amount) }} F
            </td>
            <td class="px-6 py-4 text-center">
              <el-select
                v-model="order.status" placeholder="Assigné un status"
                @change="(status: TOrderStatus) => updateStatus(order.name, status)"
              >
                <el-option
                  v-for="item in filterOrderStatus(order.status)" :key="item.value" :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </td>
            <td class="px-6 py-4 text-center">
              <button class="i-carbon-pen" @click="goToEdit(order.name, order.status)" />
            </td>
            <td class="px-6 py-4 text-center">
              <button
                :class="[isViewing(order.id).value ? 'i-carbon-view-filled' : 'i-carbon-view-off opacity-25']"
                @click="setSelectedOrder(order)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
