<script setup lang="ts">
import type { RouteLocationRaw } from '.nuxt/vue-router'

const route = useRoute()
const router = useRouter()
const { auth } = useSupabaseClient()
const { appContext } = getCurrentInstance()!

function isActiveTheme(name: string) {
  return computed(() => {
    const isActiveRoute = route.name === name

    const _default = 'border h-12 w-full flex flex-col items-center justify-center truncate rounded py-1 text-xs font-semibold cursor-pointer hover:bg-kOrangeColor/10'
    const _active = 'border-kOrangeColor text-kOrangeColor bg-kOrangeColor/10'

    return isActiveRoute ? `${_default} ${_active}` : `${_default} border-none`
  })
}

interface IPage {
  title: string
  name: string
  icon: string
}

// pages was "Home, Customers, Tables, Orders, Reports, Settings"
const pages = ref<IPage[]>([
  {
    title: 'Accueil',
    name: 'home',
    icon: 'i-carbon-home',
  },
  {
    title: 'Clients',
    name: 'customer',
    icon: 'i-carbon-user',
  },
  // {
  //   title: 'Tables',
  //   name: 'table',
  //   icon: 'i-carbon-thumbnail-preview',
  // },
  {
    title: 'Commandes',
    name: 'order',
    icon: 'i-carbon-order-details',
  },
  {
    title: 'Produits',
    name: 'product',
    icon: 'i-carbon-inventory-management',
  },
  // {
  //   title: 'Rapports',
  //   name: 'report',
  //   icon: 'i-carbon-report-data',
  // },

  // TODO: Add settings page
  // {
  //   title: 'Paramètres',
  //   name: 'setting',
  //   icon: 'i-carbon-settings-adjust',
  // },
])

function alias(name: string) {
  return computed(() => {
    const names = name.toUpperCase().split(' ')

    const isFullName = names.length > 1
    if (isFullName)
      return names[0].substring(0, 1) + names[1].substring(0, 1)
    else return names[0].substring(0, 1)
  }).value
}

async function logout() {
  try {
    await auth.signOut()

    router.push({ name: 'auth-sign-in', replace: true })
  }
  catch (error) {
    ElMessage({
      message: error as string,
      type: 'error',
    }, appContext)
  }
}
</script>

<template>
  <div class="flex flex-col justify-between">
    <ul class="flex flex-col items-center gap-y-2 px-2.5">
      <NuxtLink
        v-for="page in pages" :key="page.name" as="li" :to="{ name: page.name } as RouteLocationRaw"
        :class="isActiveTheme(page.name).value"
      >
        <div :class="page.icon" class="mb-1 text-lg" />
        <p class="hidden lg:block">
          {{ page.title }}
        </p>
      </NuxtLink>
    </ul>

    <div class="hidden flex-col items-center lg:flex">
      <div class="grid h-8 w-8 place-content-center rounded-full from-cyan-500 to-blue-500 bg-gradient-to-r text-center text-lg text-white">
        {{ alias('Bonjour') }}
      </div>

      <button
        class="my-4 flex flex-col items-center"
        @click="logout"
      >
        <div class="i-carbon-logout" />
        <span class="text-xs">Déconnexion</span>
      </button>
    </div>
  </div>
</template>
