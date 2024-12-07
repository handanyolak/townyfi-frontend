<template>
  <div
    class="absolute top-0 z-100 w-full bg-white shadow-md shadow-towny-brown-light-100 dark:bg-[#0D1117] dark:shadow-[#171e28]"
  >
    <div class="mx-1 flex items-center justify-between md:mx-5">
      <img
        class="w-36 select-none md:w-52"
        src="@/assets/img/townyfi-logo.svg"
        alt="townyfi-logo"
      />
      <div class="flex items-center justify-between">
        <UserAccessManager v-if="hasMetamask" class="hidden md:block" />
        <AppButton
          v-else
          class="absolute left-1/2 top-32 w-5/6 -translate-x-1/2 text-center text-2xl font-bold md:w-3/6 lg:w-2/6"
          :href="'https://metamask.io/download/'"
          target="_blank"
          border-hover
        >
          Install Metamask
        </AppButton>
        <button class="step-5" @click="setModalInfo('SearchModal')">
          <img
            src="~/assets/img/search.svg"
            class="h-10 w-10 cursor-pointer"
            alt="search"
          />
        </button>
        <button class="hidden cursor-pointer md:block">
          <Icon
            name="ic:round-settings"
            class="h-11 w-11 text-towny-brown-dark-300"
            @click="toggleMenu"
          />
        </button>
        <button class="block cursor-pointer md:hidden">
          <Icon
            name="ic:sharp-menu"
            class="h-11 w-11 text-towny-brown-dark-300"
            @click="toggleMenu"
          />
        </button>
        <Menu
          v-model="menuOpen"
          :menu-open="menuOpen"
          :has-metamask="hasMetamask"
          @close="menuOpen = false"
        />
      </div>
    </div>
    <AppTour :steps="STEPS" />
  </div>
</template>

<script setup lang="ts">
import Menu from '~/components/Menu.vue'
import UserAccessManager from '~/components/UserAccessManager.vue'
import AppButton from '~/components/common/AppButton.vue'
import AppTour from '~/components/AppTour.vue'
import { getAddressRule } from '~/composables/useYupRules'
import { STEPS } from '~/constants'

// --------[ Store ]-------- //
const connectionStore = useConnectionStore()
const { hasMetamask } = connectionStore

const userWalletStore = useUserWalletStore()
const { startEthEvents } = userWalletStore

const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore

useTour()

// --------[ Data ]-------- //
const search = ref('')
const isValid = ref(false)
const searchRules = getAddressRule()
const menuOpen = ref(false)

// --------[ Hook ]-------- //
watch(search, async (newSearch) => {
  isValid.value = await searchRules.townyIsRegistered().isValid(newSearch, {
    abortEarly: true,
  })
})

onMounted(() => {
  if (hasMetamask) {
    startEthEvents()
  }
})

// --------[ Method ]-------- //
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>
