<script setup lang="ts">
const screen = useAwesomeScreen()

const search = ref<string>('')
const showBasketDialog = ref(false)
const displaySidebar = computed(() => screen.screenSize.width >= 700)

provide('searchRef', search)
provide('showBasketDialogRef', showBasketDialog)
</script>

<template>
  <main>
    <!-- NavBar -->
    <NavigationBar />

    <!-- Sidebar -->
    <div class="grid grid-cols-12 h-[90vh]">
      <Sidebar v-show="displaySidebar" />

      <div class="px-4" :class="displaySidebar ? 'col-span-11' : 'col-span-12'">
        <!-- Main section -->
        <slot />
      </div>
    </div>
  </main>
</template>
