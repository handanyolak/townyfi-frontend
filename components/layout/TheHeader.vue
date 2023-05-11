<template>
  <div class="absolute top-0 w-full">
    <div class="mx-5">
      <div class="mb-10 flex items-center justify-between py-5">
        <span
          class="flex select-none items-center bg-gradient-to-r from-towni-brown-dark-400 via-towni-brown-dark-400 to-towni-brown-dark-200 bg-clip-text text-5xl font-extrabold text-transparent"
          style="font-family: Pirata One, sans-serif"
        >
          <img class="h-7 w-7" src="@/assets/img/paper-document.svg" />
          TownyFi
        </span>
        <SearchBar
          class="w-1/3"
          @searched="setModalInfo('TheHeaderSearchModal', { address: search })"
          v-model="search"
          :is-disable="isValid"
          :rules="searchRules"
        />
        <div class="flex items-center space-x-2">
          <div v-if="hasMetamask" class="flex justify-between py-5">
            <div v-if="onValidNetwork">
              <div v-if="isConnected" class="space-x-1">
                <TownyButton
                  v-if="!isRegistered"
                  fill
                  hover-effect
                  @click="setModalInfo('RegisterModal')"
                >
                  Register
                </TownyButton>
                <TownyButton fill hover-effect @click.native="disconnectWeb3()">
                  {{ $t('disconnect_wallet') }}
                </TownyButton>
              </div>
              <TownyButton
                v-else
                border
                hover-effect
                @click.native="connectWeb3()"
              >
                Connect Wallet
              </TownyButton>
            </div>
            <TownyButton
              v-else
              target="_blank"
              border
              hover-effect
              @click.native="switchNetwork()"
            >
              Switch Network
            </TownyButton>
          </div>
          <TownyButton
            v-else
            href="https://metamask.io/download/"
            target="_blank"
            border
            hover-effect
          >
            Install Metamask
          </TownyButton>
          <Dropdown
            :select="language"
            :dropdown-items="languages"
            :icon-names="languages"
            @selected="(item) => selected(item)"
          />
          <img
            :src="themeIcon"
            class="h-5 w-5 cursor-pointer"
            @click="toggleTheme()"
          />
          <img
            :src="audioIcon"
            class="h-7 w-7 cursor-pointer"
            @click="toggleAudio()"
          />
          <img
            v-if="audio"
            :src="musicIcon"
            class="h-5 w-5 cursor-pointer"
            @click="toggleMusic()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Dropdown from '~/components/Dropdown.vue'
import SearchBar from '~/components/SearchBar.vue'
import TownyButton from '~/components/TownyButton.vue'
import { $t } from '~/composables/useLang'
import { numberToHex } from '~/utils'
import { getAddressRule } from '~/composables/useYupRules'

//--------[ Nuxt ]--------//
const { ktaChainId } = useRuntimeConfig().public

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const appOptionStore = useAppOptionsStore()
const useUserOptions = useUserOptionsStore()

const { hasMetamask } = connectionStore
const { startEthEvents } = userWalletStore
const { toggleMusic, toggleAudio, setModalInfo } = appOptionStore
const { setLanguage } = useUserOptions

const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
const { connectWeb3, disconnectWeb3 } = userWalletStore
const { isRegistered } = storeToRefs(userGameStore)
const { audio, music } = storeToRefs(appOptionStore)
const { language } = storeToRefs(useUserOptions)

//--------[ Composables ]--------//
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleTheme = useToggle(isDark)

//--------[ Data ]--------//
const search = ref('')
const isValid = ref(false)
const searchRules = getAddressRule()

//--------[ Computed ]--------//
const audioIcon = computed(() => useSvg(audio.value ? 'sound' : 'sound-mute'))
const musicIcon = computed(() => useSvg(music.value ? 'pause' : 'music'))

const themeIcon = computed(() =>
  useSvg(isDark.value ? 'dark-mode' : 'light-mode')
)

const languages = computed(() =>
  ['en', 'tr', 'de'].filter((item) => item !== language.value)
)

//--------[ Hooks ]--------//
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

//--------[ Methods ]--------//
const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(ktaChainId),
        },
      ],
    })
  } catch (error) {
    // TODO: do something
    console.log(error)
  }
}

const selected = (item: string) => {
  setLanguage(item)
}
</script>

<style scoped>
/* TODO: temporarily font */
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
