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
                @click.native="openModal()"
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

    <InformationModal v-if="showModal" @modalClosed="closeModal()">
      <div class="flex flex-col items-center space-y-4 p-12">
        <ListTitle class="w-full">Register</ListTitle>

        <ListItem class="w-full" input>
          <template #title> Name: </template>
          <template #item>
            <input v-model="register.name" type="text" />
          </template>
          <span>{{ register.name }}</span>
        </ListItem>
        <ListItem class="w-full" input>
          <template #title> Referrer: </template>
          <template #item>
            <input v-model="register.referrer" type="text" />
          </template>
          <span>{{ register.referrer }}</span>
        </ListItem>
        <TownyButton class="my-3" @click="userRegister()">Register</TownyButton>
      </div>
    </InformationModal>
  </div>
</template>

<script setup lang="ts">
import { ethers } from 'ethers'
import { useDark, useToggle, useStorage } from '@vueuse/core'
import LanguageDropdown from '~/components/LanguageDropdown.vue'
import InformationModal from '~/components/InformationModal.vue'
import TownyButton from '~/components/TownyButton.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import { $t } from '~/composables/useLang'

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
const showModal = ref(false)
const audio = useStorage('audio', false)
const music = ref(false)
const register = reactive({
  name: '',
  referrer: '',
})
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const mainThemeAudio = ref<HTMLAudioElement | null>(null)
const { ktaChainId } = useRuntimeConfig().public

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

const userRegister = async () => {
  await (
    await ktaToken.approve(kta.address, ethers.constants.MaxUint256)
  ).wait()

  await kta.register(
    // TODO: kullanicidan input alinmali
    ethers.utils.formatBytes32String(register.name),
    // TODO: kullanicidan referrer bilgisi alinmali bossa AddressZero
    register.referrer === '' ? ethers.constants.AddressZero : register.referrer
  )
}

const openModal = () => (showModal.value = true)

const closeModal = () => (showModal.value = false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
