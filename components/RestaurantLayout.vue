<script setup lang="ts">
import type { ITable, ITableLayout } from 'utils/interfaces'

const { tables } = defineProps<{
  tables: ITable[]
}>()

function generateTableLayouts(tables: ITable[], availableSpace: { width: number; height: number }): ITableLayout[] {
  const tableLayouts: ITableLayout[] = []
  let currentX = 0
  let currentY = 0

  tables.forEach((table) => {
    const tableLayout: ITableLayout = {
      table,
      position: { x: currentX, y: currentY },
    }

    tableLayouts.push(tableLayout)

    if (table.shape === 'round')
      currentX += 150 // Adjust as needed for spacing between tables

    else if (table.shape === 'rectangular')
      currentX += 200 // Adjust as needed for spacing between tables

    if (currentX + 150 > availableSpace.width) {
      // Move to the next row if there's not enough horizontal space
      currentX = 0
      currentY += 150 // Adjust as needed for spacing between rows
    }
  })

  return tableLayouts
}

const availableSpace = { width: 800, height: 600 } // Ajustez selon votre espace disponible

const tableLayouts = generateTableLayouts(tables, availableSpace)

function tbStateColor(tb: ITable) {
  return computed(() => {
    let kColor = ''
    switch (tb.state) {
      case 'disabled':
        kColor = 'bg-blueGray'
        break

      case 'occupied':
        kColor = 'bg-red-600'
        break

      case 'on-order-hold':
        kColor = 'bg-blue-600'
        break

      case 'vacant':
        kColor = 'bg-green-600'
        break

      default:
        kColor = 'bg-blueGray'
        break
    }

    return kColor
  })
}
</script>

<template>
  <div class="grid grid-cols-4 mx-auto gap-4">
    <div
      v-for="tableLayout in tableLayouts"
      :key="tableLayout.table.id"
      class="relative grid h-48 w-48 place-content-center rounded-lg bg-white"
    >
      <div class="grid h-32 w-32 place-content-center rounded bg-kGrayColor/40 text-center" :class="{ 'table-round': tableLayout.table.shape === 'round', 'table-rectangular': tableLayout.table.shape === 'rectangular' }">
        {{ tableLayout.table.id }}
      </div>
      <div class="absolute bottom-0 h-1 w-48 rounded-b" :class="[tbStateColor(tableLayout.table).value ? tbStateColor(tableLayout.table).value : '']" />
    </div>
  </div>
</template>
