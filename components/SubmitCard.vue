<template>
  <div v-if="showCountdown" class="flex flex-col items-center justify-center">
    <!-- TODO: x start new game in ui in end hook -->
    <!-- eslint-disable-next-line vue/no-undef-components -->
    <vue-countdown
      v-slot="{ minutes, seconds, totalSeconds }"
      :time="
        (Number(drawnNumbersWithTimestamp[0].timestamp) - useUnixTimestamp()) *
        1000
      "
      @end="onCountdownEnd()"
    >
      <AppButton
        v-if="
          !isSuccessSubmitCard &&
          Number(remainingNumbersCount) === BINGO_CARD_NUMBERS_COUNT
        "
        title="Submit your card for validation"
        @click="submitCard()"
      />
      <span>
        <client-only>
          <Vue3Lottie
            :animation-data="Timer"
            :width="100"
            :height="100"
            :speed="lottieSpeed"
            :loop="false"
            @on-animation-loaded="handleAnimationLoaded(totalSeconds)"
          />
        </client-only>
      </span>
      Time Remaining:
      {{ minutes }} minutes, {{ seconds }} seconds.
    </vue-countdown>
  </div>
</template>

<script lang="ts" setup>
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from '@wagmi/vue'
import { type Address } from 'viem'
import { Vue3Lottie } from 'vue3-lottie'
import { TYPE, useToast } from 'vue-toastification'
import { bingoAbi } from '~/abi'
import Timer from '~/assets/lotties/timer.json'
import AppButton from '~/components/common/AppButton.vue'

const bingoStore = useBingoStore()
const { BINGO_CARD_NUMBERS_COUNT, drawnNumbersWithTimestamp, availableGameId } =
  storeToRefs(bingoStore)

const contractStore = useContractStore()
const { bingoContractPublic } = contractStore

const userWalletStore = useUserWalletStore()
const { publicClientToSimulate } = userWalletStore

const playerStore = usePlayerStore()
const { remainingNumbersCount } = storeToRefs(playerStore)

const toast = useToast()

const emit = defineEmits(['update:timestamp'])

const { data: hash, writeContractAsync } = useWriteContract()
const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
const {
  public: { bingoContractAddress },
} = useRuntimeConfig()

const showCountdown = ref(true)
const accountInfo = useAccount()
const lottieSpeed = ref(1)
const isSuccessSubmitCard = ref(false)

const handleAnimationLoaded = (totalSeconds: any) => {
  const totalFrames = Timer.op - Timer.ip
  const frameRate = Timer.fr || 30
  lottieSpeed.value = totalFrames / (totalSeconds * frameRate)
}

const submitCard = async () => {
  if (!accountInfo.isConnected.value) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  try {
    const { request } = await publicClientToSimulate.simulateContract({
      abi: bingoAbi,
      address: bingoContractAddress as Address,
      functionName: 'submitCard',
      account: accountInfo.address.value,
    })

    const toastId = toast('Sending transaction to submit card...', {
      timeout: 0,
      icon: defineAsyncComponent(() => import(`./toast/Loading.vue`)),
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

      isSuccessSubmitCard.value = true
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

const onCountdownEnd = async () => {
  showCountdown.value = false

  useAppToast(TYPE.INFO, 'Game is starting in seconds...')

  await sleep(5 * 1000)

  // TODO: check extra validation to sure that game id is correct
  const [winners, winnersCursor] = await bingoContractPublic.read.winners([
    availableGameId.value - 1n,
    0n,
    100n,
  ])

  bingoStore.setWinnersCursor(winnersCursor)
  bingoStore.setWinners([...winners])

  emit('update:timestamp', useUnixTimestamp())
}
</script>
