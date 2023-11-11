<script setup lang="ts">
const { numberOfChairs = 4, tableShape = 'rectangle', tableWidth = 100, tableHeight = 100 } = defineProps<{
  numberOfChairs?: number
  tableWidth: number
  tableHeight: number
  tableShape?: 'circle' | 'rectangle'
}>()

function placeChairs(): { x: number; y: number }[] {
  const chairs: { x: number; y: number }[] = []

  for (let i = 0; i < numberOfChairs; i++) {
    if (tableShape === 'circle') {
      chairs.push({
        x: (tableWidth / 2) + Math.cos((i / numberOfChairs) * 2 * Math.PI) * (tableWidth / 3),
        y: (tableHeight / 2) + Math.sin((i / numberOfChairs) * 2 * Math.PI) * (tableHeight / 3),
      })
    }
    else if (tableShape === 'rectangle') {
      chairs.push({
        x: (i % 2) * (tableWidth / 2) + 20,
        y: Math.floor(i / 2) * (tableHeight / 2) + 10,
      })
    }
  }

  return chairs
}
</script>

<template>
  <div class="cs-table">
    <div class="table-top" :class="tableShape" />
    <div class="chairs">
      <div
        v-for="(chair, index) in placeChairs()" :key="index"
        class="chair" :style="{ left: `${chair.x}px`, top: `${chair.y}px` }"
      />
    </div>
  </div>
</template>

<style scoped>
.cs-table {
  display: inline-block;
  position: relative;
  margin: 20px;
}

.table-top {
  width: 200px;
  height: 100px;
  background-color: #f2F2F2;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.circle {
  border-radius: 50%;
}

.chairs {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chair {
  width: 10px;
  height: 40px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  transform: translateX(-50%);
  bottom: 0;
}
</style>
