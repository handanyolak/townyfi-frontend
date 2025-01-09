import { isAddress, zeroAddress, type Address } from 'viem'
import { TYPE } from 'vue-toastification'
import type { ToastOptions } from 'vue-toastification/src/types'
import { useAccount } from '@wagmi/vue'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const contractStore = useContractStore()
  const bingoStore = useBingoStore()
  const playerStore = usePlayerStore()
  const accountInfo = useAccount()

  const { bingoContractPublic } = contractStore
  const { publicClient } = userWalletStore

  const {
    public: { drawnNumbersIntervalInSec, drawnNumbersAdditionalTimeInSec },
  } = useRuntimeConfig()

  // --------[ States ]-------- //
  const initialized = ref(false)

  // --------[ Actions ]-------- //
  const initializeApp = async (
    playerAddress?: null | string,
    gameId?: bigint,
  ) => {
    if (playerAddress && isAddress(playerAddress)) {
      playerStore.setOtherPlayerAddress(playerAddress)
    } else {
      playerAddress = null
    }

    if (!initialized.value) {
      initialized.value = true

      await setInitializeValues(playerAddress, gameId)

      userWalletStore.startEthEvents()

      publicClient.watchBlocks({
        includeTransactions: false,
        emitOnBegin: true,
        emitMissed: false,
        pollingInterval: 5 * 1000,
        onError: (error: Error) => console.error('watchBlocks', error),
        onBlock: async (block) => {
          const contractBalance = await publicClient.getBalance({
            address: bingoContractPublic.address,
          })

          bingoStore.setContractBalance(contractBalance)
          userWalletStore.setCurrentBlockNumber(block.number)

          const chainNamespace =
            // @ts-expect-error
            accountInfo.chain.value?.chainNamespace ||
            userWalletStore.appkit.getActiveChainNamespace()
          if (
            accountInfo.address.value &&
            accountInfo.isConnected.value &&
            accountInfo.chain.value &&
            chainNamespace
          ) {
            // @ts-expect-error
            userWalletStore.appkit.syncBalance({
              address: accountInfo.address.value,
              chainId: accountInfo.chain.value.id,
              chainNamespace,
            })
          }
        },
      })

      const bingoContractEventFilter = {
        address: bingoContractPublic.address,
        abi: bingoContractPublic.abi,
        strict: true,
        batch: true,
        pollingInterval: 10 * 1000,
        onError: (error: Error) => console.error('watchContractEvent', error),
      } as const

      publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'CardPurchased',
        onLogs: (logs) => {
          const uniqueLogs = getUniqueLogs(logs)
          for (const { eventName, args } of uniqueLogs) {
            try {
              const { gameId, player, value } = args
              // TODO: think about the game id
              // we can check if the game id is the same as the current game id
              if (bingoStore.availableGameId !== gameId) {
                throw new Error(
                  'Game id is not the same as the current game id.',
                )
              }

              if (
                player.playerAddress.toLowerCase() ===
                accountInfo.address.value?.toLowerCase()
              ) {
                setPlayerValues(player, true)
              }

              bingoStore.increasePrizePoolBalance(value)

              processAndPrintLog({
                logName: eventName,
                logArgs: args,
                useToast: true,
                toastMessage: 'New player joined the game!',
                toastOptions: {
                  timeout: 2 * 1000,
                },
              })
            } catch (error) {
              console.error(`${eventName} error`, error)
            }
          }
        },
      })

      publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'RequestRandomness',
        onLogs: (logs) => {
          const uniqueLogs = getUniqueLogs(logs)
          for (const { eventName, args } of uniqueLogs) {
            try {
              const {
                gameId,
                requestId,
                requestPrice,
                refundAmount,
                requestTimestamp,
              } = args
              // TODO: think about the game id
              // we can check if the game id is the same as the current game id
              if (bingoStore.availableGameId !== gameId) {
                throw new Error(
                  'Game id is not the same as the current game id.',
                )
              }

              bingoStore.setVrfRequestId(requestId)
              bingoStore.setVrfRequested(true)
              bingoStore.increaseRequestRandomNumbersRefund(refundAmount)
              bingoStore.increaseRequestRandomnessPayment(requestPrice)
              bingoStore.decreasePrizePoolBalance(requestPrice + refundAmount)

              processAndPrintLog({
                logName: eventName,
                logArgs: args,
                useToast: true,
                toastMessage:
                  'Randomness requested! Waiting for the Verifiable Randomness Function (VRF) callback...',
                toastOptions: {
                  timeout: 2 * 1000,
                },
              })
            } catch (error) {
              console.error(`${eventName} error`, error)
            }
          }
        },
      })

      publicClient.watchContractEvent({
        ...bingoContractEventFilter,
        eventName: 'DrawnNumbersFilled',
        onLogs: async (logs) => {
          const uniqueLogs = getUniqueLogs(logs)
          for (const { eventName, args } of uniqueLogs) {
            try {
              const {
                gameId,
                drawnNumbersTimestamp: drawnNumbersTimestampFromLog,
              } = args

              // TODO: think about the game id, maybe we can check if the game id is the same as the current game id
              if (bingoStore.availableGameId !== gameId) {
                throw new Error(
                  'Game id is not the same as the current game id.',
                )
              }

              await sleep(10 * 1000)

              while (true) {
                const [
                  drawnNumbersTimestamp,
                  drawnNumbers,
                  FINALIZATION_COOLDOWN,
                ] = await Promise.all([
                  bingoContractPublic.read.drawnNumbersTimestamp([gameId]),
                  bingoContractPublic.read.drawnNumbers([gameId]),
                  bingoContractPublic.read.FINALIZATION_COOLDOWN(),
                ])

                if (drawnNumbersTimestamp === drawnNumbersTimestampFromLog) {
                  bingoStore.setDrawnNumbersTimestamp(drawnNumbersTimestamp)
                  bingoStore.setDrawnNumbers([...drawnNumbers])

                  const drawnNumbersWithTimestamp = drawnNumbers.map(
                    (number, index) => ({
                      number,
                      timestamp:
                        Number(drawnNumbersTimestamp) +
                        index * drawnNumbersIntervalInSec +
                        drawnNumbersAdditionalTimeInSec +
                        Number(FINALIZATION_COOLDOWN),
                    }),
                  )

                  bingoStore.setDrawnNumbersWithTimestamp(
                    drawnNumbersWithTimestamp,
                  )
                  bingoStore.setIsDrawnNumbersFilled(true)

                  break
                }

                await sleep(0.1 * 1000)
              }

              processAndPrintLog({
                logName: eventName,
                useToast: true,
                toastMessage: `Drawn numbers filled! The game will begin in a few minutes. Submit your card numbers and wait for the game to start.`,
              })
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          }
        },
      })

      // TODO: implement reward claimed
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

  const setInitializeValues = async (
    playerAddress?: null | Address,
    gameId?: bigint,
  ) => {
    playerAddress = (playerAddress ??
      accountInfo.address.value ??
      zeroAddress) as Address

    gameId = gameId ?? 0n

    const [
      availableGameId,
      isPlayerExists,
      [winners, winnersCursor],
      [players, playersCursor],
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
    ] = await Promise.all([
      bingoContractPublic.read.availableGameId(),
      bingoContractPublic.read.isPlayerExists([gameId, playerAddress]),
      bingoContractPublic.read.winners([gameId, 0n, 100n]),
      bingoContractPublic.read.players([gameId, 0n, 100n]),
      bingoContractPublic.read.drawnNumbers([gameId]),
      bingoContractPublic.read.winningDrawnNumberIndex([gameId]),
      bingoContractPublic.read.drawnNumbersTimestamp([gameId]),
      bingoContractPublic.read.isDrawnNumbersFilled([gameId]),
      bingoContractPublic.read.isGameFinished([gameId]),
      bingoContractPublic.read.vrfRequested([gameId]),
      bingoContractPublic.read.vrfRequestId([gameId]),
      bingoContractPublic.read.prizePoolBalance([gameId]),
      bingoContractPublic.read.requestRandomnessPayment([gameId]),
      bingoContractPublic.read.requestRandomNumbersRefund([gameId]),
      bingoContractPublic.read.MIN_VRF_REQUEST_RETRY_INTERVAL(),
      bingoContractPublic.read.MIN_VRF_CALLBACK_GAS_LIMIT(),
      bingoContractPublic.read.MAX_VRF_CALLBACK_GAS_LIMIT(),
      bingoContractPublic.read.VRF_NUM_WORDS(),
      bingoContractPublic.read.VRF_REQUEST_CONFIRMATIONS(),
      bingoContractPublic.read.i_vrfV2PlusWrapper(),
      bingoContractPublic.read.BINGO_NUMBERS_COUNT(),
      bingoContractPublic.read.BINGO_MAX_NUMBER(),
      bingoContractPublic.read.BINGO_MIN_NUMBER(),
      bingoContractPublic.read.BINGO_CARD_NUMBERS_COUNT(),
      bingoContractPublic.read.MIN_PLAYERS(),
      bingoContractPublic.read.BINGO_CARD_PRICE(),
      bingoContractPublic.read.FINALIZATION_COOLDOWN(),
    ])

    bingoStore.setWinnersCursor(winnersCursor)
    bingoStore.setPlayersCursor(playersCursor)

    bingoStore.setAvailableGameId(availableGameId)
    bingoStore.setWinners([...winners])
    bingoStore.setPlayers([...players])
    bingoStore.setDrawnNumbers([...drawnNumbers])
    bingoStore.setWinningDrawnNumberIndex(winningDrawnNumberIndex)
    bingoStore.setDrawnNumbersTimestamp(drawnNumbersTimestamp)
    bingoStore.setIsDrawnNumbersFilled(isDrawnNumbersFilled)
    bingoStore.setIsGameFinished(isGameFinished)
    bingoStore.setVrfRequested(vrfRequested)
    bingoStore.setVrfRequestId(vrfRequestId)
    bingoStore.setPrizePoolBalance(prizePoolBalance)
    bingoStore.setRequestRandomnessPayment(requestRandomnessPayment)
    bingoStore.setRequestRandomNumbersRefund(requestRandomNumbersRefund)
    bingoStore.setMinVrfRequestRetryInterval(MIN_VRF_REQUEST_RETRY_INTERVAL)
    bingoStore.setMinVrfCallbackGasLimit(MIN_VRF_CALLBACK_GAS_LIMIT)
    bingoStore.setMaxVrfCallbackGasLimit(MAX_VRF_CALLBACK_GAS_LIMIT)
    bingoStore.setVrfNumWords(VRF_NUM_WORDS)
    bingoStore.setVrfRequestConfirmations(VRF_REQUEST_CONFIRMATIONS)
    bingoStore.setVrfV2PlusWrapperAddress(VRF_V2_PLUS_WRAPPER_ADDRESS)
    bingoStore.setBingoNumbersCount(BINGO_NUMBERS_COUNT)
    bingoStore.setMaxBingoNumber(BINGO_MAX_NUMBER)
    bingoStore.setMinBingoNumber(BINGO_MIN_NUMBER)
    bingoStore.setBingoCardNumbersCount(BINGO_CARD_NUMBERS_COUNT)
    bingoStore.setMinPlayers(MIN_PLAYERS)
    bingoStore.setBingoCardPrice(BINGO_CARD_PRICE)
    bingoStore.setFinalizationCooldown(FINALIZATION_COOLDOWN)

    if (isDrawnNumbersFilled) {
      const drawnNumbersWithTimestamp = drawnNumbers.map((number, index) => ({
        number,
        timestamp:
          Number(drawnNumbersTimestamp) +
          index * drawnNumbersIntervalInSec +
          drawnNumbersAdditionalTimeInSec +
          Number(FINALIZATION_COOLDOWN),
      }))
      bingoStore.setDrawnNumbersWithTimestamp(drawnNumbersWithTimestamp)
    }

    if (isPlayerExists) {
      const player = await bingoContractPublic.read.playerDetails([
        gameId,
        playerAddress,
      ])

      setPlayerValues(player, isPlayerExists)
    }
  }

  const setPlayerValues = (
    player?: Awaited<ReturnType<typeof bingoContractPublic.read.playerDetails>>,
    isPlayerExists?: boolean,
  ) => {
    if (player) {
      playerStore.setPlayerAddress(player.playerAddress)
      playerStore.setRemainingNumbersCount(player.remainingNumbersCount)
      playerStore.setCardNumbers([...player.cardNumbers])
      playerStore.setNumberBitmap(player.numberBitmap)
    }

    playerStore.setIsPlayerExists(isPlayerExists ?? false)
  }

  return {
    initializeApp,
    setInitializeValues,
  }
})
