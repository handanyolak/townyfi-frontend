<template>
  <div class="flex justify-between py-5">
    <div>
      <AppButton fill-hover @click="connectWeb3()"> Connect Wallet </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRejectedRequestError } from 'viem'
import AppButton from '~/components/common/AppButton.vue'
import { $t } from '~/composables/useLang'

// --------[ Store ]-------- //
const connectionStore = useConnectionStore()
const { onValidNetwork } = storeToRefs(connectionStore)

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
    try {
      if (!(error instanceof UserRejectedRequestError)) {
        console.log(error)
        await userWalletStore.walletClient.addChain({
          chain: walletClient.value.chain,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
