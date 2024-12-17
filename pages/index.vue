<template>
  <div class="bg-[#FFF0D9]">
    <div
      class="background-bingo grid min-h-screen grid-cols-1 gap-2 px-3 md:grid-cols-7 md:px-0"
      :class="!currentDrawnNumbers.length ? '' : ''"
    >
      <div class="absolute top-2">
        <div v-if="isAdmin">
          <button
            class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
            @click="adminRequestRandomNumbers()"
          >
            requestRandomNumbers
          </button>
          <button
            class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
            @click="adminFillDrawnNumbers()"
          >
            fillDrawnNumbers
          </button>
          <button
            class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
            @click="adminFinalizeGame()"
          >
            finalizeGame
          </button>
        </div>
      </div>
      <div v-if="isUserOnOtherPlayerPage" class="col-span-2">
        <button
          class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
          @click="goToPageWithQuery(accountInfo.address as Address)"
        >
          Back to your card
        </button>
      </div>
      <div
        class="card col-span-2 grid md:col-start-3 md:col-end-6 md:grid-rows-8"
      >
        <div class="row-start-1 flex flex-col items-center">
          <appkit-button />
          <div v-if="playerAddresses.length > 0">
            Prize Pool: {{ prizePoolAmountFormatted }}
            {{ publicClient.chain.nativeCurrency.symbol }}
          </div>
        </div>
        <div
          v-if="
            Number(drawnNumbersTimestamp + finalizationCooldown) -
              useUnixTimestamp() >
              0 &&
            !isGameFinished &&
            isDrawnNumbersFilled &&
            !isUserOnOtherPlayerPage &&
            showCountdown
          "
          class="flex flex-col items-center justify-center"
        >
          <vue-countdown
            v-slot="{ minutes, seconds }"
            :time="
              (Number(drawnNumbersTimestamp + finalizationCooldown) -
                useUnixTimestamp()) *
              1000
            "
            @end="showCountdown = false"
          >
            Time Remaining:
            {{ minutes }} minutes, {{ seconds }} seconds.
          </vue-countdown>
          <button
            v-if="
              !isSuccessCheckBingoCard &&
              Number(playerRemainingNumbersCount) === bingoCardNumbersCount
            "
            class="my-3 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
            @click="checkBingoCard()"
          >
            Check your card result
          </button>
        </div>
        <div class="row-span-6 row-start-3 flex flex-col items-center">
          <div class="flex flex-col items-center">
            <button
              v-if="isGameFinishedInUi"
              :style="`background-color: ${calculateCardColor[0]}`"
              class="my-3 rounded px-4 py-2 text-xl text-white text-shadow"
              @click="isWinnerOpen = true"
            >
              Winners
            </button>
            <div
              v-if="isPlayerRegistered || !isGameFinishedInUi"
              class="flex h-full items-end justify-center"
            >
              <button
                v-if="
                  accountInfo.isConnected &&
                  !isUserOnOtherPlayerPage &&
                  showClaimNativeToken &&
                  !hasClaimedStarterPack
                "
                class="relative my-3 rounded bg-[#5b75f4] p-2 text-xl text-white text-shadow hover:bg-[#6981f6]"
                @click="claimNativeToken()"
              >
                Claim some native tokens
                <Icon
                  name="ic:round-close"
                  class="absolute -right-6 -top-2 h-7 w-7 text-red-500"
                  @click.stop="closeClaimNativeToken()"
                />
              </button>
            </div>
            <div
              v-if="isPlayerRegistered || !isGameFinishedInUi"
              class="relative flex flex-col items-center justify-center"
            >
              <button
                v-if="
                  !isPlayerRegistered &&
                  !isGameFinished &&
                  !isUserOnOtherPlayerPage &&
                  randomNumbers.length === 0
                "
                class="mb-8 rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
                @click="buyBingoCard()"
              >
                Buy the card (<span>{{ bingoCardPriceFormatted }}</span>
                {{ publicClient.chain.nativeCurrency.symbol }} )
              </button>
              <div
                v-if="
                  (!isPlayerRegistered && drawnNumbers.length <= 0) ||
                  isPlayerRegistered
                "
              >
                <div
                  v-if="cells.length > 0"
                  class="w-fit rounded-md p-4"
                  :style="`background-color: ${calculateCardColor[0]}`"
                >
                  <div class="rounded-md bg-white p-2">
                    <div class="grid grid-cols-9 border border-gray-400">
                      <div
                        v-for="(cell, index) in cells"
                        :key="index"
                        class="relative flex h-8 w-8 items-center justify-center border border-gray-400 text-shadow md:text-xl lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
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
                          class="absolute h-8 w-8 rounded-full opacity-40 transition-all duration-500 ease-in-out lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
                          :style="`background-color: ${calculateCardColor[0]}`"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              v-if="playerAddresses.length > 0"
              :style="`background-color: ${calculateCardColor[0]}`"
              class="my-3 rounded px-4 py-2 text-xl text-white text-shadow"
              @click="isPlayerOpen = true"
            >
              Players
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="currentDrawnNumbers.length > 0"
        class="relative col-span-2 flex flex-col items-center justify-start md:col-start-6 md:items-end"
      >
        <ul
          class="grid grid-cols-9 justify-center gap-0.5 rounded-lg bg-white p-2 shadow-xl md:grid-cols-6 lg:grid-cols-9 lg:grid-rows-10"
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
        <p v-if="!isGameFinishedInUi" class="my-4 w-full text-center text-xl">
          Remaining drawn Numbers count: {{ remainingDrawnNumbersCount }}
        </p>
        <transition name="number-fade" appear>
          <div
            v-if="currentNumber !== null"
            class="transform-center absolute flex h-40 w-40 justify-center rounded-full bg-white text-9xl font-bold text-white"
          >
            <div
              :style="`background-color: ${calculateCardColor[0]}`"
              class="flex h-full w-full justify-center rounded-full bg-opacity-40"
            >
              {{ currentNumber }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <AppModal
      :is-open="isPlayerOpen"
      :color="calculateCardColor[0]"
      title="Players"
      @close="isPlayerOpen = false"
    >
      <div v-if="playerAddresses.length > 0" class="flex flex-col">
        <a
          v-for="playerAddress in playerAddresses"
          :key="playerAddress"
          class="my-0.5 cursor-pointer text-sm text-blue-600 underline md:text-xl"
          @click="goToPageWithQuery(playerAddress)"
        >
          {{ playerAddress }}
        </a>
      </div>
    </AppModal>

    <AppModal
      :is-open="isWinnerOpen"
      :color="calculateCardColor[0]"
      title="Winners"
      @close="isWinnerOpen = false"
    >
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
              !isUserOnOtherPlayerPage &&
              !isSuccessClaimReward
            "
            class="my-2 rounded bg-[#5b75f4] p-2 text-xl text-white text-shadow hover:bg-[#6981f6]"
            @click="claimReward()"
          >
            Claim!
          </button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { type AppKitNetwork } from '@reown/appkit/networks'
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
import { v4 as uuidv4 } from 'uuid'
import AppModal from '~/components/AppModal.vue'
import { useAppToast } from '~/composables/useAppToast'

const userWalletStore = useUserWalletStore()
const { walletClient, publicClient } = storeToRefs(userWalletStore)
const { chain } = userWalletStore

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [chain]

const {
  public: {
    reownAppkitProjectId,
    ozDefenderRelayerWebhookUrl,
    ozDefenderRelayerMessage,
    drawnNumbersIntervalInSec,
    appUrl,
    bingoContractAddress,
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
const {
  isPlayerRegistered,
  playerNumbers,
  isUserWinner,
  otherPlayerAddress,
  playerRemainingNumbersCount,
} = storeToRefs(playerStore)
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
  isDrawnNumbersFilled,
  drawnNumbersTimestamp,
  finalizationCooldown,
  winDrawnNumbersIndex,
  randomNumbers,
} = storeToRefs(bingoStore)
const accountInfo = useAppKitAccount()
const eventStore = useEventStore()
const route = useRoute()

const cardNumbers = ref<number[]>([])
const unixTimestamp = ref(0)
const currentDrawnNumbers = ref<number[]>([])
const showClaimNativeToken = ref(true)
const isSuccessCheckBingoCard = ref(false)
const isSuccessClaimReward = ref(false)
const isPlayerOpen = ref(false)
const isWinnerOpen = ref(false)
const showCountdown = ref(true)
const randUUID = useStorage('scmlacch', uuidv4())
const hasClaimedStarterPack = useStorage(
  `${bingoContractAddress}:starter-pack-claimed`,
  false,
)

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
    unixTimestamp.value = useUnixTimestamp()
  }
})

