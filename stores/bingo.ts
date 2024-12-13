import { formatUnits, type Address } from 'viem'

export const useBingoStore = defineStore('bingoStore', () => {
  const userWalletStore = useUserWalletStore()

  const drawnNumbers = ref<readonly number[]>([])
  const drawnNumbersTimestamp = ref(0n)
  const bingoCardNumbersCount = ref(0)
  const minBingoNumber = ref(0)
  const maxBingoNumber = ref(0)
  const bingoCardPrice = ref(0n)
  const winners = ref<readonly Address[]>([])
  const rewardPerWinner = ref(0n)
  const isGameFinished = ref(false)
  const minPlayers = ref(0n)
  const playerAddresses = ref<readonly Address[]>([])
  const drawnNumbersWithTimestamp = ref<
    {
      number: number
      timestamp: number
    }[]
  >([])

  const setDrawnNumbers = (newValue: readonly number[]) => {
    drawnNumbers.value = newValue
  }

  const setDrawnNumbersTimestamp = (newValue: bigint) => {
    drawnNumbersTimestamp.value = newValue
  }

  const setBingoCardNumbersCount = (newValue: number) => {
    bingoCardNumbersCount.value = newValue
  }

  const setMinBingoNumber = (newValue: number) => {
    minBingoNumber.value = newValue
  }

  const setMaxBingoNumber = (newValue: number) => {
    maxBingoNumber.value = newValue
  }

  const setBingoCardPrice = (newValue: bigint) => {
    bingoCardPrice.value = newValue
  }

  const setWinners = (newValue: readonly Address[]) => {
    winners.value = newValue
  }

  const setRewardPerWinner = (newValue: bigint) => {
    rewardPerWinner.value = newValue
  }

  const setIsGameFinished = (newValue: boolean) => {
    isGameFinished.value = newValue
  }

  const setMinPlayers = (newValue: bigint) => {
    minPlayers.value = newValue
  }

  const setPlayerAddresses = (newValue: readonly Address[]) => {
    playerAddresses.value = newValue as Address[]
  }

  const addPlayerAddress = (newValue: Address) => {
    playerAddresses.value = [...playerAddresses.value, newValue]
  }

  const setDrawnNumbersWithTimestamp = (
    newValue: {
      number: number
      timestamp: number
    }[],
  ) => {
    drawnNumbersWithTimestamp.value = newValue
  }

  const rewardPerWinnerFormatted = computed(() =>
    formatUnits(
      rewardPerWinner.value,
      userWalletStore.chain.nativeCurrency.decimals,
    ),
  )

  const bingoCardPriceFormatted = computed(() =>
    formatUnits(
      bingoCardPrice.value,
      userWalletStore.chain.nativeCurrency.decimals,
    ),
  )

  const gameStartTimestamp = computed(
    () => Number(drawnNumbersTimestamp.value) + 60,
  )

  return {
    setDrawnNumbers,
    setDrawnNumbersTimestamp,
    setBingoCardNumbersCount,
    setMinBingoNumber,
    setMaxBingoNumber,
    setBingoCardPrice,
    setWinners,
    setRewardPerWinner,
    setMinPlayers,
    setDrawnNumbersWithTimestamp,
    setIsGameFinished,
    setPlayerAddresses,
    isGameFinished,
    drawnNumbers,
    drawnNumbersTimestamp,
    bingoCardNumbersCount,
    minBingoNumber,
    maxBingoNumber,
    bingoCardPrice,
    bingoCardPriceFormatted,
    gameStartTimestamp,
    winners,
    rewardPerWinner,
    rewardPerWinnerFormatted,
    drawnNumbersWithTimestamp,
    minPlayers,
    playerAddresses,
    addPlayerAddress,
  }
})
