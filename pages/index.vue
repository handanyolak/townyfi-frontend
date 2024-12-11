<template>
  <div
    class="background-bingo relative flex min-h-screen flex-col items-center justify-center bg-[#FFF0D9]"
  >
    <div class="mb-4" @click="buyBingoCard()">
      <button
        class="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
      >
        Buy the card
      </button>
    </div>
    <div>
      <span>AppKit Button</span>
      <appkit-button />
    </div>

    <div v-if="!gameStarted" class="mb-4">
      <button
        class="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        @click="startGame"
      >
        Start Game
      </button>
    </div>

    <div class="w-fit rounded-md bg-green-700 p-4">
      <div class="rounded-md bg-white p-2">
        <div class="grid grid-cols-9 border border-gray-400">
          <div
            v-for="(cell, index) in cells"
            :key="index"
            class="relative flex h-16 w-16 items-center justify-center border border-gray-400"
            :class="{
              'bg-white font-bold text-green-700': cell !== null,
              'bg-green-700': cell === null,
            }"
          >
            {{ cell !== null ? cell : '' }}
            <span
              v-if="cell !== null && highlightedNumbers.has(cell)"
              class="absolute h-16 w-16 rounded-full bg-green-700 opacity-40"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <transition name="number-fade" appear>
      <div
        v-if="currentNumber !== null"
        class="transform-center absolute flex h-40 w-40 justify-center rounded-full bg-white text-9xl font-bold text-green-700"
      >
        <div
          class="flex h-full w-full justify-center rounded-full bg-green-700 bg-opacity-40"
        >
          {{ currentNumber }}
        </div>
      </div>
    </transition>

    <transition name="congratulations" appear>
      <div
        v-if="gameWon"
        class="absolute flex h-64 w-64 items-center justify-center rounded-full bg-yellow-500 text-center text-4xl font-bold text-white"
      >
        🎉 Tebrikler! Bingo! 🎉
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo,
  useAppKitProvider,
} from '@reown/appkit/vue'
import {
  createWalletClient,
  custom,
  getContract,
  hashMessage,
  keccak256,
  publicActions,
  recoverAddress,
  toBytes,
  toHex,
  verifyMessage,
  type Address,
} from 'viem'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia]
const projectId = 'f85db361b46b66558ac9fb7ebd0eea91' // https://cloud.reown.com,

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
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

const accountInfo = useAppKitAccount()
const { getBingoContract, getBingoContractCaller } =
  storeToRefs(useContractStore())

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

  console.log(
    'getBingoContract.value.read.owner()',
    await getBingoContract.value.read.owner(),
  )
})

// --------[ Data ]-------- //
const highlightedNumbers = ref<Set<number>>(new Set())
const gameStarted = ref(false)
const currentNumber = ref<number | null>(null)
const gameWon = ref(false)

// --------[ Method ]-------- //
const buyBingoCard = async () => {
  await getBingoContractCaller.value.callFunction({
    function: 'buyBingoCard',
    type: 'write',
    args: [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n],
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

const cardNumbers: number[] = generateRandomNumbers(14, 1, 90)

const generateShuffledNumbers = (min: number, max: number): number[] => {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  return numbers
}

const numbers: number[] = generateShuffledNumbers(1, 90)

const formatCells = (cardNumbers: number[]): (number | null)[] => {
  const result: (number | null)[] = []
  cardNumbers.forEach((num, index) => {
    result.push(num)
    if (index !== cardNumbers.length - 1) {
      result.push(null)
    }
  })
  return result
}

const cells = formatCells(cardNumbers)

const startGame = () => {
  gameStarted.value = true
  let index = 0

  const interval = setInterval(() => {
    if (index < numbers.length) {
      const number = numbers[index]

      currentNumber.value = number
      setTimeout(() => {
        currentNumber.value = null
      }, 1500)

      if (cardNumbers.includes(number)) {
        highlightedNumbers.value.add(number)
      }

      if (cardNumbers.every((num) => highlightedNumbers.value.has(num))) {
        gameWon.value = true
        clearInterval(interval)
        console.log('Oyun kazandı!')
      }

      index++
    } else {
      clearInterval(interval)
    }
  }, 2000)
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

.congratulations-enter-active,
.congratulations-leave-active {
  transition:
    transform 1.5s ease,
    opacity 1.5s ease;
}

.congratulations-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.congratulations-leave-to {
  transform: scale(2);
  opacity: 0;
}
</style>
