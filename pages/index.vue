<template>
  <div class="min-h-screen bg-[#FFF0D9]">
    <div
      class="background-bingo flex h-[90vh] flex-col items-center space-y-10 bg-[#FFF0D9] px-4"
      :class="!currentDrawnNumbers.length ? 'justify-center' : ''"
    >
      <div class="absolute top-2">
        <appkit-button />
        <div v-if="playerAddresses.length > 0">
          prizePoolAmountFormatted: {{ prizePoolAmountFormatted }}
          {{ publicClient.chain.nativeCurrency.symbol }}
        </div>
      </div>
      <div v-if="currentDrawnNumbers.length > 0" class="md:self-end">
        <ul
          class="grid grid-cols-10 grid-rows-9 justify-center gap-0.5 rounded-lg bg-white p-2 shadow-xl"
        >
          <li
            v-for="(currentDrawnNumber, index) in currentDrawnNumbers"
            :key="index"
            class="relative flex h-6 w-6 items-center justify-center text-center text-shadow md:h-8 md:w-8 md:text-lg xl:h-10 xl:w-10 xl:text-xl 2xl:h-12 2xl:w-12 2xl:text-2xl"
          >
            {{ currentDrawnNumber }}
            <span
              class="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 transition-all duration-500 ease-in-out md:h-8 md:w-8 md:text-lg xl:h-10 xl:w-10"
              :style="`background-color: ${calculateCardColor[0]}`"
            ></span>
          </li>
        </ul>
        <p v-if="!isGameFinishedInUi" class="my-4 text-center text-xl">
          Remaining drawn Numbers count: {{ remainingDrawnNumbersCount }}
        </p>
      </div>
      <div class="card space-y-10">
        <div
          v-if="isPlayerRegistered || !isGameFinishedInUi"
          class="relative flex flex-col items-center justify-center"
        >
          <button
            v-if="
              !isPlayerRegistered && !isGameFinished && !isUserOnOtherPlayerPage
            "
            class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
            @click="buyBingoCard()"
          >
            Buy the card (<span>{{ bingoCardPriceFormatted }}</span>
            {{ publicClient.chain.nativeCurrency.symbol }} )
          </button>

          <div v-if="!gameStarted" class="mb-4"></div>

          <div
            v-if="
              (!isPlayerRegistered && drawnNumbers.length <= 0) ||
              isPlayerRegistered
            "
          >
            <div
              v-if="cells.length"
              class="w-fit rounded-md p-2 md:p-4"
              :style="`background-color: ${calculateCardColor[0]}`"
            >
              <div class="rounded-md bg-white p-2">
                <div
                  class="grid grid-cols-9 border-[0.5px] border-gray-400 md:border"
                >
                  <div
                    v-for="(cell, index) in cells"
                    :key="index"
                    class="relative flex h-8 w-8 items-center justify-center border-[0.5px] border-gray-400 text-shadow md:h-10 md:w-10 md:border md:text-xl xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
                    :class="{
                      'bg-white font-bold ': cell !== null,
                    }"
                    :style="{
                      color: cell !== null ? calculateCardColor[0] : '',
                      'background-color':
                        cell === null ? calculateCardColor[0] : '',
                    }"
                  >
                    {{ cell !== null ? cell : '' }}
                    <span
                      v-if="cell !== null && highlightedNumbers.has(cell)"
                      class="absolute h-8 w-8 rounded-full opacity-40 transition-all duration-500 ease-in-out md:h-10 md:w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
                      :style="`background-color: ${calculateCardColor[0]}`"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <transition name="number-fade" appear>
            <div
              v-if="currentNumber !== null"
              class="transform-center absolute top-0 flex h-16 w-16 justify-center rounded-full bg-white text-4xl font-bold text-white md:h-24 md:w-24 md:text-6xl xl:h-40 xl:w-40 xl:text-9xl"
            >
              <div
                :style="`background-color: ${calculateCardColor[0]}`"
                class="flex h-full w-full items-center justify-center rounded-full bg-opacity-40"
              >
                {{ currentNumber }}
              </div>
            </div>
          </transition>
        </div>

        <div v-if="isGameFinishedInUi">
          <div
            class="my-4 flex flex-col items-center justify-center rounded-md p-4"
          >
            <h2 class="my-1 text-center text-2xl md:text-2xl">Winners</h2>
            <span class="text-center md:text-xl"
              >Claim amount per winner: {{ rewardPerWinnerFormatted }}
              {{ publicClient.chain.nativeCurrency.symbol }}</span
            >
            <ul v-for="winner in winners" :key="winner">
              <a
                class="my-0.5 cursor-pointer text-sm text-blue-600 underline md:text-xl"
                @click="goToPageWithQuery(winner)"
              >
                {{ winner }}
              </a>
            </ul>
            <button
              v-if="
                winners.length > 0 &&
                isUserWinner &&
                winners.includes(
                  (accountInfo.address as Address) ?? zeroAddress,
                )
              "
              class="my-2 rounded bg-[#5b75f4] p-2 text-xl text-white text-shadow hover:bg-[#6981f6]"
              @click="claimReward()"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
      <div v-if="playerAddresses.length > 0" class="flex flex-col">
        <h2 class="my-1 text-center text-2xl md:text-2xl">Players</h2>
        <a
          v-for="playerAddress in playerAddresses"
          :key="playerAddress"
          class="my-0.5 cursor-pointer text-sm text-blue-600 underline md:text-xl"
          @click="goToPageWithQuery(playerAddress)"
        >
          {{ playerAddress }}
        </a>
      </div>
    </div>
    <div
      v-if="isPlayerRegistered || !isGameFinishedInUi"
      class="flex h-full items-end justify-center"
    >
      <button
        v-if="
          accountInfo.isConnected &&
          !hasStarterPackClaimed &&
          showClaimNativeToken
        "
        class="mt-5 rounded bg-[#5b75f4] p-2 text-xl text-white text-shadow hover:bg-[#6981f6]"
        @click="claimNativeToken()"
      >
        Claim some native tokens
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit, useAppKitAccount } from '@reown/appkit/vue'
import { POSITION, TYPE, useToast } from 'vue-toastification'
import {
  formatUnits,
  keccak256,
  parseEther,
  toBytes,
  verifyMessage,
  zeroAddress,
  type Address,
} from 'viem'
import { useStorage } from '@vueuse/core'
import { useAppToast } from '~/composables/useAppToast'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia]

