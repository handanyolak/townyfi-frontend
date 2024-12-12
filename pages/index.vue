<template>
  <div
    class="background-bingo relative flex min-h-screen flex-col items-center justify-center bg-[#FFF0D9]"
  >
    <div
      v-if="isPlayerRegistered || !isGameFinishedInUi"
      class="justify-cent flex flex-col items-center"
    >
      <button
        v-if="!isPlayerRegistered && !isGameFinished"
        class="mb-8 rounded bg-blue-500 px-6 py-3 text-lg text-white hover:bg-blue-600 md:text-xl"
        @click="buyBingoCard()"
      >
        Buy the card (<span>{{ bingoCardPriceFormatted }}</span> ETH )
      </button>
      <div>
        <appkit-button />
      </div>

      <div v-if="!gameStarted" class="mb-4"></div>

      <div
        v-if="
          (!isPlayerRegistered && drawnNumbers.length <= 0) ||
          isPlayerRegistered
        "
        class="w-fit rounded-md p-4"
        :style="`background-color: ${calculateCardColor[0]}`"
      >
        <div class="rounded-md bg-white p-2">
          <div class="grid grid-cols-9 border border-gray-400">
            <div
              v-for="(cell, index) in cells"
              :key="index"
              class="relative flex h-8 w-8 items-center justify-center border border-gray-400 md:h-16 md:w-16"
              :class="{
                'bg-white font-bold ': cell !== null,
              }"
              :style="{
                color: cell !== null ? calculateCardColor[0] : '',
                'background-color': cell === null ? calculateCardColor[0] : '',
              }"
            >
              {{ cell !== null ? cell : '' }}
              <span
                v-if="cell !== null && highlightedNumbers.has(cell)"
                class="absolute h-8 w-8 rounded-full opacity-40 transition-all duration-500 ease-in-out md:h-16 md:w-16"
                :style="`background-color: ${calculateCardColor[0]}`"
              ></span>
            </div>
          </div>
        </div>
      </div>

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

      <div>
        <button
          v-if="accountInfo.isConnected && !hasStarterPackClaimed"
          class="bg-blue-500"
          @click="claimNativeToken()"
        >
          Claim some native token
        </button>
      </div>
    </div>

    <div v-if="isGameFinishedInUi">
      <div class="mt-4 flex flex-col items-center justify-center">
        <h2
          class="my-4 text-center text-2xl font-semibold text-shadow md:text-4xl"
          :style="`color: ${calculateCardColor[0]}`"
        >
          Winners
        </h2>
        <ul v-for="winner in winners" :key="winner" class="space-y-4 py-5">
          <li class="text-center">
            {{ winner }}
          </li>
        </ul>
        rewardPerWinner {{ rewardPerWinnerFormatted }}
      </div>
    </div>
    <div class="absolute top-0 md:right-0">
      <ul
        v-if="currentDrawnNumbers.length > 0"
        class="grid grid-cols-10 grid-rows-9 justify-center gap-1 rounded-lg bg-white p-2 shadow-xl"
      >
        <li
          v-for="(currentDrawnNumber, index) in currentDrawnNumbers"
          :key="index"
          class="relative flex h-6 w-6 items-center justify-center text-center text-xl md:h-12 md:w-12"
        >
          {{ currentDrawnNumber }}
          <span
            class="absolute left-0 top-0 h-6 w-6 rounded-full opacity-40 transition-all duration-500 ease-in-out md:h-12 md:w-12"
            :style="`background-color: ${calculateCardColor[0]}`"
          ></span>
        </li>
      </ul>
      <p
        v-if="remainingDrawnNumbersCount && !isGameFinishedInUi"
        class="my-4 text-center text-xl"
      >
        Remaining drawn Numbers count: {{ remainingDrawnNumbersCount }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit, useAppKitAccount } from '@reown/appkit/vue'
import { POSITION, useToast } from 'vue-toastification'
import {
  keccak256,
  parseEther,
  toBytes,
  verifyMessage,
  zeroAddress,
  type Address,
} from 'viem'
import { useStorage } from '@vueuse/core'
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia]

