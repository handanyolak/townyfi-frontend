import { zeroAddress, type Address } from 'viem'

export const usePlayerStore = defineStore('playerStore', () => {
  const bingoStore = useBingoStore()

  const playerAddress = ref<Address>(zeroAddress)
  const playerNumbers = ref<readonly bigint[]>([])
  const playerRemainingNumbersCount = ref(0n)

  const setPlayerAddress = (newValue: Address) => {
    playerAddress.value = newValue
  }

  const setPlayerNumbers = (newValue: readonly bigint[]) => {
    playerNumbers.value = newValue
  }

  const setRemainingNumbersCount = (newValue: bigint) => {
    playerRemainingNumbersCount.value = newValue
  }

  const isPlayerRegistered = computed(() => playerAddress.value !== zeroAddress)

  const isUserWinner = computed(() =>
    bingoStore.winners.includes(playerAddress.value),
  )

  return {
    setPlayerAddress,
    setPlayerNumbers,
    setRemainingNumbersCount,
    playerAddress,
    playerNumbers,
    isPlayerRegistered,
    isUserWinner,
    playerRemainingNumbersCount,
  }
})
