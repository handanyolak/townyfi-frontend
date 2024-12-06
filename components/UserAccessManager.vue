<template>
  <div class="flex justify-between py-5">
    <div v-if="onValidNetwork">
      <div v-if="isConnected" class="flex flex-col gap-3 md:flex-row">
        <AppButton
          v-if="!isRegistered"
          border-hover
          @click="setModalInfo('RegisterModal')"
        >
          Register
        </AppButton>
        <AppButton class="step-4" border-hover @click="disconnectWeb3()">
          {{ $t('disconnect_wallet') }}
        </AppButton>
      </div>
      <AppButton v-else fill-hover @click="connectWeb3()">
        Connect Wallet
      </AppButton>
    </div>
    <AppButton
      v-else
      target="_blank"
      border
      border-hover
      @click="switchOrAddNetwork()"
    >
      Switch Network
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from '~/components/common/AppButton.vue'
import { $t } from '~/composables/useLang'

// --------[ Store ]-------- //
const connectionStore = useConnectionStore()
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)

const userWalletStore = useUserWalletStore()
const { connectWeb3, disconnectWeb3 } = userWalletStore
const { walletClient } = storeToRefs(userWalletStore)

const userGameStore = useUserGameStore()
const { isRegistered } = storeToRefs(userGameStore)

const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore

// --------[ Method ]-------- //
const switchOrAddNetwork = async () => {
  try {
    await walletClient.value.switchChain({
      id: walletClient.value.chain.id,
    })
  } catch (error) {
    await walletClient.value.addChain({
      chain: walletClient.value.chain,
    })
  }
}
</script>
