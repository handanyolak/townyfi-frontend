<template>
  <div class="bg-[#FFF0D9]">
    <div
      class="background-bingo grid min-h-screen grid-cols-1 gap-2 px-3 md:grid-cols-7 md:px-0"
    >
      <div class="absolute top-2">
        <AppButton
          v-if="!isSuccessRequestRandomNumbers"
          title="Request Random Numbers"
          @click="requestRandomNumbers()"
        />
      </div>
      <div v-if="isUserOnOtherPlayerPage" class="col-span-2">
        <AppButton
          v-if="!isSuccessRequestRandomNumbers"
          title="Back to My Game"
          icon-name="ic:round-arrow-back-ios"
          icon-position="left"
          @click="goToPageWithQuery(accountInfo.address.value as Address)"
        />
      </div>
      <div
        class="card col-span-2 grid md:col-start-3 md:col-end-6 md:grid-rows-8"
      >
        <div
          class="row-start-1 mt-2 flex flex-col items-center text-lg md:text-xl"
        >
          <!-- eslint-disable-next-line vue/no-undef-components -->
          <appkit-button />
          <PoolInfo />
        </div>
        <SubmitCard
          v-if="
            Number(drawnNumbersTimestamp + FINALIZATION_COOLDOWN) -
              useUnixTimestamp() >
              0 &&
            isDrawnNumbersFilled &&
            !isUserOnOtherPlayerPage
          "
          @update:timestamp="updateTimestamp"
        />
        <div class="row-span-6 row-start-3 flex flex-col items-center">
          <div class="flex flex-col items-center">
            <AppButton
              v-if="isGameFinishedInUi"
              title="Winners"
              @click="isWinnerOpen = true"
            />

            <div
              v-if="isPlayerExists || !isGameFinishedInUi"
              class="relative flex flex-col items-center justify-center"
            >
              <div
                v-if="
                  accountInfo.isConnected.value &&
                  !isPlayerExists &&
                  !isDrawnNumbersFilled &&
                  !isUserOnOtherPlayerPage &&
                  vrfRequestId === 0n
                "
                class="flex flex-col items-center justify-center"
              >
                <AppButton
                  :disabled="isClaimingNativeToken"
                  :title="`Buy the card (${bingoCardPriceFormatted})`"
                  :is-loading="isClaimingNativeToken"
                  @click="buyCard()"
                />
              </div>
              <Card
                v-if="
                  (!isPlayerExists && !isDrawnNumbersFilled) || isPlayerExists
                "
                :color="colors[0]"
                :card-numbers="cardNumbers"
                :highlighted-numbers="highlightedNumbers"
              />
            </div>

            <AppButton
              v-if="players.length > 0"
              title="Players"
              @click="isPlayerOpen = true"
            />

            <div
              v-if="isPlayerExists || !isGameFinishedInUi"
              class="absolute bottom-0 flex h-fit items-end justify-center"
            >
              <AppButton
                v-if="
                  accountInfo.isConnected.value &&
                  !isUserOnOtherPlayerPage &&
                  showClaimNativeToken &&
                  !hasClaimedStarterPack
                "
                title="Claim some native tokens"
                @click="claimNativeToken()"
              />
            </div>
          </div>
        </div>
      </div>
      <DrawnNumbers
        :color="colors[0]"
        :is-game-finished-in-ui="isGameFinishedInUi"
        :remaining-drawn-numbers-count="remainingDrawnNumbersCount"
        :current-number="currentNumber"
        :drawn-numbers-in-ui="drawnNumbersInUI"
      />
    </div>

    <AppModal
      :is-open="isPlayerOpen"
      :color="colors[0]"
      title="Players"
      @close="isPlayerOpen = false"
    >
      <Players />
    </AppModal>

    <AppModal
      :is-open="isWinnerOpen"
      :color="colors[0]"
      title="Winners"
      @close="isWinnerOpen = false"
    >
      <Winners
        v-if="isGameFinishedInUi"
        :is-user-on-other-player-page="isUserOnOtherPlayerPage"
      />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { POSITION, TYPE, useToast } from 'vue-toastification'
