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
        <div class="flex items-center space-x-2">
          <button @click="setModalInfo('SearchModal')">
            <img
              src="~/assets/img/search.svg"
              class="h-14 w-14 cursor-pointer"
              alt="search"
            />
          </button>
          <div v-if="hasMetamask" class="flex justify-between py-5">
            <div v-if="onValidNetwork">
              <div v-if="isConnected" class="space-x-1">
                <AppButton
                  v-if="!isRegistered"
                  border-hover
                  @click="setModalInfo('RegisterModal')"
                >
                  Register
                </AppButton>
                <AppButton
                  border-hover
                  @click.native="disconnectWeb3()"
                  inline-class="group-hover:bg-towni-brown-light-100 group-hover:text-towni-brown-dark-200"
                >
                  {{ $t('disconnect_wallet') }}
                </AppButton>
              </div>
              <AppButton v-else fill-hover @click.native="connectWeb3()">
                Connect Wallet
              </AppButton>
            </div>
            <AppButton
              v-else
              target="_blank"
              border
              border-hover
              @click.native="switchOrAddNetwork()"
            >
              Switch Network
            </AppButton>
          </div>
          <AppButton
            v-else
            href="https://metamask.io/download/"
            target="_blank"
            fill-hover
          >
            Install Metamask
          </AppButton>
          <Dropdown
            :select="language"
            :dropdown-items="languages"
            :icon-names="languages"
            @selected="(item) => selected(item)"
            class="dropdown-background"
          />
          <img
            :src="themeIcon"
            class="h-14 w-14 cursor-pointer"
            @click="toggleTheme()"
          />

          <img
            :src="audioIcon"
            class="h-16 w-16 cursor-pointer"
            @click="toggleAudio()"
          />
          <client-only>
            <Vue3Lottie
              v-if="audio"
              class="cursor-pointer"
              @click="toggleMusicAndAnimation()"
              :animation-data="Harp"
              :height="55"
              :width="55"
              :scale="1.4"
              :auto-play="isAnimating"
              :pause-animation="!isAnimating"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Dropdown from '~/components/Dropdown.vue'
import AppButton from '~/components/AppButton.vue'
import { $t } from '~/composables/useLang'
import { numberToHex } from '~/utils'
import { getAddressRule } from '~/composables/useYupRules'
import { Vue3Lottie } from 'vue3-lottie'
import Harp from '~/assets/lotties/harp.json'

//--------[ Nuxt ]--------//
const { chainId, networkName, networkSymbol, chainExplorers, chainRpcs } =
  useRuntimeConfig().public

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
const isAnimating = ref(false)

//--------[ Composables ]--------//
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

//--------[ Data ]--------//
const search = ref('')
const isValid = ref(false)
const searchRules = getAddressRule()
const toggleTheme = useToggle(isDark)

//--------[ Computed ]--------//
const audioIcon = computed(() => useSvg(audio.value ? 'sound' : 'sound-mute'))

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
const switchOrAddNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(chainId),
        },
      ],
    })
  } catch (error) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: numberToHex(chainId),
          chainName: networkName,
          nativeCurrency: {
            name: networkSymbol,
            symbol: networkSymbol,
            decimals: 18,
          },
          rpcUrls: Array.from(chainRpcs),
          blockExplorerUrls: Array.from(chainExplorers),
        },
      ],
    })
  }
}

const selected = (item: string) => {
  setLanguage(item)
}

const toggleMusicAndAnimation = () => {
  toggleMusic()
  isAnimating.value = !isAnimating.value
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
