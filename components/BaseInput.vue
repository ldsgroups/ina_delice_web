<script setup>
// <script setup lang="ts">
// type InputType = 'text' | 'email' | 'password'

// const { name, label, type = 'text' } = defineProps<{
//   name: string
//   label?: string
//   type?: InputType
// }>()

const { name, label, type } = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: false },
  type: { type: String, required: false, default: 'text' },
})

const attrs = useAttrs()
const modelValue = defineModel({ required: true })
</script>

<template>
  <div class="w-full">
    <label
      v-if="label" :for="name"
      class="block text-gray-700 dark:text-white"
    >
      {{ label }}
    </label>

    <input
      :id="name" v-model="modelValue" :attrs="attrs" :name="name" :type="type"
      class="input w-full border border-gray-300 rounded-md px-3 py-2 dark:border-black focus:border-indigo-500 dark:text-gray-700 focus:outline-none"
    >
  </div>
</template>
