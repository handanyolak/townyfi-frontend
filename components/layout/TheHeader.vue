<template>
  <div class="container">
    <div class="space-x-2"></div>
    <div v-if="hasMetamask" class="flex justify-between py-3">
      <span :class="isDark ? 'text-white' : ''">TownyFi</span>
      <div v-if="onValidNetwork">
        <div v-if="isConnected">
          <div class="flex items-center space-x-2">
            <TownyButton
              v-if="!isRegistered"
              fill
              @click.native="userRegister()"
            >
              Register the game
            </TownyButton>
            <TownyButton border @click.native="disconnectWeb3()">
              {{ $t('disconnect_wallet') }}
            </TownyButton>
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
      install
    </TownyButton>
  </div>
</template>

<script setup lang="ts">
import { ethers } from 'ethers'
import { useDark, useToggle } from '@vueuse/core'
import LanguageDropdown from '~/components/LanguageDropdown.vue'
import TownyButton from '~/components/TownyButton.vue'

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
