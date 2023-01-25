<template>
  <div class="container">
    <div class="flex justify-between py-5">
      <span
        class="flex items-center bg-gradient-to-r from-towni-brown-dark-400 via-towni-brown-dark-400 to-towni-brown-dark-200 bg-clip-text text-5xl font-extrabold text-transparent"
        :class="isDark ? 'text-white' : ''"
        style="font-family: Pirata One, sans-serif"
      >
        <img class="h-7 w-7" src="@/assets/img/paper-document.svg" />
        TownyFi
      </span>
      <div class="flex items-center space-x-2">
        <div v-if="hasMetamask" class="flex justify-between py-5">
          <div v-if="onValidNetwork">
            <div v-if="isConnected">
              <TownyButton
                v-if="!isRegistered"
                fill
                @click.native="userRegister()"
              >
                Register the game
              </TownyButton>
              <TownyButton fill @click.native="disconnectWeb3()">
                {{ $t('disconnect_wallet') }}
              </TownyButton>
            </div>
            <TownyButton v-else border @click.native="connectWeb3()">
              Connect Wallet
            </TownyButton>
          </div>
          <TownyButton
            v-else
            target="_blank"
            border
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
</template>

<script setup lang="ts">
import { ethers } from 'ethers'
import { useDark, useToggle, useStorage } from '@vueuse/core'
import LanguageDropdown from '~/components/LanguageDropdown.vue'
import TownyButton from '~/components/TownyButton.vue'

const $t = useLang
const connectionStore = useConnectionStore()
const hasMetamask = connectionStore.hasMetamask
const ethereum = connectionStore.ethereum
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const kta = userWalletStore.kta
const ktaToken = userWalletStore.ktaToken
const { connectWeb3, disconnectWeb3 } = userWalletStore
const { isRegistered } = storeToRefs(userGameStore)
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
const audio = useStorage('audio', false)
const music = ref(false)
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const mainThemeAudio = ref<HTMLAudioElement | null>(null)

const toggleTheme = useToggle(isDark)
const _toggleAudio = useToggle(audio)
const _toggleMusic = useToggle(music)

const toggleAudio = () => {
  _toggleAudio()

  if (!audio.value) {
    pauseMusic()
  }
}

const toggleMusic = () => {
  _toggleMusic()

  if (music.value && audio.value) {
    playMusic()
  } else {
    pauseMusic()
  }
}

const playMusic = async () => {
  if (!mainThemeAudio.value) {
    mainThemeAudio.value = new Audio(
      // @ts-ignore
      (await import('../../assets/sound/in-dreams.mp3')).default
    )
    mainThemeAudio.value.loop = true
  }

  mainThemeAudio.value.play()
}

const pauseMusic = () => {
  music.value = false
  mainThemeAudio.value?.pause()
}

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
  // TODO: chainId env'den alinacak
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x' + Number(5).toString(16),
        },
      ],
    })
  } catch (error) {
    console.log(error)
  }
}

const userRegister = async () => {
  try {
    await (
      await ktaToken
        .connect(connectionStore.signer)
        .approve(kta.address, ethers.constants.MaxUint256)
    ).wait()

    await kta
      .connect(connectionStore.signer)
      .register(ethers.constants.HashZero, ethers.constants.AddressZero)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
