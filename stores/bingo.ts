import { formatEther, type Address } from 'viem'

export const useBingoStore = defineStore('bingoStore', () => {
  const drawnNumbers = ref<readonly bigint[]>([])
  const drawnNumbersTimestamp = ref(0n)
  const bingoCardNumbersCount = ref(0n)
  const minBingoNumber = ref(0n)
  const maxBingoNumber = ref(0)
  const bingoCardPrice = ref(0n)
  const winners = ref<readonly Address[]>([])
  const rewardPerWinner = ref(0n)
  const isGameFinished = ref(false)
  const minPlayers = ref(0n)
  const drawnNumbersLastIndex = ref(0n)
  const drawnNumbersWithTimestamp = ref<
    {
      number: number
      timestamp: number
    }[]
  >([])

  const setDrawnNumbers = (newValue: readonly bigint[]) => {
    drawnNumbers.value = newValue
  }

  const setDrawnNumbersTimestamp = (newValue: bigint) => {
    drawnNumbersTimestamp.value = newValue
  }

  const setBingoCardNumbersCount = (newValue: bigint) => {
    bingoCardNumbersCount.value = newValue
  }

  const setMinBingoNumber = (newValue: bigint) => {
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

  const setDrawnNumbersLastIndex = (newValue: bigint) => {
    drawnNumbersLastIndex.value = newValue
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
    formatEther(rewardPerWinner.value),
  )

  const bingoCardPriceFormatted = computed(() =>
    formatEther(bingoCardPrice.value),
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
    setDrawnNumbersLastIndex,
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
    drawnNumbersLastIndex,
  }
})