const {
  public: {
    reownAppkitProjectId,
    ozDefenderRelayerWebhookUrl,
    ozDefenderRelayerMessage,
    drawnNumbersIntervalInSec,
    appUrl,
  },
} = useRuntimeConfig()

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId: reownAppkitProjectId,
  networks,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: reownAppkitProjectId,
  metadata: {
    name: 'Bingo!',
    description: 'Bingo!',
    url: appUrl,
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  features: {
    legalCheckbox: true,
    email: false,
    socials: false,
    analytics: false,
    swaps: true,
    onramp: true,
    history: true,
    allWallets: true,
  },
})

const appOptionsStore = useAppOptionsStore()
const { initializeApp, setInitializeValues } = appOptionsStore
const contractStore = useContractStore()
const { getBingoContractCaller } = storeToRefs(contractStore)
const playerStore = usePlayerStore()
const bingoStore = useBingoStore()
const { isPlayerRegistered, playerNumbers, isUserWinner, otherPlayerAddress } =
  storeToRefs(playerStore)
const {
  drawnNumbers,
  bingoCardPrice,
  bingoCardPriceFormatted,
  winners,
  drawnNumbersWithTimestamp,
  isGameFinished,
  rewardPerWinnerFormatted,
  playerAddresses,
  maxBingoNumber,
  minBingoNumber,
  bingoCardNumbersCount,
} = storeToRefs(bingoStore)
const accountInfo = useAppKitAccount()
const userWalletStore = useUserWalletStore()
const { walletClient, publicClient } = storeToRefs(userWalletStore)
const eventStore = useEventStore()
const route = useRoute()

const cardNumbers = ref<number[]>([])
const unixTimestamp = ref(0)
const currentDrawnNumbers = ref<number[]>([])
const showClaimNativeToken = ref(true)

