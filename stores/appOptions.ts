import { useToggle, useStorage } from '@vueuse/core'
import { formatUnits, type WatchContractEventReturnType } from 'viem'
import { TYPE } from 'vue-toastification'
import { transformSettings, transformTown, transformUser } from '~/transformers'
import type { CoordinateStruct, User } from '~/types/contract'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const userGameStore = useUserGameStore()
  const connectionStore = useConnectionStore()
  const contractStore = useContractStore()

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
  const logMessages = ref<string[]>([])
  const modalResultResolver = ref<((value: unknown) => void) | null>(null)
  const userMovedEvent = ref<WatchContractEventReturnType | null>(null)
  const userRegisteredEvent = ref<WatchContractEventReturnType | null>(null)
  const userMissedEvent = ref<WatchContractEventReturnType | null>(null)
  const userAttackedEvent = ref<WatchContractEventReturnType | null>(null)
  const approvalEvent = ref<WatchContractEventReturnType | null>(null)
  const transferEvent = ref<WatchContractEventReturnType | null>(null)

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
        const ktaContractEventFilter = {
          address: contractStore.getKta.address,
          abi: contractStore.getKta.abi,
          strict: true,
        } as const

        const ktaTokenContractEventFilter = {
          address: contractStore.getKtaToken.address,
          abi: contractStore.getKtaToken.abi,
          strict: true,
        } as const

        if (!userMovedEvent.value) {
          userMovedEvent.value = userWalletStore.chainClient.watchContractEvent(
            {
              ...ktaContractEventFilter,
              eventName: 'UserMoved',
              onLogs: async (logs) => {
                try {
                  const isExistByLog: Record<string, boolean> = {}
                  const logsLen = logs.length

                  for (const log of logs) {
                    if (logsLen > 1) {
                      const hash = await createSha256Hash(JSON.stringify(log))
                      if (isExistByLog[hash]) {
                        continue
                      }
                      isExistByLog[hash] = true
                    }

                    const { eventName, args } = log
                    const { user, oldCoordinate, newCoordinate } = args

                    const oldX = oldCoordinate._x.toString()
                    const oldY = oldCoordinate._y.toString()
                    const newX = newCoordinate._x.toString()
                    const newY = newCoordinate._y.toString()
                    const oldCoordinateMapKey = `${oldX},${oldY}`
                    const newCoordinateMapKey = `${newX},${newY}`

                    if (oldCoordinateMapKey !== newCoordinateMapKey) {
                      if (
                        userGameStore.userCountByCoordinate.has(
                          oldCoordinateMapKey,
                        )
                      ) {
                        userGameStore.userCountByCoordinate.set(
                          oldCoordinateMapKey,
                          userGameStore.userCountByCoordinate.get(
                            oldCoordinateMapKey,
                          ) ?? 1 - 1,
                        )
                      }
                    }

                    if (
                      userGameStore.userCountByCoordinate.has(
                        newCoordinateMapKey,
                      )
                    ) {
                      userGameStore.userCountByCoordinate.set(
                        newCoordinateMapKey,
                        userGameStore.userCountByCoordinate.get(
                          newCoordinateMapKey,
                        ) ?? 0 + 1,
                      )
                    }

                    const eventMessage = `Event: ${eventName}`
                    const argsMessage = formatEventArgs(args)

                    addLogMessage(`${eventMessage}\n${argsMessage}`)

                    if (!areAddressesEqual(user, userWalletStore.address)) {
                      continue
                    }

                    userGameStore.setUserProperty('coordinate', newCoordinate)
                    userGameStore.setUserCoordinate(userInfo.coordinate)

                    const toastMsg = `You moved to new coordinate!\n${eventMessage}\n${argsMessage}`

                    useAppToast(TYPE.INFO, toastMsg)
                  }
                } catch (error) {
                  console.error(`${logs[0].eventName} error`, error)
                }
              },
            },
          )
        }

        if (!userRegisteredEvent.value) {
          userRegisteredEvent.value =
            userWalletStore.chainClient.watchContractEvent({
              ...ktaContractEventFilter,
              eventName: 'UserRegistered',
              onLogs: async (logs) => {
                try {
                  const isExistByLog: Record<string, boolean> = {}
                  const logsLen = logs.length

                  for (const log of logs) {
                    if (logsLen > 1) {
                      const hash = await createSha256Hash(JSON.stringify(log))
                      if (isExistByLog[hash]) {
                        continue
                      }
                      isExistByLog[hash] = true
                    }

                    const { eventName, args } = log
                    const { user } = args

                    const eventMessage = `Event: ${eventName}`
                    const argsMessage = formatEventArgs(args)

                    addLogMessage(`${eventMessage}\n${argsMessage}`)

                    if (!areAddressesEqual(user, userWalletStore.address)) {
                      continue
                    }
                    const toastMsg = `Welcome to TownyFi!\n${eventMessage}\n${argsMessage}`

                    const userInfo = transformUser(
                      await contractStore.getKta.read.userByAddr([
                        userWalletStore.address,
                      ]),
                    )

                    await setUserInfo(userInfo)

                    useAppToast(TYPE.INFO, toastMsg)
                  }
                } catch (error) {
                  console.error(`${logs[0].eventName} error`, error)
                }
              },
            })
        }

        if (!userMissedEvent.value) {
          userMissedEvent.value =
            userWalletStore.chainClient.watchContractEvent({
              ...ktaContractEventFilter,
              eventName: 'UserMissed',
              onLogs: async (logs) => {
                try {
                  const isExistByLog: Record<string, boolean> = {}
                  const logsLen = logs.length

                  for (const log of logs) {
                    if (logsLen > 1) {
                      const hash = await createSha256Hash(JSON.stringify(log))
                      if (isExistByLog[hash]) {
                        continue
                      }
                      isExistByLog[hash] = true
                    }

                    const { eventName, args } = log
                    const { attacker, defender } = args
                    const isUserAttacker = areAddressesEqual(
                      attacker,
                      userWalletStore.address,
                    )

                    const eventMessage = `Event: ${eventName}`
                    const argsMessage = formatEventArgs(args)

                    addLogMessage(`${eventMessage}\n${argsMessage}`)

                    if (
                      !isUserAttacker &&
                      !areAddressesEqual(defender, userWalletStore.address)
                    ) {
                      continue
                    }

                    const toastMsg =
                      (isUserAttacker
                        ? 'Your attack was dodged!\n'
                        : 'You dodged the attack!\n') +
                      `${eventMessage}\n${argsMessage}`

                    useAppToast(TYPE.INFO, toastMsg)
                  }
                } catch (error) {
                  console.error(`${logs[0].eventName} error`, error)
                }
              },
            })
        }

        if (!userAttackedEvent.value) {
          userAttackedEvent.value =
            userWalletStore.chainClient.watchContractEvent({
              ...ktaContractEventFilter,
              eventName: 'UserAttacked',
              onLogs: async (logs) => {
                try {
                  const isExistByLog: Record<string, boolean> = {}
                  const logsLen = logs.length

                  for (const log of logs) {
                    if (logsLen > 1) {
                      const hash = await createSha256Hash(JSON.stringify(log))
                      if (isExistByLog[hash]) {
                        continue
                      }
                      isExistByLog[hash] = true
                    }

                    const { eventName, args } = log
                    const { attacker, defender } = args
                    const isUserAttacker = areAddressesEqual(
                      attacker,
                      userWalletStore.address,
                    )

                    const eventMessage = `Event: ${eventName}`
                    const argsMessage = formatEventArgs(args)

                    addLogMessage(`${eventMessage}\n${argsMessage}`)
                    if (
                      !isUserAttacker &&
                      !areAddressesEqual(defender, userWalletStore.address)
                    ) {
                      continue
                    }

                    const toastMsg =
                      (isUserAttacker
                        ? 'You attacked!\n'
                        : 'You were attacked!\n') +
                      `${eventMessage}\n${argsMessage}`

                    useAppToast(TYPE.INFO, toastMsg)
                  }
                } catch (error) {
                  console.error(`${logs[0].eventName} error`, error)
                }
              },
            })
        }

        if (!approvalEvent.value) {
          approvalEvent.value = userWalletStore.chainClient.watchContractEvent({
            ...ktaTokenContractEventFilter,
            eventName: 'Approval',
            args: {
              owner: userWalletStore.address,
              spender: contractStore.getKta.address,
            },
            onLogs: async (logs) => {
              try {
                const isExistByLog: Record<string, boolean> = {}
                const logsLen = logs.length

                for (const log of logs) {
                  if (logsLen > 1) {
                    const hash = await createSha256Hash(JSON.stringify(log))
                    if (isExistByLog[hash]) {
                      continue
                    }
                    isExistByLog[hash] = true
                  }

                  const { eventName, args } = log
                  const { value } = args

                  userWalletStore.setKtaAllowance(value)

                  const toastMsg =
                    `You approved Game Token!\n` +
                    `Event: ${eventName}\n` +
                    `${formatEventArgs(args)}`

                  useAppToast(TYPE.INFO, toastMsg)
                }
              } catch (error) {
                console.error(`${logs[0].eventName} error`, error)
              }
            },
          })
        }

        if (!transferEvent.value) {
          transferEvent.value = userWalletStore.chainClient.watchContractEvent({
            ...ktaTokenContractEventFilter,
            eventName: 'Transfer',
            onLogs: async (logs) => {
              try {
                const isExistByLog: Record<string, boolean> = {}
                const logsLen = logs.length

                for (const log of logs) {
                  if (logsLen > 1) {
                    const hash = await createSha256Hash(JSON.stringify(log))
                    if (isExistByLog[hash]) {
                      continue
                    }
                    isExistByLog[hash] = true
                  }

                  const { eventName, args } = log
                  const { from, to, value } = args
                  const isUserSender = areAddressesEqual(
                    from,
                    userWalletStore.address,
                  )

                  if (
                    !isUserSender &&
                    !areAddressesEqual(to, userWalletStore.address)
                  ) {
                    continue
                  }

                  userWalletStore.setKtaBalance(
                    await contractStore.getKtaToken.read.balanceOf([
                      userWalletStore.address,
                    ]),
                  )

                  const valueFormat = formatUnits(
                    value,
                    userWalletStore.ktaDecimals,
                  )

                  const toastMsg =
                    (isUserSender
                      ? `You sent ${valueFormat} Game Token!\n`
                      : `You received ${valueFormat} Game Token!\n`) +
                    `Event: ${eventName}\n` +
                    `${formatEventArgs(args)}`

                  useAppToast(TYPE.INFO, toastMsg)
                }
              } catch (error) {
                console.error(`${logs[0].eventName} error`, error)
              }
            },
          })
        }
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

  const addLogMessage = (message: string) => {
    if (logMessages.value.length >= 5000) {
      logMessages.value.shift()
    }
    logMessages.value.push(message)
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
    logMessages,
  }
})
