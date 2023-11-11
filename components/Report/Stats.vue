<script setup lang="ts">
// import {
//   CaretBottom,
//   CaretTop,
//   Warning,
// } from '@element-plus/icons-vue'

// const messages = [
//   {
//     title: 'Vente du jour',
//     tooltip: 'Montant vendu aujourd\'hui et disponible dans la caisse',
//   },
//   {
//     title: 'Nombre de clients du jour',
//     tooltip: 'Nombre de clients reçus et enregistrés aujourd\'hui',
//   },
//   {
//     title: 'Commandes en attente',
//     tooltip: 'Nombre de client qui attendent d’être servi',
//   },
// ]

// const defaultResume = {
//   label: '',
//   value: 0,
//   rate: 0,
//   tooltip: '',
//   callback: () => {},
// }
// const defaultStats = [defaultResume, defaultResume, defaultResume]
// const showTopFiveSale = ref<boolean>(false)
// const showTopFiveCustomer = ref<boolean>(false)
// const showOldTopFiveWaitingOrder = ref<boolean>(false)

// // const stats = await $fetch('http://localhost:3000/reports/stats')
// const { data: stats, pending, error, refresh } = useFetch('/api/reports/stats')

// // const listOfResume = ref([
// //   {
// //     label: 'Vente du jour',
// //     value: 98500,
// //     rate: 0.24,
// //     tooltip: 'Montant vendu aujourd\'hui et disponible dans la caisse',
// //     callback: toggleTopFiveSale,
// //   },
// //   {
// //     label: 'Nombre de clients du jour',
// //     value: 693700,
// //     rate: -0.12,
// //     tooltip: 'Nombre de clients reçus et enregistrés aujourd\'hui',
// //     callback: toggleTopFiveCustomer,
// //   },
// //   {
// //     label: 'Commandes en attente',
// //     value: 72000,
// //     rate: 0.16,
// //     tooltip: 'Nombre de client qui attendent d’être servi',
// //     callback: toggleOldTopFiveWaitingOrder,
// //   },
// // ])

// // get list of resume from stats
// const listOfResume = computed(() => {
//   // if is pending or error return empty array
//   if (pending.value || error.value)
//     return [defaultResume, defaultResume, defaultResume]

//   const ansyncStats = stats.value === null ? defaultStats : stats.value

//   // add tooltip and callback to each resume
//   ansyncStats.forEach((resume, index) => {
//     const { title, tooltip } = messages[index]
//     resume.label = title
//     resume.tooltip = tooltip
//     resume.cbMessage = index === 0 ? 'toggleTopFiveSale' : index === 1 ? 'toggleTopFiveCustomer' : 'toggleOldTopFiveWaitingOrder'
//   })

//   return ansyncStats
// })

// function toggleTopFiveSale() {
//   showTopFiveSale.value = !showTopFiveSale.value
// }

// function toggleTopFiveCustomer() {
//   showTopFiveCustomer.value = !showTopFiveCustomer.value
// }

// function toggleOldTopFiveWaitingOrder() {
//   showOldTopFiveWaitingOrder.value = !showOldTopFiveWaitingOrder.value
// }

// const gridData = [
//   {
//     date: '2016-05-02',
//     name: 'John Smith',
//     address: 'No.1518,  Jinshajiang Road, Putuo District',
//   },
//   {
//     date: '2016-05-04',
//     name: 'John Smith',
//     address: 'No.1518,  Jinshajiang Road, Putuo District',
//   },
//   {
//     date: '2016-05-01',
//     name: 'John Smith',
//     address: 'No.1518,  Jinshajiang Road, Putuo District',
//   },
//   {
//     date: '2016-05-03',
//     name: 'John Smith',
//     address: 'No.1518,  Jinshajiang Road, Putuo District',
//   },
// ]

// function toPercent(point: number) {
//   return computed(() => {
//     return {
//       isPositive: point > 0,
//       percent: (Math.abs(point) * 100).toFixed(0),
//     }
//   })
// }

// function executeToggler(callbackString: string) {
//   switch (callbackString) {
//     case 'toggleTopFiveSale':
//       toggleTopFiveSale()
//       break
//     case 'toggleTopFiveCustomer':
//       toggleTopFiveCustomer()
//       break
//     case 'toggleOldTopFiveWaitingOrder':
//       toggleOldTopFiveWaitingOrder()
//       break
//     default:
//       break
//   }
// }
</script>

<template>
  <div>Bonjour</div>
  <!-- <div class="dialogs">
    <el-dialog v-model="showTopFiveSale" title="Top 5 des ventes">
      <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="showTopFiveCustomer" title="Top 5 des clients">
      <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="showOldTopFiveWaitingOrder" title="Les 5 anciens clients en attente">
      <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </el-dialog>
  </div> -->

  <!-- <el-row :gutter="16">
    <el-col v-for="resume in listOfResume" :key="resume.label" :span="8">
      <div class="statistic-card justify-between shadow dark:shadow-gray-600">
        <el-statistic :value="resume.value">
          <template #title>
            <div class="flex items-center justify-between justify-between">
              <div class="flex flex-row items-center justify-between">
                {{ resume.label }}
                <el-tooltip
                  effect="dark"
                  :content="resume.tooltip"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>

              <button class="i-carbon-view" @click="executeToggler(resume.cbMessage)" />
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>par rapport à hier</span>
            <span :class="toPercent(resume.rate).value.isPositive ? 'green' : 'red'">
              {{ toPercent(resume.rate).value.percent }}%
              <el-icon>
                <CaretTop v-if="toPercent(resume.rate).value.isPositive" />
                <CaretBottom v-else />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row> -->
</template>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
