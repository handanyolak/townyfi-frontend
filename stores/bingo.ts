import { formatUnits, zeroAddress, type Address } from 'viem'

export const useBingoStore = defineStore('bingoStore', () => {
  const userWalletStore = useUserWalletStore()
  const { chain } = userWalletStore

  const availableGameId = ref(0n)
  const winners = ref<Address[]>([])
  const players = ref<Address[]>([])
  const drawnNumbers = ref<number[]>([])
  const winningDrawnNumberIndex = ref(0)
  const drawnNumbersTimestamp = ref(0n)
  const isDrawnNumbersFilled = ref(false)
  const isGameFinished = ref(false)
  const vrfRequested = ref(false)
  const vrfRequestId = ref(0n)
  const prizePoolBalance = ref(0n)
  const requestRandomnessPayment = ref(0n)
  const requestRandomNumbersRefund = ref(0n)
  const MIN_VRF_REQUEST_RETRY_INTERVAL = ref(0n)
  const MIN_VRF_CALLBACK_GAS_LIMIT = ref(0)
  const MAX_VRF_CALLBACK_GAS_LIMIT = ref(0)
  const VRF_NUM_WORDS = ref(0)
  const VRF_REQUEST_CONFIRMATIONS = ref(0)
  const VRF_V2_PLUS_WRAPPER_ADDRESS = ref<Address>(zeroAddress)
  const BINGO_NUMBERS_COUNT = ref(0)
  const BINGO_MAX_NUMBER = ref(0)
  const BINGO_MIN_NUMBER = ref(0)
  const BINGO_CARD_NUMBERS_COUNT = ref(0)
  const MIN_PLAYERS = ref(0n)
  const BINGO_CARD_PRICE = ref(0n)
  const FINALIZATION_COOLDOWN = ref(0n)
  const drawnNumbersWithTimestamp = ref<
    {
      number: number
      timestamp: number
    }[]
  >([])
  const winnersCursor = ref(0n)
  const playersCursor = ref(0n)
  const contractBalance = ref(0n)

  const setAvailableGameId = (newValue: bigint) => {
    availableGameId.value = newValue
  }

  const setWinners = (newValue: Address[]) => {
    winners.value = newValue
  }

  const setPlayers = (newValue: Address[]) => {
    players.value = newValue
  }

  const setDrawnNumbers = (newValue: number[]) => {
    drawnNumbers.value = newValue
  }

  const setWinningDrawnNumberIndex = (newValue: number) => {
    winningDrawnNumberIndex.value = newValue
  }

  const setDrawnNumbersTimestamp = (newValue: bigint) => {
    drawnNumbersTimestamp.value = newValue
  }

  const setIsDrawnNumbersFilled = (newValue: boolean) => {
    isDrawnNumbersFilled.value = newValue
  }

  const setIsGameFinished = (newValue: boolean) => {
    isGameFinished.value = newValue
  }

  const setVrfRequested = (newValue: boolean) => {
    vrfRequested.value = newValue
  }

  const setVrfRequestId = (newValue: bigint) => {
    vrfRequestId.value = newValue
  }

  const setPrizePoolBalance = (newValue: bigint) => {
    prizePoolBalance.value = newValue
  }

  const setRequestRandomnessPayment = (newValue: bigint) => {
    requestRandomnessPayment.value = newValue
  }

  const setRequestRandomNumbersRefund = (newValue: bigint) => {
    requestRandomNumbersRefund.value = newValue
  }

  const setMinVrfRequestRetryInterval = (newValue: bigint) => {
    MIN_VRF_REQUEST_RETRY_INTERVAL.value = newValue
  }

  const setMinVrfCallbackGasLimit = (newValue: number) => {
    MIN_VRF_CALLBACK_GAS_LIMIT.value = newValue
  }

  const setMaxVrfCallbackGasLimit = (newValue: number) => {
    MAX_VRF_CALLBACK_GAS_LIMIT.value = newValue
  }

  const setVrfNumWords = (newValue: number) => {
    VRF_NUM_WORDS.value = newValue
  }

  const setVrfRequestConfirmations = (newValue: number) => {
    VRF_REQUEST_CONFIRMATIONS.value = newValue
  }

  const setVrfV2PlusWrapperAddress = (newValue: Address) => {
    VRF_V2_PLUS_WRAPPER_ADDRESS.value = newValue
  }

  const setBingoNumbersCount = (newValue: number) => {
    BINGO_NUMBERS_COUNT.value = newValue
  }

  const setMaxBingoNumber = (newValue: number) => {
    BINGO_MAX_NUMBER.value = newValue
  }

  const setMinBingoNumber = (newValue: number) => {
    BINGO_MIN_NUMBER.value = newValue
  }

  const setBingoCardNumbersCount = (newValue: number) => {
    BINGO_CARD_NUMBERS_COUNT.value = newValue
  }

  const setMinPlayers = (newValue: bigint) => {
    MIN_PLAYERS.value = newValue
  }

  const setBingoCardPrice = (newValue: bigint) => {
    BINGO_CARD_PRICE.value = newValue
  }

  const setFinalizationCooldown = (newValue: bigint) => {
    FINALIZATION_COOLDOWN.value = newValue
  }

  // extra start
  const setDrawnNumbersWithTimestamp = (
    newValue: {
      number: number
      timestamp: number
    }[],
  ) => {
    drawnNumbersWithTimestamp.value = newValue
  }

  const setWinnersCursor = (newValue: bigint) => {
    winnersCursor.value = newValue
  }

  const setPlayersCursor = (newValue: bigint) => {
    playersCursor.value = newValue
  }

  const setContractBalance = (newValue: bigint) => {
    contractBalance.value = newValue
  }

  const decreasePrizePoolBalance = (newValue: bigint) => {
    prizePoolBalance.value -= newValue
  }

  const increasePrizePoolBalance = (newValue: bigint) => {
    prizePoolBalance.value += newValue
  }

  const increaseRequestRandomnessPayment = (newValue: bigint) => {
    requestRandomnessPayment.value += newValue
  }

  const increaseRequestRandomNumbersRefund = (newValue: bigint) => {
    requestRandomNumbersRefund.value += newValue
  }

  const requestRandomnessPaymentFormatted = computed(
    () =>
      `${formatUnits(requestRandomnessPayment.value, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`,
  )

  const requestRandomNumbersRefundFormatted = computed(
    () =>
      `${formatUnits(requestRandomNumbersRefund.value, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`,
  )

  const bingoCardPriceFormatted = computed(
    () =>
      `${formatUnits(BINGO_CARD_PRICE.value, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`,
  )

  const prizePoolBalanceFormatted = computed(
    () =>
      `${formatUnits(prizePoolBalance.value, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`,
  )

  const totalPrizePoolBalanceFormatted = computed(
    () =>
      `${formatUnits(prizePoolBalance.value + requestRandomnessPayment.value + requestRandomNumbersRefund.value, chain.nativeCurrency.decimals)} ${chain.nativeCurrency.symbol}`,
  )

  const gameStartTimestamp = computed(
    () => Number(drawnNumbersTimestamp.value) + 60,
  )
  // extra end

  return {
    availableGameId,
    winners,
    players,
    drawnNumbers,
    winningDrawnNumberIndex,
    drawnNumbersTimestamp,
    isDrawnNumbersFilled,
    isGameFinished,
    vrfRequested,
    vrfRequestId,
    prizePoolBalance,
    requestRandomnessPayment,
    requestRandomNumbersRefund,
    MIN_VRF_REQUEST_RETRY_INTERVAL,
    MIN_VRF_CALLBACK_GAS_LIMIT,
    MAX_VRF_CALLBACK_GAS_LIMIT,
    VRF_NUM_WORDS,
    VRF_REQUEST_CONFIRMATIONS,
    VRF_V2_PLUS_WRAPPER_ADDRESS,
    BINGO_NUMBERS_COUNT,
    BINGO_MAX_NUMBER,
    BINGO_MIN_NUMBER,
    BINGO_CARD_NUMBERS_COUNT,
    MIN_PLAYERS,
    BINGO_CARD_PRICE,
    FINALIZATION_COOLDOWN,
    drawnNumbersWithTimestamp,
    contractBalance,
    setAvailableGameId,
    setWinners,
    setPlayers,
    setDrawnNumbers,
    setWinningDrawnNumberIndex,
    setDrawnNumbersTimestamp,
    setIsDrawnNumbersFilled,
    setIsGameFinished,
    setVrfRequested,
    setVrfRequestId,
    setPrizePoolBalance,
    setRequestRandomnessPayment,
    setRequestRandomNumbersRefund,
    setMinVrfRequestRetryInterval,
    setMinVrfCallbackGasLimit,
    setMaxVrfCallbackGasLimit,
    setVrfNumWords,
    setVrfRequestConfirmations,
    setVrfV2PlusWrapperAddress,
    setBingoNumbersCount,
    setMaxBingoNumber,
    setMinBingoNumber,
    setBingoCardNumbersCount,
    setMinPlayers,
    setBingoCardPrice,
    setFinalizationCooldown,
    setDrawnNumbersWithTimestamp,
    setWinnersCursor,
    setPlayersCursor,
    setContractBalance,
    decreasePrizePoolBalance,
    increasePrizePoolBalance,
    increaseRequestRandomnessPayment,
    increaseRequestRandomNumbersRefund,
    requestRandomnessPaymentFormatted,
    requestRandomNumbersRefundFormatted,
    bingoCardPriceFormatted,
    prizePoolBalanceFormatted,
    totalPrizePoolBalanceFormatted,
    gameStartTimestamp,
  }
})
