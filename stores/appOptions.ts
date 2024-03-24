import { useToggle, useStorage } from '@vueuse/core'
import { formatUnits, type WatchContractEventReturnType } from 'viem'
import { TYPE } from 'vue-toastification'
import { transformTown } from '~/transformers'
import { KillThemAll__factory } from '~/types'
import type { Coordinates } from '~/types/typechain/contracts/game/IKillThemAll'
import type { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Nuxt Imports ]-------- //
  const {
    public: { ktaAddress },
  } = useRuntimeConfig()

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
  const originCoordinate = ref<Coordinates.CoordinateStruct>({
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
  const modalResultResolver = ref<((value: unknown) => void) | null>(null)
  const isAttackSuccess = ref(false)
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
    isAnimation.value = modalComponentProps.value?.hasOwnProperty('animation')
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

  const setOriginCoordinate = (
    newOriginCoordinate: Coordinates.CoordinateStruct,
  ) => {
    originCoordinate.value = newOriginCoordinate
  }

  const initializeApp = async () => {
    if (hasMetamask) {
      await userWalletStore.connect()
      await checkOnValidNetwork()

      if (onValidNetwork.value && !initialized.value) {
        initialized.value = true

        const kta = KillThemAll__factory.connect(
          ktaAddress,
          userWalletStore.getSigner,
        )

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
        } = await kta.userByAddr(userWalletStore.address)

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

        await setUserInfo(userInfo)

        setOriginCoordinate(userInfo.coordinate)

        userWalletStore.setKtaAllowance(
          await contractStore.getKtaToken.read.allowance([
            userWalletStore.address,
            contractStore.getKta.address,
          ]),
        )
        userWalletStore.setKtaBalance(
          await contractStore.getKtaToken.read.balanceOf([
            userWalletStore.address,
          ]),
        )

        const {
          max,
          price,
          rate,
          time,
          min,
          exp: settingExp,
          multiplier,
          numberDigits,
        } = await kta.settings()

        const setting = {
          max,
          price,
          rate,
          time,
          min,
          exp: settingExp,
          multiplier,
          numberDigits,
        }

        userGameStore.setSetting(setting)

        userWalletStore.walletClient.watchBlockNumber({
          onBlockNumber: (blockNumber) => {
            userWalletStore.setCurrentBlockNumber(blockNumber)
          },
        })

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
          userMovedEvent.value =
            userWalletStore.walletClient.watchContractEvent({
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

                    const newCoordinateMapKey = `${newX},${newY}`
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

                    if (!areAddressesEqual(user, userWalletStore.address)) {
                      continue
                    }

                    userGameStore.setUserProperty('coordinate', newCoordinate)
                    userGameStore.setUserCoordinate(userInfo.coordinate)

                    const toastMsg =
                      `You moved to new coordinate!\n` +
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

        if (!userRegisteredEvent.value) {
          userRegisteredEvent.value =
            userWalletStore.walletClient.watchContractEvent({
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
                    // TODO: kayit olan kisi icin UserMoved event'i tetiklenmiyor. Eklenince bu silinecek.
                    const coordinateMapKey = '0,0'
                    if (
                      userGameStore.userCountByCoordinate.has(coordinateMapKey)
                    ) {
                      userGameStore.userCountByCoordinate.set(
                        coordinateMapKey,
                        userGameStore.userCountByCoordinate.get(
                          coordinateMapKey,
                        ) ?? 0 + 1,
                      )
                    }

                    const { eventName, transactionHash: hash } = log
                    // TODO: tx'den almak yerine event'ten almaliyiz cunku client'a yuk biniyor
                    const tx =
                      await userWalletStore.walletClient.getTransaction({
                        hash,
                      })
                    const registeredAddress = tx.from

                    if (
                      !areAddressesEqual(
                        registeredAddress,
                        userWalletStore.address,
                      )
                    ) {
                      continue
                    }

                    const toastMsg =
                      `Welcome to TownyFi!\n` + `Event: ${eventName}\n`

                    const userInfo = await kta.userByAddr(
                      userWalletStore.address,
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
            userWalletStore.walletClient.watchContractEvent({
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

                    const { eventName, transactionHash: hash, args } = log
                    const { defender } = args
                    // TODO: tx'den almak yerine event'ten almaliyiz cunku client'a yuk biniyor
                    const tx =
                      await userWalletStore.walletClient.getTransaction({
                        hash,
                      })
                    const attacker = tx.from
                    const isUserAttacker = areAddressesEqual(
                      attacker,
                      userWalletStore.address,
                    )
                    if (
                      !isUserAttacker &&
                      !areAddressesEqual(defender, userWalletStore.address)
                    ) {
                      continue
                    }

                    const toastMsg = isUserAttacker
                      ? 'Your attack was dodged!\n'
                      : 'You dodged the attack!\n' +
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

        if (!userAttackedEvent.value) {
          userAttackedEvent.value =
            userWalletStore.walletClient.watchContractEvent({
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

                    const { eventName, transactionHash: hash, args } = log
                    const { defender } = args
                    // TODO: tx'den almak yerine event'ten almaliyiz cunku client'a yuk biniyor
                    const tx =
                      await userWalletStore.walletClient.getTransaction({
                        hash,
                      })
                    const attacker = tx.from
                    const isUserAttacker = areAddressesEqual(
                      attacker,
                      userWalletStore.address,
                    )
                    if (
                      !isUserAttacker &&
                      !areAddressesEqual(defender, userWalletStore.address)
                    ) {
                      continue
                    }

                    const toastMsg = isUserAttacker
                      ? 'You attacked!\n'
                      : 'You were attacked!\n' +
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

        if (!approvalEvent.value) {
          approvalEvent.value = userWalletStore.walletClient.watchContractEvent(
            {
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
            },
          )
        }

        if (!transferEvent.value) {
          transferEvent.value = userWalletStore.walletClient.watchContractEvent(
            {
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
                      await contractStore.getKtaToken.read.decimals(),
                    )

                    const toastMsg = isUserSender
                      ? `You sent ${valueFormat} Game Token!\n`
                      : `You received ${valueFormat} Game Token!\n` +
                        `Event: ${eventName}\n` +
                        `${formatEventArgs(args)}`

                    useAppToast(TYPE.INFO, toastMsg)
                  }
                } catch (error) {
                  console.error(`${logs[0].eventName} error`, error)
                }
              },
            },
          )
        }
      }
    }
  }

  const setUserInfo = async (userInfo: IKillThemAll.UserStruct) => {
    userGameStore.setIsRegistered(
      await contractStore.getKta.read.isRegistered([userWalletStore.address]),
    )
    userGameStore.setUser(userInfo)
    userGameStore.setUserCoordinate(userInfo.coordinate)
    userGameStore.setTown(
      transformTown(
        // TODO: avoid any
        await contractStore.getKta.read.townById([
          userInfo.townInfo.townId as any,
        ]),
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
