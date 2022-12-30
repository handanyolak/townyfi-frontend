<template>
  <div class="container">
    <div class="space-x-2"></div>
    <div v-if="hasMetamask" class="flex justify-between py-3">
      <span :class="isDark ? 'text-white' : ''">TownyFi</span>
      <div v-if="onValidNetwork">
        <div v-if="isConnected">
          <div class="flex items-center space-x-2">
            <button
              v-if="!isRegistered"
              class="rounded-sm bg-brown p-1 text-white"
              @click="userRegister()"
            >
              Register the game
            </button>
            <button
              class="rounded-sm bg-brown p-1 text-white"
              @click="disconnectWeb3()"
            >
              {{ $t('disconnect_wallet') }}
            </button>
            <LanguageDropdown />
            <div>
              <img
                v-if="isDark"
                src="@/assets/img/dark-mode.svg"
                class="h-5 w-5 cursor-pointer"
                @click="toggleDark()"
              />
              <img
                v-else
                src="@/assets/img/light-mode.svg"
                class="h-5 w-5 cursor-pointer"
                @click="toggleDark()"
              />
            </div>
          </div>
        </div>
        <button
          v-else
          class="rounded-sm bg-brown-dark p-1 text-white"
          @click="connectWeb3()"
        >
          Connect Wallet
        </button>
      </div>
      <a
        v-else
        target="_blank"
        class="rounded-sm bg-brown p-1 text-white"
        @click="switchNetwork()"
      >
        Switch Network
      </a>
    </div>
    <a
      v-else
      href="https://metamask.io/download/"
      target="_blank"
      class="rounded-sm bg-brown p-1 text-white"
    >
      install
    </a>
  </div>
</template>

<script setup lang="ts">
import { ethers } from 'ethers'
import { useDark, useToggle } from '@vueuse/core'
import LanguageDropdown from '~/components/LanguageDropdown.vue'

// Constants
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

// Hooks
onMounted(() => {
  if (hasMetamask) {
    /* const accounts = await userWalletStore.provider */
    /* await userWalletStore.connect() */
    userWalletStore.startEthEvents()
  }
})

// Methods
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

const isDark = useDark()

const toggleDark = useToggle(isDark)
</script>
