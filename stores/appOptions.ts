import { useToggle, useStorage } from '@vueuse/core'
import { formatUnits, hexToString } from 'viem'
import { Get } from '~/enums'
import { getEnumKeyByEnumValue, processAndPrintLog } from '~/utils'
import { transformSettings, transformTown, transformUser } from '~/transformers'
import type { CoordinateStruct, User } from '~/types'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const userGameStore = useUserGameStore()
  const connectionStore = useConnectionStore()
  const contractStore = useContractStore()
  const gameChatStore = useGameChatStore()

  const { hasMetamask, checkOnValidNetwork } = connectionStore

  const { onValidNetwork } = storeToRefs(connectionStore)

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
    sideLeave()
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
  }

  const closeModalWithResponse = (response: boolean) => {
    if (modalResultResolver.value) {
      modalResultResolver.value(response)
      modalResultResolver.value = null
    }
  }

  const sideLeave = () => {
    showSidebar.value = false

    requestAnimationFrame(() => {
      isGameInfo.value = false
      isContractInfo.value = false
      isBlockchainInfo.value = false
      isOptions.value = false
    })
  }

  const setOriginCoordinate = (newOriginCoordinate: CoordinateStruct) => {
    originCoordinate.value = newOriginCoordinate
  }

  const initializeApp = async () => {
    if (hasMetamask) {
      await userWalletStore.connect()
    }

    await checkOnValidNetwork()

    if (hasMetamask && !onValidNetwork.value) {
      try {
        await userWalletStore.walletClient.switchChain({
          id: userWalletStore.chainClient.chain.id,
        })
      } catch (error: any) {
        const isUserRejected = error?.message
          .toLowerCase()
          .includes('user reject')
        if (!isUserRejected) {
          await userWalletStore.walletClient.addChain({
            chain: userWalletStore.chainClient.chain,
          })
        }
      }
    }

    if (onValidNetwork.value && !initialized.value) {
      initialized.value = true

      const {
        health,
        mana,
        energy,
        armor,
        coordinate,
        name,
        exp,
        levelId,
        referrer,
        townInfo,
        timer,
        charPoint,
      } = transformUser(
        await contractStore.getKta.read.userByAddr([userWalletStore.address]),
      )

      const userInfo = {
        health,
        mana,
        energy,
        armor,
        coordinate,
        name,
        exp,
        levelId,
        referrer,
        townInfo,
        timer,
        charPoint,
      }

      const [
        isRegisteredVal,
        townVal,
        symbolVal,
        decimalsVal,
        allowanceVal,
        balanceOfVal,
        settingsVal,
      ] = await Promise.all([
        contractStore.getKta.read.isRegistered([userWalletStore.address]),
        contractStore.getKta.read.townById([userInfo.townInfo.townId]),
        contractStore.getKtaToken.read.symbol(),
        contractStore.getKtaToken.read.decimals(),
        contractStore.getKtaToken.read.allowance([
          userWalletStore.address,
          contractStore.getKta.address,
        ]),
        contractStore.getKtaToken.read.balanceOf([userWalletStore.address]),
        contractStore.getKta.read.settings(),
      ])

      userGameStore.setIsRegistered(isRegisteredVal)
      userGameStore.setUser(userInfo)
      userGameStore.setUserCoordinate(userInfo.coordinate)
      userGameStore.setTown(transformTown(townVal))
      setOriginCoordinate(userInfo.coordinate)
      userWalletStore.setKtaSymbol(symbolVal)
      userWalletStore.setKtaDecimals(decimalsVal)
      userWalletStore.setKtaAllowance(allowanceVal)
      userWalletStore.setKtaBalance(balanceOfVal)
      userGameStore.setSettings(transformSettings(settingsVal))

      userWalletStore.chainClient.watchBlockNumber({
        onBlockNumber: (blockNumber) => {
          userWalletStore.setCurrentBlockNumber(blockNumber)
        },
      })

      // TODO: watchContractEvent json rpc ile calismiyor
      if (hasMetamask) {
        // TODO: eventler startGameEvents fonksiyonunda eklenecek
        const ktaEventFilter = {
          address: contractStore.getKta.address,
          abi: contractStore.getKta.abi,
          strict: true,
          onError: (error: Error) => console.log(error),
        } as const

        const ktaTokenEventFilter = {
          address: contractStore.getKtaToken.address,
          abi: contractStore.getKtaToken.abi,
          strict: true,
          onError: (error: Error) => console.log(error),
        } as const

        const ktaGameChatEventFilter = {
          address: contractStore.getKtaGameChat.address,
          abi: contractStore.getKtaGameChat.abi,
          strict: true,
          onError: (error: Error) => console.log(error),
        } as const

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'UserMoved',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { user, oldCoordinate, newCoordinate } = args

                const oldX = oldCoordinate._x.toString()
                const oldY = oldCoordinate._y.toString()
                const newX = newCoordinate._x.toString()
                const newY = newCoordinate._y.toString()
                const oldCoordinateMapKey = `${oldX},${oldY}`
                const newCoordinateMapKey = `${newX},${newY}`

                if (oldCoordinateMapKey !== newCoordinateMapKey) {
                  if (
                    userGameStore.userCountByCoordinate.has(oldCoordinateMapKey)
                  ) {
                    userGameStore.userCountByCoordinate.set(
                      oldCoordinateMapKey,
                      (userGameStore.userCountByCoordinate.get(
                        oldCoordinateMapKey,
                      ) ?? 1) - 1,
                    )
                  }
                }

                if (
                  userGameStore.userCountByCoordinate.has(newCoordinateMapKey)
                ) {
                  userGameStore.userCountByCoordinate.set(
                    newCoordinateMapKey,
                    (userGameStore.userCountByCoordinate.get(
                      newCoordinateMapKey,
                    ) ?? 0) + 1,
                  )
                }

                const isUserAddress = areAddressesEqual(
                  user,
                  userWalletStore.address,
                )

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserAddress,
                  refreshUserInfo: isUserAddress,
                  addToLogMessages: true,
                  toastMessage: 'You moved to new coordinate!',
                })

                if (isUserAddress) {
                  userGameStore.setUserCoordinate(newCoordinate)
                }
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'UserRegistered',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { user } = args

                const isUserAddress = areAddressesEqual(
                  user,
                  userWalletStore.address,
                )

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserAddress,
                  refreshUserInfo: isUserAddress,
                  addToLogMessages: true,
                  toastMessage: 'Welcome to TownyFi!',
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'UserMissed',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { attacker, defender } = args
                const isUserAttacker = areAddressesEqual(
                  attacker,
                  userWalletStore.address,
                )
                const isUserDefender = areAddressesEqual(
                  defender,
                  userWalletStore.address,
                )
                const toastMessage = isUserAttacker
                  ? 'Your attack was dodged!'
                  : 'You dodged the attack!'
                const isUserInvolved = isUserAttacker || isUserDefender

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserInvolved,
                  refreshUserInfo: isUserInvolved,
                  addToLogMessages: true,
                  toastMessage,
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'UserGot',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { user, something } = args

                const isUserAddress = areAddressesEqual(
                  user,
                  userWalletStore.address,
                )

                const somethingStr = getEnumKeyByEnumValue(Get, something)
                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserAddress,
                  refreshUserInfo: isUserAddress,
                  addToLogMessages: true,
                  toastMessage: `You got ${somethingStr ?? 'something'}!`,
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'UserAttacked',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { attacker, defender } = args

                const isUserAttacker = areAddressesEqual(
                  attacker,
                  userWalletStore.address,
                )
                const isUserDefender = areAddressesEqual(
                  defender,
                  userWalletStore.address,
                )
                const toastMessage = isUserAttacker
                  ? 'You attacked!'
                  : 'You were attacked!'
                const isUserInvolved = isUserAttacker || isUserDefender

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserInvolved,
                  refreshUserInfo: isUserInvolved,
                  addToLogMessages: true,
                  toastMessage,
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaEventFilter,
          eventName: 'TownWarDetailsEvent',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { winnerTownId, loserTownId } = args
                const { warLogs: _, ...filteredArgs } = args
                const userTownId = userGameStore.user.townInfo.townId
                const isUserWinner = userTownId === winnerTownId
                const isUserLoser = userTownId === loserTownId
                const isUserInvolved = isUserWinner || isUserLoser
                const toastMessage = isUserWinner
                  ? 'You won the war!'
                  : 'You lost the war!'

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: filteredArgs,
                  useToast: isUserInvolved,
                  refreshUserInfo: false,
                  addToLogMessages: true,
                  toastMessage,
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaGameChatEventFilter,
          eventName: 'Message',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { user: author, message } = args
                const messageStr = hexToString(message, { size: 32 })
                gameChatStore.addChatMessages({
                  body: messageStr,
                  author,
                  date: new Date(),
                })
                const isUserMentioned = messageStr.includes(
                  ` @${hexToString(userGameStore.user.name, {
                    size: 32,
                  })}`,
                )
                const isUserAuthor = areAddressesEqual(
                  author,
                  userWalletStore.address,
                )

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserMentioned && !isUserAuthor,
                  refreshUserInfo: false,
                  addToLogMessages: isUserMentioned && !isUserAuthor,
                  toastMessage: 'You got a message!',
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaTokenEventFilter,
          eventName: 'Approval',
          args: {
            owner: userWalletStore.address,
            spender: contractStore.getKta.address,
          },
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { value } = args

                userWalletStore.setKtaAllowance(value)

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: true,
                  refreshUserInfo: false,
                  addToLogMessages: false,
                  toastMessage: 'You approved the Game Token!',
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.chainClient.watchContractEvent({
          ...ktaTokenEventFilter,
          eventName: 'Transfer',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const log of uniqueLogs) {
                const { eventName, args } = log
                const { from, to, value } = args
                const isUserSender = areAddressesEqual(
                  from,
                  userWalletStore.address,
                )
                const isUserReceiver = areAddressesEqual(
                  to,
                  userWalletStore.address,
                )
                const isUserInvolved = isUserSender || isUserReceiver

                const valueFormat = formatUnits(
                  value,
                  userWalletStore.ktaDecimals,
                )

                const toastMessage = isUserSender
                  ? `You sent ${valueFormat} Game Token!\n`
                  : `You received ${valueFormat} Game Token!\n`

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserInvolved,
                  refreshUserInfo: false,
                  addToLogMessages: false,
                  toastMessage,
                })

                if (isUserInvolved) {
                  userWalletStore.setKtaBalance(
                    await contractStore.getKtaToken.read.balanceOf([
                      userWalletStore.address,
                    ]),
                  )
                }
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })
      }
    }
  }

  const setUserInfo = async (userInfo: User) => {
    userGameStore.setIsRegistered(
      await contractStore.getKta.read.isRegistered([userWalletStore.address]),
    )
    userGameStore.setUser(userInfo)
    userGameStore.setUserCoordinate(userInfo.coordinate)
    userGameStore.setTown(
      transformTown(
        await contractStore.getKta.read.townById([userInfo.townInfo.townId]),
      ),
    )
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