// --------[ Lifecycle ]-------- //
onMounted(async () => {
  const connectedConnector = localStorage.getItem('@appkit/connected_connector')
  if (connectedConnector) {
    try {
      await wagmiAdapter.reconnect({
        id: connectedConnector,
        type: undefined as unknown as string,
        // type: 'injected',
      })
    } catch (error) {
      console.error('Error reconnecting', error)
    }
  }

  if (Array.isArray(route.query.playerAddress)) {
    route.query.playerAddress = route.query.playerAddress[0] as Address
  }

  await initializeApp(route.query.playerAddress)

  if (isPlayerRegistered.value) {
    cardNumbers.value = playerNumbers.value.map((num) => Number(num))
  } else {
    cardNumbers.value = generateRandomNumbers(
      bingoCardNumbersCount.value,
      minBingoNumber.value,
      maxBingoNumber.value,
    )
  }

  if (drawnNumbersWithTimestamp.value.length > 0) {
    await startTriggeringSequentially()
  } else {
    unixTimestamp.value = await useUnixTimestamp()
  }
})

// --------[ Data ]-------- //
const highlightedNumbers = ref<Set<number>>(new Set())
const gameStarted = ref(false)
const currentNumber = ref<number | null>(null)

const remainingDrawnNumbersCount = computed(
  () => maxBingoNumber.value - currentDrawnNumbers.value.length,
)

const isGameFinishedInUi = computed(
  () =>
    drawnNumbersWithTimestamp.value.length > 0 &&
    unixTimestamp.value >=
      drawnNumbersWithTimestamp.value[
        drawnNumbersWithTimestamp.value.length - 1
      ].timestamp,
)

const hasStarterPackClaimed = computed(
  () =>
    useStorage(`${accountInfo.value.address}:starter-pack-claimed`, false)
      .value,
)

const isUserOnOtherPlayerPage = computed(
  () =>
    otherPlayerAddress.value &&
    otherPlayerAddress.value !== accountInfo.value.address?.toLowerCase(),
)

const prizePoolAmountFormatted = computed(() => {
  return formatUnits(
    BigInt(playerAddresses.value.length) * bingoCardPrice.value,
    userWalletStore.chain.nativeCurrency.decimals,
  )
})

const stop = watch(
  () => eventStore.gameFinishedEvent,
  async (newValue) => {
    if (newValue) {
      await startTriggeringSequentially()

      stop()
      eventStore.clearGameFinishedEvent()
    }
  },
)

watch(
  () => accountInfo.value.isConnected,
  async (newValue) => {
    if (newValue) {
      await setInitializeValues()
    }
  },
)

const calculateCardColor = computed(() => {
  const hash = keccak256(
    (otherPlayerAddress.value ||
      accountInfo.value.address ||
      zeroAddress) as Address,
  ).slice(2)
  const firstThirtyHexChars = hash.slice(0, 30)
  const colors = []

  for (let i = 0; i < 10; i++) {
    const segment = firstThirtyHexChars.slice(i * 3, i * 3 + 3)
    const r = parseInt(segment[0], 16) * 10 + 50
    const g = parseInt(segment[1], 16) * 10 + 50
    const b = parseInt(segment[2], 16) * 10 + 50
    colors.push(`rgb(${r}, ${g}, ${b})`)
  }

  return colors
})

// --------[ Method ]-------- //
const buyBingoCard = async () => {
  await getBingoContractCaller.value.callFunction({
    name: 'buyBingoCard',
    type: 'write',
    args: [
      [cardNumbers.value],
      {
        value: bingoCardPrice.value,
      },
    ],
  })
}

const goToPageWithQuery = (address: Address) => {
  if (address === accountInfo.value.address) {
    return (window.location.href = '/bingo')
  }
  window.location.href = `?playerAddress=${address}`
}

