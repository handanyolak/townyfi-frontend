import { zeroAddress, type Address } from 'viem'

export const usePlayerStore = defineStore('playerStore', () => {
  const bingoStore = useBingoStore()
  const { winners } = storeToRefs(bingoStore)

  const playerAddress = ref<Address>(zeroAddress)
  const remainingNumbersCount = ref(0)
  const cardNumbers = ref<number[]>([])
  const numberBitmap = ref(0n)
  const isPlayerExists = ref(false)
  const otherPlayerAddress = ref<Address | null>(null)

  const setPlayerAddress = (newValue: Address) => {
    playerAddress.value = newValue
  }

  const setRemainingNumbersCount = (newValue: number) => {
    remainingNumbersCount.value = newValue
  }

  const setCardNumbers = (newValue: number[]) => {
    cardNumbers.value = newValue
  }

  const setNumberBitmap = (newValue: bigint) => {
    numberBitmap.value = newValue
  }

  // extra
  const isUserWinner = computed(() =>
    winners.value.includes(playerAddress.value),
  )

  const setOtherPlayerAddress = (newValue: Address) => {
    otherPlayerAddress.value = newValue
  }

  const setIsPlayerExists = (newValue: boolean) => {
    isPlayerExists.value = newValue
  }

  // extra

  return {
    playerAddress,
    remainingNumbersCount,
    cardNumbers,
    numberBitmap,
    isPlayerExists,
    otherPlayerAddress,
    setPlayerAddress,
    setRemainingNumbersCount,
    setCardNumbers,
    setNumberBitmap,
    isUserWinner,
    setOtherPlayerAddress,
    setIsPlayerExists,
  }
})
