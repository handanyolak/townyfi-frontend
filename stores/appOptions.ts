import { useToggle, useStorage } from '@vueuse/core'
import { formatUnits, hexToString } from 'viem'
import DOMPurify from 'dompurify'
import { Get } from '~/enums'
import {
  getEnumKeyByEnumValue,
  processAndPrintLog,
  getDifference,
} from '~/utils'
import {
  transformSettings,
  transformTown,
  transformUser,
  transformWar,
} from '~/transformers'
import type { CoordinateStruct, User } from '~/types'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const userGameStore = useUserGameStore()
  const connectionStore = useConnectionStore()
  const contractStore = useContractStore()
  const gameChatStore = useGameChatStore()
  const appOptionStore = useAppOptionsStore()

  const { hasMetamask, checkOnValidNetwork } = connectionStore

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

  const initializeApp = async () => {
    if (hasMetamask) {
      await userWalletStore.connect()
    }

    await checkOnValidNetwork()

    if (!initialized.value) {
      initialized.value = true

      const [symbolVal, decimalsVal, balanceOfVal, blockNumberVal] =
        await Promise.all([
          contractStore.getKtaTokenPublic.read.symbol(),
          contractStore.getKtaTokenPublic.read.decimals(),

          contractStore.getKtaTokenPublic.read.balanceOf([
            userWalletStore.address,
          ]),
          userWalletStore.publicClient.getBlockNumber(),
        ])

      userWalletStore.setCurrentBlockNumber(blockNumberVal)
      userWalletStore.setKtaSymbol(symbolVal)
      userWalletStore.setKtaDecimals(decimalsVal)
      userWalletStore.setKtaBalance(balanceOfVal)

      userWalletStore.chainClient.watchBlockNumber({
        onBlockNumber: async (blockNumber) => {
          userWalletStore.setCurrentBlockNumber(blockNumber)
          userWalletStore.setBalance(
            await userWalletStore.publicClient.getBalance({
              address: userWalletStore.address,
            }),
          )
        },
      })

      // TODO: watchContractEvent doesn't work with json rpc
      if (hasMetamask) {
        // TODO: add startGameEvents function for all events

        const ktaTokenEventFilter = {
          address: contractStore.getKtaToken.address,
          abi: contractStore.getKtaToken.abi,
          strict: true,
          // onError: (error: Error) => console.error(error),
        } as const

        const ktaGameChatEventFilter = {
          address: contractStore.getKtaGameChat.address,
          abi: contractStore.getKtaGameChat.abi,
          strict: true,
          // onError: (error: Error) => console.error(error),
        } as const

        userWalletStore.publicClient.watchContractEvent({
          ...ktaGameChatEventFilter,
          eventName: 'Message',
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { user: author, message } = args
                const messageStr = hexToString(message, { size: 32 })

                const nameStr = hexToString('name', { size: 32 })
                let sanitizedMessage = DOMPurify.sanitize(messageStr, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                })
                const userMention = `@${hexToString(userGameStore.user.name, {
                  size: 32,
                })}`
                const isUserMentioned = messageStr.includes(userMention)
                if (isUserMentioned) {
                  const boldUserMention = `<b>${userMention}</b>`
                  sanitizedMessage = sanitizedMessage.replace(
                    userMention,
                    boldUserMention,
                  )
                }

                gameChatStore.addChatMessages({
                  body: sanitizedMessage,
                  author,
                  name: nameStr,
                  date: new Date(),
                })

                const isUserAuthor = areAddressesEqual(
                  author,
                  userWalletStore.address,
                )

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserMentioned && !isUserAuthor,
                  addToLogMessages: isUserMentioned && !isUserAuthor,
                  toastMessage: 'You got a message!',
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.publicClient.watchContractEvent({
          ...ktaTokenEventFilter,
          eventName: 'Approval',
          args: {
            owner: userWalletStore.address,
          },
          onLogs: async (logs) => {
            try {
              const uniqueLogs = getUniqueLogs(logs)
              for (const { eventName, args } of uniqueLogs) {
                const { value } = args

                userWalletStore.setKtaAllowance(value)

                const valueFormat = formatUnits(
                  value,
                  userWalletStore.ktaDecimals,
                )

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: true,
                  addToLogMessages: true,
                  toastMessage: `You approved ${valueFormat} ${userWalletStore.ktaSymbol}!`,
                })
              }
            } catch (error) {
              console.error(`${logs[0].eventName} error`, error)
            }
          },
        })

        userWalletStore.publicClient.watchContractEvent({
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

                if (isUserInvolved) {
                  const changeAmount = isUserSender
                    ? BigInt(value) * BigInt(-1)
                    : BigInt(value)
                  userWalletStore.setKtaBalance(
                    userWalletStore.ktaBalance + changeAmount,
                  )
                }

                const valueFormat = formatUnits(
                  value,
                  userWalletStore.ktaDecimals,
                )

                const toastMessage =
                  (isUserSender ? `You sent ` : `You received`) +
                  `${valueFormat} ${userWalletStore.ktaSymbol}\n`

                await processAndPrintLog({
                  logName: eventName,
                  logArgs: args,
                  useToast: isUserInvolved,
                  addToLogMessages: isUserInvolved,
                  toastMessage,
                })

                if (isUserInvolved) {
                  userWalletStore.setKtaBalance(
                    await contractStore.getKtaTokenPublic.read.balanceOf([
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