import { parseEther, zeroAddress, type Address } from 'viem'
import { useStorage } from '@vueuse/core'
import {
  useAccount,
  useSignMessage,
  useWaitForTransactionReceipt,
  useWriteContract,
} from '@wagmi/vue'
import SubmitCard from '~/components/SubmitCard.vue'
import { useAddressColor } from '@/composables/useAddressColor'
import AppButton from '~/components/common/AppButton.vue'
import AppModal from '~/components/AppModal.vue'
import { useAppToast } from '~/composables/useAppToast'
import { bingoAbi } from '~/abi'
import { prepare } from '~/utils'
import DrawnNumbers from '~/components/DrawnNumbers.vue'
import PoolInfo from '~/components/PoolInfo.vue'
import Card from '~/components/Card.vue'
import Winners from '~/components/Winners.vue'
import Players from '~/components/Players.vue'

const { data: hash, writeContractAsync } = useWriteContract()
const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
const { signMessageAsync } = useSignMessage()
const userWalletStore = useUserWalletStore()
const { publicClientToSimulate } = userWalletStore

const {
  public: {
    ozDefenderRelayerWebhookUrl,
    ozDefenderRelayerMessage,
    drawnNumbersIntervalInSec,
    bingoContractAddress,
  },
} = useRuntimeConfig()

const appOptionsStore = useAppOptionsStore()
const { initializeApp, setInitializeValues } = appOptionsStore
const playerStore = usePlayerStore()
const bingoStore = useBingoStore()
const {
  // playerAddress,
  cardNumbers: playerNumbers,
  // numberBitmap,
  isPlayerExists,
  otherPlayerAddress,
  isUserWinner,
} = storeToRefs(playerStore)
const {
  players,
  // drawnNumbers,
  winningDrawnNumberIndex,
  drawnNumbersTimestamp,
  isDrawnNumbersFilled,
  vrfRequestId,
  // requestRandomnessPayment,
  // requestRandomNumbersRefund,
  // MIN_VRF_REQUEST_RETRY_INTERVAL,
  // MIN_VRF_CALLBACK_GAS_LIMIT,
  // MAX_VRF_CALLBACK_GAS_LIMIT,
  // VRF_NUM_WORDS,
  // VRF_REQUEST_CONFIRMATIONS,
  // VRF_V2_PLUS_WRAPPER_ADDRESS,
  // BINGO_NUMBERS_COUNT,
  BINGO_MAX_NUMBER,
  BINGO_MIN_NUMBER,
  BINGO_CARD_NUMBERS_COUNT,
  // MIN_PLAYERS,
  BINGO_CARD_PRICE,
  FINALIZATION_COOLDOWN,
  drawnNumbersWithTimestamp,
  bingoCardPriceFormatted,
  // gameStartTimestamp,
} = storeToRefs(bingoStore)
const route = useRoute()

const cardNumbers = ref<number[]>([])
const unixTimestamp = ref(0)
const drawnNumbersInUI = ref<number[]>([])
const showClaimNativeToken = ref(true)
const isClaimingNativeToken = ref(false)

const isSuccessRequestRandomNumbers = ref(false)
const isPlayerOpen = ref(false)
const isWinnerOpen = ref(false)
const hasClaimedStarterPack = useStorage(
  `${bingoContractAddress}:starter-pack-claimed`,
  false,
)
const toast = useToast()
const accountInfo = useAccount()
const { colors } = useAddressColor(
  otherPlayerAddress.value || accountInfo.address.value || zeroAddress,
)

