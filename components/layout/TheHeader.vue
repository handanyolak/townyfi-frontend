<template>
  <div class="container">
    <div class="flex justify-between py-5">
      <span
        class="flex select-none items-center bg-gradient-to-r from-towni-brown-dark-400 via-towni-brown-dark-400 to-towni-brown-dark-200 bg-clip-text text-5xl font-extrabold text-transparent"
        style="font-family: Pirata One, sans-serif"
      >
        <img class="h-7 w-7" src="@/assets/img/paper-document.svg" />
        TownyFi
      </span>
      <div class="flex items-center space-x-2">
        <div v-if="hasMetamask" class="flex justify-between py-5">
          <div v-if="onValidNetwork">
            <div v-if="isConnected" class="space-x-1">
              <TownyButton
                v-if="!isRegistered"
                fill
                hover-effect
                @click.native="toggleModal(true)"
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
        <LanguageDropdown />
        <img
          :src="themeIcon"
          class="h-5 w-5 cursor-pointer"
          @click="toggleTheme()"
        />
        <img
          :src="audioIcon"
          class="h-7 w-7 cursor-pointer"
          @click="appOptionStore.toggleAudio()"
        />
        <img
          v-if="audio"
          :src="musicIcon"
          class="h-5 w-5 cursor-pointer"
          @click="appOptionStore.toggleMusic()"
        />
      </div>
    </div>

    <InformationModal v-if="showModal" @modalClosed="toggleModal(false)">
      <Register @registerClosed="toggleModal(false)" />
    </InformationModal>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import LanguageDropdown from '~/components/LanguageDropdown.vue'
import InformationModal from '~/components/InformationModal.vue'
import TownyButton from '~/components/TownyButton.vue'
import { $t } from '~/composables/useLang'

const connectionStore = useConnectionStore()
const hasMetamask = connectionStore.hasMetamask
const ethereum = connectionStore.ethereum
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const { connectWeb3, disconnectWeb3 } = userWalletStore
const appOptionStore = useAppOptionsStore()
const { audio, music } = storeToRefs(appOptionStore)
const { isRegistered } = storeToRefs(userGameStore)
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
const showModal = ref(false)

const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const { ktaChainId } = useRuntimeConfig().public

const toggleTheme = useToggle(isDark)

const audioIcon = computed(() => useSvg(audio.value ? 'sound' : 'sound-mute'))

const musicIcon = computed(() => useSvg(music.value ? 'pause' : 'music'))

const themeIcon = computed(() =>
  useSvg(isDark.value ? 'dark-mode' : 'light-mode')
)

onMounted(() => {
  if (hasMetamask) {
    /* await userWalletStore.connect() */
    userWalletStore.startEthEvents()
  }
})

const switchNetwork = async () => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x' + ktaChainId.toString(16),
        },
      ],
    })
  } catch (error) {
    console.log(error)
  }
}

const toggleModal = (modalValue: boolean) => (showModal.value = modalValue)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
