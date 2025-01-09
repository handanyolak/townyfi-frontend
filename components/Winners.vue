<template>
  <div>
    <div class="flex flex-col items-center justify-center">
      <!-- TODO: x maybe we can provide this data from backend -->
      <!-- <span class="my-3 text-center md:text-xl"
            >Claim amount per winner: {{ rewardPerWinnerFormatted }}
            {{ publicClient.chain.nativeCurrency.symbol }}</span
          > -->
      <ul class="space-y-1">
        <li
          v-for="winner in winners"
          :key="winner"
          class="my-0.5 cursor-pointer text-sm text-blue-600 md:text-xl"
          @click="goToPageWithQuery(winner)"
        >
          {{ winner }}
        </li>
      </ul>

      <AppButton
        v-if="
          winners.length > 0 &&
          isUserWinner &&
          !isUserOnOtherPlayerPage &&
          !isSuccessClaimReward
        "
        title="Claim!"
        @click="claimReward()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TYPE, useToast } from 'vue-toastification'
import { type Address } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from '@wagmi/vue'
import AppButton from '~/components/common/AppButton.vue'
import { bingoAbi } from '~/abi'

const bingoStore = useBingoStore()
const { winners } = storeToRefs(bingoStore)

const playerStore = usePlayerStore()
const { isUserWinner } = storeToRefs(playerStore)

const userWalletStore = useUserWalletStore()
const { publicClientToSimulate } = userWalletStore

const toast = useToast()
const accountInfo = useAccount()
const goToPageWithQuery = useGameNavigation()

const { data: hash, writeContractAsync } = useWriteContract()
const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
const {
  public: { bingoContractAddress },
} = useRuntimeConfig()

const isSuccessClaimReward = ref(false)

defineProps<{
  isUserOnOtherPlayerPage: boolean | null
}>()

const claimReward = async () => {
  if (!accountInfo.isConnected.value) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  try {
    const { request } = await publicClientToSimulate.simulateContract({
      abi: bingoAbi,
      address: bingoContractAddress as Address,
      functionName: 'claimReward',
      args: [0n],
      account: accountInfo.address.value,
    })

    const toastId = toast('Sending transaction to claim reward...', {
      timeout: 0,
      icon: defineAsyncComponent(
        () => import(`../components/toast/Loading.vue`),
      ),
    })

    try {
      await writeContractAsync(request)

      while (!isConfirmed.value) {
        await sleep(0.1 * 1000)
      }

      useAppToast(
        TYPE.SUCCESS,
        `Transaction confirmed!\n` + `Transaction hash: ${hash.value}`,
      )

      isSuccessClaimReward.value = true
    } catch (error) {
      useAppToast(TYPE.ERROR, 'Transaction failed: Something went wrong')
    } finally {
      if (toastId !== undefined) {
        toast.dismiss(toastId)
      }
    }
  } catch (error: any) {
    const trimmedMessage = error?.message.split('Contract Call:')[0].trim()
    return useAppToast(TYPE.ERROR, trimmedMessage)
  }
}
</script>
