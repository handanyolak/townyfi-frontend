import { useToggle, useStorage } from '@vueuse/core'
import { isAddress, zeroAddress, type Address } from 'viem'
import { useAppKitAccount } from '@reown/appkit/vue'
import { processAndPrintLog } from '~/utils'
import type { CoordinateStruct, User } from '~/types'
import { transformPlayer } from '~/transformers'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const userGameStore = useUserGameStore()
  const contractStore = useContractStore()
  const appOptionStore = useAppOptionsStore()
  const bingoStore = useBingoStore()
  const playerStore = usePlayerStore()
  const accountInfo = useAppKitAccount()
  const eventStore = useEventStore()

  // --------[ States ]-------- //
  const isBlockchainInfo = ref(false)
  const isContractInfo = ref(false)
  const initialized = ref(false)
  const showSidebar = ref(false)
  const isGameInfo = ref(false)
  const isOptions = ref(false)
  const music = ref(false)
  const originCoordinate = ref<CoordinateStruct>({
    _x: BigInt(0),
    _y: BigInt(0),
  })
  const mainThemeAudio = ref<HTMLAudioElement | null>(null)
  const audio = useStorage('audio', false)
  const _toggleAudio = useToggle(audio)
  const _toggleMusic = useToggle(music)
  const modalComponentName = ref('')
  const modalComponentProps = ref({})
  const isAnimation = ref(false)
  const isConfirmed = ref(false)
  const isAttackSuccess = ref(false)

  const modalResultResolver = ref<((value: unknown) => void) | null>(null)

  // --------[ Actions ]-------- //
  const setModalInfo = (
    newModalComponentName: string,
    newModalComponentProps?: any,
  ) => {
    modalComponentName.value = newModalComponentName
    modalComponentProps.value = newModalComponentProps
    isAnimation.value = Object.prototype.hasOwnProperty.call(
      modalComponentProps.value ?? {},
      'animation',
    )
    sideLeave({
      isGameInfo: true,
      isContractInfo: true,
      isBlockchainInfo: true,
      isOptions: true,
    })
    return new Promise((resolve) => {
      modalResultResolver.value = resolve
    })
  }

  const clearModalInfo = () => {
    modalComponentName.value = ''
    modalComponentProps.value = {}
    if (modalResultResolver.value) {
      modalResultResolver.value(false)
      modalResultResolver.value = null
    }
    isConfirmed.value = false
    isAttackSuccess.value = false

    return true
  }

  const closeModalWithResponse = (response: boolean) => {
    if (modalResultResolver.value) {
      modalResultResolver.value(response)
      modalResultResolver.value = null
    }
  }

  const sideLeave = ({
    isGameInfo,
    isContractInfo,
    isBlockchainInfo,
    isOptions,
  }: {
    isGameInfo: boolean
    isContractInfo: boolean
    isBlockchainInfo: boolean
    isOptions: boolean
  }) => {
    showSidebar.value = false

    requestAnimationFrame(() => {
      if (isGameInfo) {
        appOptionStore.isGameInfo = false
      }
      if (isContractInfo) {
        appOptionStore.isContractInfo = false
      }
      if (isBlockchainInfo) {
        appOptionStore.isBlockchainInfo = false
      }
      if (isOptions) {
        appOptionStore.isOptions = false
      }
    })
  }

  const setOriginCoordinate = (newOriginCoordinate: CoordinateStruct) => {
    originCoordinate.value = newOriginCoordinate
  }

  const initializeApp = async (playerAddress: null | string) => {
    await sleep(250)

    if (playerAddress && isAddress(playerAddress)) {
      playerStore.setOtherPlayerAddress(playerAddress)
    } else {
      playerAddress = null
    }

    if (accountInfo.value.isConnected) {
      await userWalletStore.connect()

      userWalletStore.startEthEvents()
    }

    if (!initialized.value) {
      initialized.value = true

      const [
        drawnNumbers,
        drawnNumbersTimestamp,
        winners,
        isGameFinished,
        bingoCardNumbersCount,
        minBingoNumber,
        maxBingoNumber,
        bingoCardPrice,
        rewardPerWinner,
        minPlayers,
        playerAddresses,
      ] = await Promise.all([
        contractStore.getBingoContractPublic.read.getDrawnNumbers(),
        contractStore.getBingoContractPublic.read.drawnNumbersTimestamp(),
        contractStore.getBingoContractPublic.read.getWinners(),
        contractStore.getBingoContractPublic.read.isGameFinished(),
        contractStore.getBingoContractPublic.read.BINGO_CARD_NUMBERS_COUNT(),
        contractStore.getBingoContractPublic.read.MIN_BINGO_NUMBER(),
        contractStore.getBingoContractPublic.read.MAX_BINGO_NUMBER(),
        contractStore.getBingoContractPublic.read.BINGO_CARD_PRICE(),
        contractStore.getBingoContractPublic.read.rewardPerWinner(),
        contractStore.getBingoContractPublic.read.MIN_PLAYERS(),
        contractStore.getBingoContractPublic.read.getPlayerAddresses(),
      ])

      if (drawnNumbers.length > 0) {
        const drawnNumbersWithTimestamp = drawnNumbers.map((number, index) => {
          let additionalTimestamp = index * 3
          if (index === 0) {
            additionalTimestamp += 15
          }
          return {
            number: Number(number),
            timestamp: Number(drawnNumbersTimestamp) + additionalTimestamp,
          }
        })
        bingoStore.setDrawnNumbersWithTimestamp(drawnNumbersWithTimestamp)
      }

      bingoStore.setDrawnNumbers(drawnNumbers)
      bingoStore.setDrawnNumbersTimestamp(drawnNumbersTimestamp)
      bingoStore.setWinners(winners)
      bingoStore.setIsGameFinished(isGameFinished)
      bingoStore.setBingoCardNumbersCount(bingoCardNumbersCount)
      bingoStore.setMinBingoNumber(minBingoNumber)
      bingoStore.setMaxBingoNumber(maxBingoNumber)
      bingoStore.setBingoCardPrice(bingoCardPrice)
      bingoStore.setRewardPerWinner(rewardPerWinner)
      bingoStore.setMinPlayers(minPlayers)
      bingoStore.setPlayerAddresses(playerAddresses)

      try {
        const playerInfo = transformPlayer(
          await contractStore.getBingoContractPublic.read.getPlayerInfo([
            ((playerAddress ?? accountInfo.value.address) as Address) ??
              zeroAddress,
          ]),
        )

        playerStore.setPlayerAddress(playerInfo.playerAddress)
        playerStore.setPlayerNumbers(playerInfo.numbers)
        playerStore.setRemainingNumbersCount(playerInfo.remainingNumbersCount)
      } catch (error) {}

      // userWalletStore.chainClient.watchBlockNumber({
      //   onBlockNumber: async (blockNumber) => {
      //     userWalletStore.setCurrentBlockNumber(blockNumber)
      //     userWalletStore.setBalance(
      //       await userWalletStore.publicClient.getBalance({
      //         address: userWalletStore.address,
      //       }),
      //     )
      //   },
      // })

      const bingoContractEventFilter = {
        address: contractStore.getBingoContract.address,
        abi: contractStore.getBingoContract.abi,
        strict: true,
        onError: (error: Error) =>
          console.error('bingoContractEventFilter', error),
      } as const

      userWalletStore.publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'BingoCardPurchased',
        onLogs: async (logs) => {
          try {
            const uniqueLogs = getUniqueLogs(logs)
            for (const { eventName, args } of uniqueLogs) {
              const { playerAddress } = args

              if (playerAddress === accountInfo.value.address) {
                const playerInfo = transformPlayer(
                  await contractStore.getBingoContractPublic.read.getPlayerInfo(
                    [playerAddress],
                  ),
                )

                playerStore.setPlayerAddress(playerInfo.playerAddress)
                playerStore.setPlayerNumbers(playerInfo.numbers)
                playerStore.setRemainingNumbersCount(
                  playerInfo.remainingNumbersCount,
                )
                bingoStore.addPlayerAddress(playerInfo.playerAddress)
              }

              processAndPrintLog({
                logName: eventName,
                logArgs: args,
                useToast: true,
                toastMessage: 'Bingo card purchased!',
              })
            }
          } catch (error) {
            console.error(`${logs[0].eventName} error`, error)
          }
        },
      })

      userWalletStore.publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'GameFinished',
        onLogs: async (logs) => {
          try {
            const uniqueLogs = getUniqueLogs(logs)
            for (const { eventName } of uniqueLogs) {
              const [
                drawnNumbers,
                drawnNumbersTimestamp,
                winners,
                rewardPerWinner,
              ] = await Promise.all([
                contractStore.getBingoContractPublic.read.getDrawnNumbers(),
                contractStore.getBingoContractPublic.read.drawnNumbersTimestamp(),
                contractStore.getBingoContractPublic.read.getWinners(),
                contractStore.getBingoContractPublic.read.rewardPerWinner(),
              ])

              const drawnNumbersWithTimestamp = drawnNumbers.map(
                (number, index) => {
                  let additionalTimestamp = index * 3
                  if (index === 0) {
                    additionalTimestamp += 15
                  }
                  return {
                    number: Number(number),
                    timestamp:
                      Number(drawnNumbersTimestamp) + additionalTimestamp,
                  }
                },
              )
              bingoStore.setDrawnNumbersWithTimestamp(drawnNumbersWithTimestamp)
              bingoStore.setDrawnNumbers(drawnNumbers)
              bingoStore.setDrawnNumbersTimestamp(drawnNumbersTimestamp)
              bingoStore.setWinners(winners)
              bingoStore.setRewardPerWinner(rewardPerWinner)
              eventStore.triggerGameFinishedEvent()

              processAndPrintLog({
                logName: eventName,
                logArgs: {
                  drawnNumbersTimestamp,
                },
                useToast: true,
                toastMessage: `Drawn numbers filled! The game will begin in a few seconds`,
              })
            }
          } catch (error) {
            console.error(`${logs[0].eventName} error`, error)
          }
        },
      })
    }
  }

  const setUserInfo = (userInfo: User) => {
    userGameStore.setUser(userInfo)
  }

  const toggleAudio = () => {
    _toggleAudio()

    if (!audio.value) {
      pauseMusic()
    }
  }

  const toggleMusic = () => {
    _toggleMusic()

    if (music.value && audio.value) {
      playMusic()
    } else {
      pauseMusic()
    }
  }

  const playMusic = async () => {
    if (!mainThemeAudio.value) {
      mainThemeAudio.value = new Audio(
        // @ts-ignore
        (await import('~/assets/sound/in-dreams.mp3')).default,
      )
      mainThemeAudio.value.loop = true
    }

    mainThemeAudio.value.play()
  }

  const pauseMusic = () => {
    music.value = false
    mainThemeAudio.value?.pause()
  }

  return {
    audio,
    music,
    isOptions,
    isGameInfo,
    showSidebar,
    isContractInfo,
    isBlockchainInfo,
    originCoordinate,
    modalComponentName,
    modalComponentProps,
    isConfirmed,
    isAnimation,
    modalResultResolver,
    isAttackSuccess,
    sideLeave,
    toggleMusic,
    setUserInfo,
    toggleAudio,
    initializeApp,
    setOriginCoordinate,
    setModalInfo,
    clearModalInfo,
    closeModalWithResponse,
  }
})