const startTriggeringSequentially = async () => {
  unixTimestamp.value = await useUnixTimestamp()
  const currentWorldTime = unixTimestamp.value
  let isFirstSync = true
  for (let i = 0; i < drawnNumbersWithTimestamp.value.length; i++) {
    const isLastIndex = i === drawnNumbersWithTimestamp.value.length - 1
    const currentItem = drawnNumbersWithTimestamp.value[i]
    if (currentWorldTime >= currentItem.timestamp) {
      currentDrawnNumbers.value.push(currentItem.number)

      if (
        isPlayerRegistered.value &&
        playerNumbers.value.includes(currentItem.number)
      ) {
        highlightedNumbers.value.add(currentItem.number)
      }

      if (isLastIndex && isPlayerRegistered.value) {
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
          : 3) * 1000

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
    currentDrawnNumbers.value.push(currentItem.number)

    setTimeout(() => {
      currentNumber.value = null
    }, 1500)

    if (
      isPlayerRegistered.value &&
      playerNumbers.value.includes(currentItem.number)
    ) {
      highlightedNumbers.value.add(currentItem.number)
    }

    if (isLastIndex && isPlayerRegistered.value) {
      if (isUserWinner.value) {
        useAppToast(TYPE.SUCCESS, 'Bingo!')
      } else {
        useAppToast(TYPE.ERROR, 'Good luck next time')
      }
    }
  }
  unixTimestamp.value = await useUnixTimestamp()
}

const claimNativeToken = async () => {
  const icon = defineAsyncComponent(
    () => import(`../components/toast/Loading.vue`),
  )

  const toast = useToast()
  const toastId = toast(`Claiming native token...`, {
    timeout: 0,
    icon,
  })
  try {
    const messageHash = keccak256(toBytes(ozDefenderRelayerMessage))
    const address = accountInfo.value.address as Address
    const signature = await walletClient.value.signMessage({
      message: {
        raw: messageHash,
      },
      account: address,
    })

    const valid = await verifyMessage({
      address,
      message: {
        raw: messageHash,
      },
      signature,
    })

    if (!valid) {
      throw new Error('Invalid signature')
    }

    const response = await fetch(ozDefenderRelayerWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
        amount: bingoCardPrice.value + parseEther('0.25'),
      }),
    })

    const resData = await response.json()
    const result = JSON.parse(resData.result)
    if (!result.success) {
      if (result?.message.toLowerCase().includes('already')) {
        localStorage.setItem(
          `${accountInfo.value.address}:starter-pack-claimed`,
          'true',
        )

        showClaimNativeToken.value = false
      }

      throw new Error(`Failed to claim: ${result.message}`)
    }

    useAppToast(
      TYPE.SUCCESS,
      `Claimed successfully\n${formatEventArgs(result)}`,
    )
    localStorage.setItem(
      `${accountInfo.value.address}:starter-pack-claimed`,
      'true',
    )
    showClaimNativeToken.value = false
  } catch (error: any) {
    useAppToast(TYPE.ERROR, error.message)
  } finally {
    toast.dismiss(toastId)
  }
}

const claimReward = async () => {
  await getBingoContractCaller.value.callFunction({
    name: 'claimReward',
    type: 'write',
  })
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

const formatCells = (cardNumbers: number[]): (number | null)[] => {
  const result: (number | null)[] = []
  let notNullCount = 2
  let isBeforeCellNotNull = false
  cardNumbers.forEach((num, index) => {
    result.push(num)
    if (!isBeforeCellNotNull && notNullCount && Math.random() >= 0.5) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (notNullCount === 2 && index === cardNumbers.length - 3) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (notNullCount === 1 && index === cardNumbers.length - 2) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (index !== cardNumbers.length - 1) {
      isBeforeCellNotNull = false
      result.push(null)
    }
  })
  return result
}

const cells = computed(() => formatCells(cardNumbers.value))
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

.transform-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.number-fade-enter-active,
.number-fade-leave-active {
  transition:
    transform 1s ease,
    opacity 1s ease;
}

.number-fade-enter-from {
  transform: scale(1);
  opacity: 1;
}

.number-fade-leave-to {
  transform: scale(0);
  opacity: 0;
}

.card {
  margin-top: 0;
}

@media (min-width: 1000px) {
  .card {
    margin-top: -10px !important;
  }
}

@media (min-width: 1700px) {
  .card {
    margin-top: -100px !important;
  }
}
</style>