// --------[ Lifecycle ]-------- //
onMounted(async () => {
  await sleep(0.5 * 1000)

  if (Array.isArray(route.query.playerAddress)) {
    route.query.playerAddress = route.query.playerAddress[0] as Address
  }

  if (Array.isArray(route.query.id)) {
    route.query.id = route.query.id[0]
  }

  await initializeApp(route.query.playerAddress, BigInt(route.query.id ?? 0n))

  if (isPlayerExists.value) {
    cardNumbers.value = playerNumbers.value.map((num) => Number(num))
  } else {
    cardNumbers.value = generateRandomNumbers(
      BINGO_CARD_NUMBERS_COUNT.value,
      BINGO_MIN_NUMBER.value,
      BINGO_MAX_NUMBER.value,
    )
  }

  unixTimestamp.value = useUnixTimestamp()
  if (
    isDrawnNumbersFilled.value &&
    drawnNumbersWithTimestamp.value[0].timestamp <= unixTimestamp.value
  ) {
    await startTriggeringSequentially()
  }
})

// --------[ Data ]-------- //
const highlightedNumbers = ref<Set<number>>(new Set())
const currentNumber = ref<number | null>(null)

const remainingDrawnNumbersCount = computed(
  () => BINGO_MAX_NUMBER.value - drawnNumbersInUI.value.length,
)

const isGameFinishedInUi = computed(
  () =>
    drawnNumbersWithTimestamp.value.length > 0 &&
    unixTimestamp.value >=
      drawnNumbersWithTimestamp.value[winningDrawnNumberIndex.value].timestamp,
)

const isUserOnOtherPlayerPage = computed(
  () =>
    otherPlayerAddress.value &&
    otherPlayerAddress.value.toLowerCase() !==
      accountInfo.address.value?.toLowerCase(),
)

watch(
  () => accountInfo.isConnected.value,
  async (newValue: boolean) => {
    if (newValue) {
      // TODO: x solve this
      // @ts-ignore
      await setInitializeValues(route.query.playerAddress)
    }
  },
)

