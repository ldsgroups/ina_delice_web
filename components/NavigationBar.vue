<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { appName } from '~/constants'

const router = useRouter()
const { auth } = useSupabaseClient()
const { appContext } = getCurrentInstance()!
const color = useColorMode()
const screen = useAwesomeScreen()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

const isLargeScreen = computed(() => screen.screenSize.width >= 700)

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}

const search = inject('searchRef') as Ref<string>
const showBasketDialog = inject('showBasketDialogRef') as Ref<boolean>
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
  <nav class="mb-4 flex items-center justify-between gap-x-4 border-b px-4 py-2 dark:border-kGoldenColor/25">
    <div class="w-full flex flex-row items-center gap-x-4 md:w-2/5">
      <!-- App name or logo -->
      <h1 class="w-72 truncate text-lg font-bold">
        {{ appName }}
      </h1>

      <!-- Search area -->
      <div class="hidden w-4/5 rounded px-4 py-1 md:block">
        <el-input v-model="search" :suffix-icon="Search" placeholder="Chercher un produit ..." />
      </div>
    </div>

    <!-- Mobile -->
    <div v-show="!isLargeScreen" class="flex flex-row items-center gap-x-4">
      <div class="rounded bg-kGrayColor/45 px-1.5 pt-1" @click="toggleDark">
        <button class="i-carbon-sun icon-btn text-kDarkColor dark:i-carbon-moon" />
      </div>
      <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
        <button class="i-carbon-shopping-bag icon-btn text-kDarkColor" @click="showBasketDialog = true" />
      </div>
      <div v-show="screen.screenSize.width < 300" class="rounded bg-kGrayColor/45 px-1.5 pt-1 sm:hidden">
        <button class="i-carbon-logout icon-btn text-kDarkColor" @click="logout" />
      </div>
    </div>

    <div v-show="isLargeScreen" class="flex items-center gap-x-4">
      <div class="rounded bg-kGrayColor/45 px-1.5 pt-1" @click="toggleDark">
        <button class="i-carbon-sun icon-btn text-kDarkColor dark:i-carbon-moon" />
      </div>
      <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
        <button class="i-carbon-reset icon-btn text-kDarkColor" />
      </div>
      <div class="rounded bg-kGrayColor/45 px-1.5 pt-1">
        <button class="i-carbon-wifi icon-btn text-kGreenColor" />
      </div>

      <button bg-kOrangeColor flex flex-row items-center font-semibold btn>
        <div class="i-carbon-area mr-1" />
        <div class="hidden sm:block">
          Sélectionner table
        </div>
      </button>
    </div>
  </nav>
</template>