const {
  public: { reownAppkitProjectId, defenderRelayerWebhookUrl },
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
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'http://localhost:3000', // origin must match your domain & subdomain
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

const contractStore = useContractStore()
const { getBingoContractCaller } = storeToRefs(contractStore)
const playerStore = usePlayerStore()
const bingoStore = useBingoStore()
const { isPlayerRegistered, playerNumbers, isUserWinner } =
  storeToRefs(playerStore)
const {
  drawnNumbers,
  bingoCardPrice,
  bingoCardPriceFormatted,
  winners,
  drawnNumbersWithTimestamp,
  isGameFinished,
  drawnNumbersLastIndex,
  rewardPerWinnerFormatted,
} = storeToRefs(bingoStore)
const accountInfo = useAppKitAccount()
const userWalletStore = useUserWalletStore()
const { walletClient } = storeToRefs(userWalletStore)
const eventStore = useEventStore()
const appOptionsStore = useAppOptionsStore()
const { initializeApp } = appOptionsStore

const cardNumbers = ref<number[]>([])
const unixTimestamp = ref(0)
const toast = useToast()
const hasStarterPackClaimed = useStorage('has-starter-pack-claimed', false)
const currentDrawnNumbers = ref<number[]>([])

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

  await initializeApp()

  if (isPlayerRegistered.value) {
    cardNumbers.value = playerNumbers.value.map((num) => Number(num))
  } else {
    cardNumbers.value = generateRandomNumbers(15, 1, 90)
  }

  unixTimestamp.value = await useUnixTimestamp()

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
  () => drawnNumbers.value.length - currentDrawnNumbers.value.length,
)

const isGameFinishedInUi = computed(
  () =>
    drawnNumbersWithTimestamp.value.length > 0 &&
    unixTimestamp.value >=
      drawnNumbersWithTimestamp.value[
        drawnNumbersWithTimestamp.value.length - 1
      ].timestamp,
)

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

const calculateCardColor = computed(() => {
  const hash = keccak256(
    (accountInfo.value.address as Address) ?? zeroAddress,
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
      [cardNumbers.value.map((num) => BigInt(num))],
      {
        value: bingoCardPrice.value,
      },
    ],
  })
}

const startTriggeringSequentially = async () => {
  unixTimestamp.value = await useUnixTimestamp()
  const currentWorldTime = unixTimestamp.value
  let isFirstSync = true
  for (let i = 0; i < drawnNumbersWithTimestamp.value.length; i++) {
    const isGameFinishedOnUi = BigInt(i) > drawnNumbersLastIndex.value
    if (isGameFinishedOnUi) {
      break
    }

    const isLastIndex = BigInt(i) === drawnNumbersLastIndex.value
    const currentItem = drawnNumbersWithTimestamp.value[i]
    if (currentWorldTime >= currentItem.timestamp) {
      currentDrawnNumbers.value.push(currentItem.number)

      if (
        isPlayerRegistered.value &&
        playerNumbers.value.includes(BigInt(currentItem.number))
      ) {
        highlightedNumbers.value.add(currentItem.number)
      }

      if (isLastIndex && isPlayerRegistered.value) {
        if (isUserWinner.value) {
          toast.success('Bingo! Congratulations!')
        } else {
          toast.error('Good luck on next!')
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
      if (delay > 3 * 1000) {
        toast.info(`Next number will be drawn in ${delay / 1000} seconds`, {
          pauseOnHover: false,
          position: POSITION.BOTTOM_RIGHT,
          timeout: 3 * 1000,
        })
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
      playerNumbers.value.includes(BigInt(currentItem.number))
    ) {
      highlightedNumbers.value.add(currentItem.number)
    }

    if (isLastIndex && isPlayerRegistered.value) {
      if (isUserWinner.value) {
        toast.success('Bingo! Congratulations!')
      } else {
        toast.error('someone won, good luck on next')
      }
    }
  }
  unixTimestamp.value = await useUnixTimestamp()
}

const claimNativeToken = async () => {
  const message = 'Bingo!'
  const messageHash = keccak256(toBytes(message))
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
    toast.error('Invalid signature')
    return
  }

  const response = await fetch(defenderRelayerWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      signature,
      amount: parseEther('0.1'),
    }),
  })

  const resData = await response.json()
  const result = JSON.parse(resData.result)
  if (!result.success) {
    if (result?.message.toLowerCase().includes('already')) {
      hasStarterPackClaimed.value = true
    }

    toast.error(`Failed to claim: ${result?.message}`)
    return
  }

  toast.success(
    `Starter Pack claimed successfully!\n${formatEventArgs(result)}`,
  )
  hasStarterPackClaimed.value = true
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
</style>
