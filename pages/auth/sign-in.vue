<script setup lang="ts">
import type { IError } from '~/utils/interfaces'
import { appName } from '~/constants'
import type { TSignInSchema } from '~/utils/schema'
import { signInSchema } from '~/utils/schema'

useHead({
  title: `Connexion | ${appName}`,
})

definePageMeta({
  layout: 'auth',
})

const categoryStore = useCategoryStore()
const customerStore = useCustomerStore()
const productStore = useProductStore()
const showError = useErrorDisplayer()
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const isLoading = ref(false)
const formData = reactive<TSignInSchema>({
  email: '',
  password: '',
})

watchEffect(() => {
  if (user.value)
    navigateTo('/')
})

async function submitHandler() {
  if (isLoading.value)
    return

  try {
    isLoading.value = true
    // validate basket first
    signInSchema.parse(formData)

    const response = await auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (response.error !== null)
      throw response.error

    await categoryStore.fetchCategories()
    await customerStore.fetchCustomers()
    await productStore.fetchProducts()
  }
  catch (error) {
    showError(error as IError)
  }
  finally { isLoading.value = false }
}
</script>

<template>
  <div class="grid h-[80vh] place-content-center p-2">
    <div class="w-xs rounded px-4 py-6 shadow sm:w-sm">
      <h1 class="mb-6 text-center text-lg">
        Connexion
      </h1>

      <div class="flex flex-col gap-y-4 p-4">
        <el-input
          v-model="formData.email"
          name="email" label="Email" placeholder="Email"
          type="email"
        />
        <el-input
          v-model="formData.password"
          name="password" label="Mot de passe" placeholder="Mot de passe"
          type="password" show-password
        />
      </div>

      <p class="mb-6 mt-2 hidden text-right text-xs sm:block">
        Vous n'avez pas de compte ? <NuxtLink
          :to="{ name: 'auth-sign-up' }"
          class="underline underline-dotted hover:text-indigo-600"
        >
          Créer ici
        </NuxtLink>
      </p>

      <button w-full btn @click="submitHandler">
        <div class="flex flex-row items-center justify-center">
          <div v-if="isLoading" class="i-carbon-settings animate-spin" />
          <span>Se connecter</span>
        </div>
      </button>

      <p class="mb-6 mt-2 px-4 text-right text-xs sm:hidden">
        Vous n'avez pas de compte ? <NuxtLink
          :to="{ name: 'auth-sign-up' }"
          class="underline underline-dotted hover:text-indigo-600"
        >
          Créer ici
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