// --------[ Data ]-------- //
const highlightedNumbers = ref<Set<number>>(new Set())
const currentNumber = ref<number | null>(null)

const isAdmin = computed(
  () =>
    accountInfo.value.address?.toLowerCase() ===
      '0x93C4C1e86434eA4E831d8A13e64aC288C49B7b76'.toLowerCase() &&
    route.query.admin === 'r00tr00t',
)

const remainingDrawnNumbersCount = computed(
  () => maxBingoNumber.value - currentDrawnNumbers.value.length,
)

const isGameFinishedInUi = computed(
  () =>
    drawnNumbersWithTimestamp.value.length > 0 &&
    unixTimestamp.value >=
      drawnNumbersWithTimestamp.value[winDrawnNumbersIndex.value].timestamp,
)

const isUserOnOtherPlayerPage = computed(
  () =>
    otherPlayerAddress.value &&
    otherPlayerAddress.value.toLowerCase() !==
      accountInfo.value.address?.toLowerCase(),
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
  async () => {
    await setInitializeValues()
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
  if (!accountInfo.value.isConnected) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  await getBingoContractCaller.value.callFunction({
    name: 'buyBingoCard',
    type: 'write',
    args: [
      [keccak256(toBytes(randUUID.value)), cardNumbers.value],
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
  unixTimestamp.value = useUnixTimestamp()
  const currentWorldTime = unixTimestamp.value
  let isFirstSync = true
  for (let i = 0; i < drawnNumbersWithTimestamp.value.length; i++) {
    const shouldStop = i > winDrawnNumbersIndex.value
    if (shouldStop) {
      break
    }

    const isLastIndex = i === winDrawnNumbersIndex.value
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
  unixTimestamp.value = useUnixTimestamp()
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
  } catch (error: any) {
    useAppToast(TYPE.ERROR, error.message)
  } finally {
    toast.dismiss(toastId)
  }
}

const closeClaimNativeToken = () => {
  showClaimNativeToken.value = false
  hasClaimedStarterPack.value = true
}

const claimReward = async () => {
  if (!accountInfo.value.isConnected) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  const isSuccess = await getBingoContractCaller.value.callFunction({
    name: 'claimReward',
    type: 'write',
  })

  isSuccessClaimReward.value = isSuccess
}

const checkBingoCard = async () => {
  if (!accountInfo.value.isConnected) {
    return useAppToast(TYPE.ERROR, 'Connect your wallet first')
  }

  const isSuccess = await getBingoContractCaller.value.callFunction({
    name: 'checkCardResult',
    type: 'write',
  })

  isSuccessCheckBingoCard.value = isSuccess
}

const adminRequestRandomNumbers = async () => {
  await getBingoContractCaller.value.callFunction({
    name: 'requestRandomNumbers',
    type: 'write',
  })
}

const adminFillDrawnNumbers = async () => {
  await getBingoContractCaller.value.callFunction({
    name: 'fillDrawnNumbers',
    type: 'write',
  })
}

const adminFinalizeGame = async () => {
  await getBingoContractCaller.value.callFunction({
    name: 'finalizeGame',
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
  top: 30%;
  right: 20%;
  transform: translate(-20%, -20%);
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
</style>
