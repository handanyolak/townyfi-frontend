import { isAddress, zeroAddress, type Address } from 'viem'
import { useAppKitAccount } from '@reown/appkit/vue'
import { TYPE } from 'vue-toastification'
import type { ToastOptions } from 'vue-toastification/src/types'
import { transformPlayer } from '~/transformers'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const contractStore = useContractStore()
  const bingoStore = useBingoStore()
  const playerStore = usePlayerStore()
  const accountInfo = useAppKitAccount()
  const eventStore = useEventStore()

  const {
    public: { drawnNumbersIntervalInSec, drawnNumbersAdditionalTimeInSec },
  } = useRuntimeConfig()

  // --------[ States ]-------- //
  const isBlockchainInfo = ref(false)
  const isContractInfo = ref(false)
  const initialized = ref(false)
  const showSidebar = ref(false)
  const isGameInfo = ref(false)
  const isOptions = ref(false)
  const isAnimation = ref(false)
  const isConfirmed = ref(false)
  const isAttackSuccess = ref(false)

  // --------[ Actions ]-------- //
  const initializeApp = async (playerAddress?: null | string) => {
    if (playerAddress && isAddress(playerAddress)) {
      playerStore.setOtherPlayerAddress(playerAddress)
    } else {
      playerAddress = null
    }

    if (!initialized.value) {
      initialized.value = true

      await setInitializeValues(playerAddress)

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
        address: contractStore.getBingoContractPublic.address,
        abi: contractStore.getBingoContractPublic.abi,
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
            console.debug('BingoCardPurchased logs', uniqueLogs)
            for (const { eventName, args } of uniqueLogs) {
              const { playerAddress: playerAddressFromLog } = args

              while (true) {
                if (
                  playerAddressFromLog.toLowerCase() ===
                  accountInfo.value.address?.toLowerCase()
                ) {
                  let playerInfoRaw
                  try {
                    playerInfoRaw =
                      await contractStore.getBingoContractPublic.read.getPlayerInfo(
                        [playerAddressFromLog],
                      )
                  } catch (error) {
                    await sleep(0.5 * 1000)
                    continue
                  }

                  const { playerAddress, numbers, remainingNumbersCount } =
                    transformPlayer(playerInfoRaw)

                  playerStore.setPlayerAddress(playerAddress)
                  playerStore.setPlayerNumbers(
                    numbers as unknown as readonly number[],
                  )
                  playerStore.setRemainingNumbersCount(remainingNumbersCount)
                }

                if (
                  !bingoStore.playerAddresses.includes(playerAddressFromLog)
                ) {
                  bingoStore.addPlayerAddress(playerAddressFromLog)
                }

                break
              }

              processAndPrintLog({
                logName: eventName,
                logArgs: args,
                useToast: true,
                toastMessage: 'Bingo card purchased!',
                toastOptions: {
                  timeout: 2 * 1000,
                },
              })
            }
          } catch (error) {
            console.error(`${logs[0].eventName} error`, error)
          }
        },
      })

      userWalletStore.publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'DrawnNumbersFilled',
        onLogs: async (logs) => {
          try {
            const uniqueLogs = getUniqueLogs(logs)
            console.debug('DrawnNumbersFilled logs', uniqueLogs)
            for (const { eventName } of uniqueLogs) {
              await sleep(20 * 1000)

              while (true) {
                const [drawnNumbersTimestamp, randomNumbers] =
                  await Promise.all([
                    contractStore.getBingoContractPublic.read.drawnNumbersTimestamp(),
                    contractStore.getBingoContractPublic.read.getRandomNumbers(),
                  ])

                if (drawnNumbersTimestamp <= BigInt(0)) {
                  continue
                }

                bingoStore.setDrawnNumbersTimestamp(drawnNumbersTimestamp)
                bingoStore.setRandomNumbers(randomNumbers)

                break
              }

              bingoStore.setIsDrawnNumbersFilled(true)

              processAndPrintLog({
                logName: eventName,
                useToast: true,
                toastMessage: `Drawn numbers filled!`,
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
            console.debug('GameFinished logs', uniqueLogs)
            for (const { eventName } of uniqueLogs) {
              const initialIsGameFinished = bingoStore.isGameFinished
              while (true) {
                const [
                  drawnNumbers,
                  winners,
                  rewardPerWinner,
                  winDrawnNumbersIndex,
                  newIsGameFinished,
                  finalizeGameTimestamp,
                ] = await Promise.all([
                  contractStore.getBingoContractPublic.read.getDrawnNumbers(),
                  contractStore.getBingoContractPublic.read.getWinners(),
                  contractStore.getBingoContractPublic.read.rewardPerWinner(),
                  contractStore.getBingoContractPublic.read.winDrawnNumbersIndex(),
                  contractStore.getBingoContractPublic.read.isGameFinished(),
                  contractStore.getBingoContractPublic.read.finalizeGameTimestamp(),
                ])

                if (initialIsGameFinished === newIsGameFinished) {
                  await sleep(0.1 * 1000)
                  continue
                }

                const drawnNumbersWithTimestamp = drawnNumbers.map(
                  (number, index) => ({
                    number,
                    timestamp:
                      Number(finalizeGameTimestamp) +
                      index * drawnNumbersIntervalInSec +
                      drawnNumbersAdditionalTimeInSec,
                  }),
                )
                bingoStore.setDrawnNumbersWithTimestamp(
                  drawnNumbersWithTimestamp,
                )
                bingoStore.setDrawnNumbers(drawnNumbers)
                bingoStore.setWinners(winners)
                bingoStore.setRewardPerWinner(rewardPerWinner)
                bingoStore.setWinDrawnNumbersIndex(winDrawnNumbersIndex)
                bingoStore.setIsGameFinished(newIsGameFinished)
                eventStore.triggerGameFinishedEvent()

                break
              }

              processAndPrintLog({
                logName: eventName,
                logArgs: {
                  drawnNumbersTimestamp: bingoStore.drawnNumbersTimestamp,
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

  const processAndPrintLog = ({
    logName,
    logArgs = {},
    useToast,
    toastMessage = '',
    toastOptions,
  }: {
    logName: string
    logArgs?: any
    useToast: boolean
    toastMessage: string
    toastOptions?: ToastOptions
  }) => {
    const eventNameMessage = `Event: ${logName}`
    const argsMessage = formatEventArgs(logArgs)
    const eventMessage = `${eventNameMessage}\n${argsMessage}`

    if (useToast) {
      const toastMsg = (toastMessage ? `${toastMessage}\n` : '') + eventMessage
      useAppToast(TYPE.INFO, toastMsg, toastOptions)
    }
  }

  const setInitializeValues = async (playerAddress?: null | string) => {
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
      finalizationCooldown,
      isDrawnNumbersFilled,
      winDrawnNumbersIndex,
      finalizeGameTimestamp,
      randomNumbers,
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
      contractStore.getBingoContractPublic.read.FINALIZATION_COOLDOWN(),
      contractStore.getBingoContractPublic.read.isDrawnNumbersFilled(),
      contractStore.getBingoContractPublic.read.winDrawnNumbersIndex(),
      contractStore.getBingoContractPublic.read.finalizeGameTimestamp(),
      contractStore.getBingoContractPublic.read.getRandomNumbers(),
    ])

    if (drawnNumbers.length > 0) {
      const drawnNumbersWithTimestamp = drawnNumbers.map((number, index) => ({
        number,
        timestamp:
          Number(finalizeGameTimestamp) +
          index * drawnNumbersIntervalInSec +
          drawnNumbersAdditionalTimeInSec,
      }))
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
    bingoStore.setFinalizationCooldown(finalizationCooldown)
    bingoStore.setIsDrawnNumbersFilled(isDrawnNumbersFilled)
    bingoStore.setWinDrawnNumbersIndex(winDrawnNumbersIndex)
    bingoStore.setRandomNumbers(randomNumbers)

    try {
      const playerInfo = transformPlayer(
        await contractStore.getBingoContractPublic.read.getPlayerInfo([
          ((playerAddress ?? accountInfo.value.address) as Address) ??
            zeroAddress,
        ]),
      )

      playerStore.setPlayerAddress(playerInfo.playerAddress)
      playerStore.setPlayerNumbers(
        playerInfo.numbers as unknown as readonly number[],
      )
      playerStore.setRemainingNumbersCount(playerInfo.remainingNumbersCount)
    } catch (error) {}
  }

  return {
    isOptions,
    isGameInfo,
    showSidebar,
    isContractInfo,
    isBlockchainInfo,
    isConfirmed,
    isAnimation,
    isAttackSuccess,
    initializeApp,
    setInitializeValues,
  }
})
