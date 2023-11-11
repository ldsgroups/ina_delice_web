<script setup lang="ts">
import { appName } from '~/constants'
import type { TSignUpSchema } from '~/utils/schema'
import type { IError } from '~/utils/interfaces'

useHead({
  title: `Création compte | ${appName}`,
})

definePageMeta({
  layout: 'auth',
})

const { auth } = useSupabaseClient()
const router = useRouter()

const showError = useErrorDisplayer()

const formData = reactive<TSignUpSchema>({
  fullName: '',
  phone: '',
  email: '',
  password: '',
})

async function submitHandler() {
  try {
    const response = await auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          phone: formData.phone,
          full_name: formData.fullName,
        },
      },
    })

    if (response.error)
      throw response.error.message

    ElMessage({
      message: `Cliquez sur le lien envoyer à ${formData.email} pour confirmer votre compte`,
      type: 'success',
      duration: 5000,
    })

    router.replace({ name: 'auth-sign-in', replace: true })
  }
  catch (error) {
    showError(error as IError)
  }
}

// onMounted(() => {
//   router.push({ name: 'auth-sign-in' })

//   ElMessage({
//     message: 'Veillez contacter votre responsable pour créer un nouveau compte',
//     type: 'warning',
//     duration: 7000,
//   })
// })
</script>

<template>
  <div class="grid h-[80vh] place-content-center p-2">
    <div class="rounded px-4 py-6 shadow sm:w-sm">
      <h1 class="mb-6 text-center text-lg">
        Inscription
      </h1>

      <div class="flex flex-col gap-y-4">
        <el-input
          v-model="formData.fullName"
          name="fullName" label="Nom complet" placeholder="Nom complet"
        />
        <el-input
          v-model="formData.phone"
          name="phone" label="Numéro de téléphone" placeholder="Numéro de téléphone"
        />
        <el-input
          v-model="formData.email"
          name="email" label="Email" placeholder="Email" type="email"
        />
        <el-input
          v-model="formData.password"
          name="password" label="Mot de passe" placeholder="Mot de passe" type="password"
        />
      </div>

      <p class="mb-6 mt-2 hidden text-right text-xs sm:block">
        Vous avez déjà compte ? <NuxtLink
          :to="{ name: 'auth-sign-in' }"
          class="underline underline-dotted hover:text-indigo-600"
        >
          Créer ici
        </NuxtLink>
      </p>

      <button class="w-full btn" @click="submitHandler">
        S'inscrire
      </button>

      <p class="mb-6 mt-2 text-right text-xs sm:hidden">
        Vous avez déjà compte ? <NuxtLink
          :to="{ name: 'auth-sign-in' }"
          class="underline underline-dotted hover:text-indigo-600"
        >
          Connexion ici
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