// --------[ Method ]-------- //
const buyCard = async () => {
  if (!accountInfo.isConnected.value) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  try {
    const { request } = await publicClientToSimulate.simulateContract({
      abi: bingoAbi,
      address: bingoContractAddress as Address,
      functionName: 'buyCard',
      // TODO: x solve any type
      args: [cardNumbers.value as any],
      value: BINGO_CARD_PRICE.value,
      account: accountInfo.address.value,
    })

    const toastId = toast('Sending transaction to buy card', {
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
    } catch (error) {
      // TODO: not error when user cancel the transaction
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

const goToPageWithQuery = useGameNavigation()

const startTriggeringSequentially = async () => {
  const currentWorldTime = unixTimestamp.value
  let isFirstSync = true
  for (let i = 0; i < drawnNumbersWithTimestamp.value.length; i++) {
    const shouldStop =
      winningDrawnNumberIndex.value !== 0 && i > winningDrawnNumberIndex.value
    if (shouldStop) {
      break
    }

    const isLastIndex =
      winningDrawnNumberIndex.value !== 0 && i === winningDrawnNumberIndex.value
    const currentItem = drawnNumbersWithTimestamp.value[i]
    if (currentWorldTime >= currentItem.timestamp) {
      drawnNumbersInUI.value.push(currentItem.number)

      if (
        isPlayerExists.value &&
        playerNumbers.value.includes(currentItem.number)
      ) {
        highlightedNumbers.value.add(currentItem.number)
      }

      if (isLastIndex && isPlayerExists.value) {
        if (isUserWinner.value) {
          useAppToast(TYPE.SUCCESS, 'Bingo!')
        } else {
          useAppToast(TYPE.ERROR, 'Good luck next time')
        }
      }

      continue
    }

    const nextItem = drawnNumbersWithTimestamp.value[i + 1]
    const delay =
      (isFirstSync
        ? currentItem.timestamp - currentWorldTime
        : nextItem
          ? nextItem.timestamp - currentItem.timestamp
          : drawnNumbersIntervalInSec) * 1000

    isFirstSync = false

    if (delay > 0) {
      if (delay > drawnNumbersIntervalInSec * 1000) {
        useAppToast(
          TYPE.INFO,
          `Next number will be drawn in ${delay / 1000} seconds`,
          {
            pauseOnHover: false,
            position: POSITION.BOTTOM_RIGHT,
            timeout: drawnNumbersIntervalInSec * 1000,
          },
        )
      }

      await sleep(delay)
    }

    currentNumber.value = currentItem.number
    drawnNumbersInUI.value.push(currentItem.number)

    setTimeout(() => {
      currentNumber.value = null
    }, 1500)

    if (
      isPlayerExists.value &&
      playerNumbers.value.includes(currentItem.number)
    ) {
      highlightedNumbers.value.add(currentItem.number)
    }

    if (isLastIndex && isPlayerExists.value) {
      if (isUserWinner.value) {
        useAppToast(TYPE.SUCCESS, 'Bingo!')
      } else {
        useAppToast(TYPE.ERROR, 'Good luck next time')
      }
    }
  }
  unixTimestamp.value = useUnixTimestamp()
}

const claimNativeToken = async () => {
  const icon = defineAsyncComponent(
    () => import(`../components/toast/Loading.vue`),
  )

  isClaimingNativeToken.value = true
  const toast = useToast()
  const toastId = toast(`Claiming native token...`, {
    timeout: 0,
    icon,
  })
  try {
    // const messageHash = keccak256(toBytes(ozDefenderRelayerMessage))
    // const address = accountInfo.value.address as Address

    // const signature = await signMessageAsync({
    //   message: {
    //     raw: messageHash,
    //   },
    //   account: address,
    // })

    const address = accountInfo.address.value as Address
    const signature = await signMessageAsync({
      message: ozDefenderRelayerMessage,
      account: address,
    })

    const response = await fetch(
      ozDefenderRelayerWebhookUrl
        .split('/')
        .map((part, i, arr) => (i === arr.length - 1 ? prepare(part) : part))
        .join('/'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          amount: BINGO_CARD_PRICE.value + parseEther('0.75'),
        }),
      },
    )

    const resData = await response.json()
    const result = JSON.parse(resData.result)
    if (!result.success) {
      if (result?.message.toLowerCase().includes('already')) {
        hasClaimedStarterPack.value = true

        showClaimNativeToken.value = false
      }

      throw new Error(`Failed to claim: ${result.message}`)
    }

    useAppToast(
      TYPE.SUCCESS,
      `Claimed successfully\n${formatEventArgs(result)}`,
    )
    hasClaimedStarterPack.value = true
    showClaimNativeToken.value = false

    setTimeout(() => {
      isClaimingNativeToken.value = false
    }, 20000)
  } catch (error: any) {
    useAppToast(TYPE.ERROR, error.message)
    isClaimingNativeToken.value = false
  } finally {
    toast.dismiss(toastId)
  }
}

// const closeClaimNativeToken = () => {
//   showClaimNativeToken.value = false
// }

const requestRandomNumbers = async () => {
  if (!accountInfo.isConnected.value) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  try {
    const { request } = await publicClientToSimulate.simulateContract({
      abi: bingoAbi,
      address: bingoContractAddress as Address,
      functionName: 'requestRandomNumbers',
      account: accountInfo.address.value,
    })

    const toastId = toast('Sending transaction to request random numbers...', {
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

      isSuccessRequestRandomNumbers.value = true
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

const generateRandomNumbers = (
  count: number,
  min: number,
  max: number,
): number[] => {
  const numbers = new Set<number>()
  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    numbers.add(randomNumber)
  }
  return Array.from(numbers)
}

const updateTimestamp = (newTimestamp: number) => {
  unixTimestamp.value = newTimestamp
}
</script>

<style scoped>
.background-bingo {
  background-image: url('~/assets/img/tree.svg'), url('~/assets/img/sock.svg');
  background-repeat: no-repeat;
  background-position:
    top left,
    bottom right;
  background-size: 50vh;
}

@media (max-width: 768px) {
  .background-bingo {
    background-size: 20vh;
    background-position:
      bottom left,
      bottom right;
  }
}
</style>
