<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div>
    <main>
      <slot />
    </main>
  </div>
</template>
