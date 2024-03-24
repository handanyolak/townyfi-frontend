import { useToggle, useStorage } from '@vueuse/core'
import { ethers } from 'ethers'
import { TYPE } from 'vue-toastification'
import { transformTown } from '~/transformers'
import { KillThemAll__factory, KtaToken__factory } from '~/types'
import type { Coordinates } from '~/types/typechain/contracts/game/IKillThemAll'
import type { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  // --------[ Nuxt Imports ]-------- //
  const {
    public: { ktaAddress, ktaTokenAddress },
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

        const ktaToken = KtaToken__factory.connect(
          ktaTokenAddress,
          userWalletStore.getSigner,
        )

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
          await ktaToken.allowance(userWalletStore.address, ktaAddress),
        )
        userWalletStore.setKtaBalance(
          await ktaToken.balanceOf(userWalletStore.address),
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

        // TODO: startGameEvents fonksiyonunda eklenecek
        kta.on(
          kta.filters.UserMoved,
          (user, oldCoordinate, newCoordinate, event) => {
            const oldCoordinateMapKey = `${oldCoordinate._x.toString()},${oldCoordinate._y.toString()}`
            if (userGameStore.userCountByCoordinate.has(oldCoordinateMapKey)) {
              const oldCoordinateUserLength =
                userGameStore.userCountByCoordinate.get(
                  oldCoordinateMapKey,
                ) as number

              userGameStore.userCountByCoordinate.set(
                oldCoordinateMapKey,
                oldCoordinateUserLength - 1,
              )
            }

            const newCoordinateMapKey = `${newCoordinate._x.toString()},${newCoordinate._y.toString()}`
            if (userGameStore.userCountByCoordinate.has(newCoordinateMapKey)) {
              const newCoordinateUserLength =
                userGameStore.userCountByCoordinate.get(
                  newCoordinateMapKey,
                ) as number

              userGameStore.userCountByCoordinate.set(
                newCoordinateMapKey,
                newCoordinateUserLength + 1,
              )
            }

            let toastMsg = ''
            if (user === userWalletStore.address) {
              userGameStore.setUserProperty('coordinate', newCoordinate)
              userGameStore.setUserCoordinate(userInfo.coordinate)

              toastMsg += `You moved!\n` + `Event: ${event.eventName}\n`

              const argsEntries = Object.entries(event.args.toObject())
              argsEntries.forEach(([key, value], index) => {
                toastMsg += `${toCapitalizedWords(key)}: ${value}`
                if (index !== argsEntries.length - 1) {
                  toastMsg += '\n'
                }
              })

              useAppToast(TYPE.INFO, toastMsg)
            }
          },
        )

        // TODO: bu bilgiyi transaction'dan almak yerine parametre olarak alacagiz cunku frontend'e yuk biniyor.
        kta.on(kta.filters.UserRegistered, async (event) => {
          const tx = await event.getTransaction()
          const registeredAddress = tx.from

          let toastMsg = ''
          if (registeredAddress === userWalletStore.address) {
            const userInfo = await kta.userByAddr(userWalletStore.address)
            await setUserInfo(userInfo)

            toastMsg += `Welcome to TownyFi!\n` + `Event: ${event.eventName}\n`

            useAppToast(TYPE.INFO, toastMsg)
          }
        })

        kta.on(kta.filters.UserMissed, async (defender, event) => {
          const tx = await event.getTransaction()
          const fromAddress = tx.from
          let toastMsg = ''

          if (fromAddress === userWalletStore.address) {
            toastMsg += `Your attack was dodged!\n`
          }

          if (defender === userWalletStore.address) {
            toastMsg += `You dodged the attack!\n`
          }

          if (toastMsg) {
            toastMsg += `Event: ${event.eventName}\n`
          }

          const argsEntries = Object.entries(event.args.toObject())
          argsEntries.forEach(([key, value], index) => {
            toastMsg += `${toCapitalizedWords(key)}: ${value}`
            if (index !== argsEntries.length - 1) {
              toastMsg += '\n'
            }
          })

          if (toastMsg) {
            useAppToast(TYPE.INFO, toastMsg)
          }
        })

        kta.on(kta.filters.UserAttacked, async (defender, _, __, event) => {
          const tx = await event.getTransaction()
          const fromAddress = tx.from
          let toastMsg = ''

          if (fromAddress === userWalletStore.address) {
            toastMsg += `You attacked!\n`
          }

          if (defender === userWalletStore.address) {
            toastMsg += `You were attacked!\n`
          }

          if (toastMsg) {
            toastMsg += `Event: ${event.eventName}\n`
          }

          const argsEntries = Object.entries(event.args.toObject())
          argsEntries.forEach(([key, value], index) => {
            toastMsg += `${toCapitalizedWords(key)}: ${value}`
            if (index !== argsEntries.length - 1) {
              toastMsg += '\n'
            }
          })

          if (toastMsg) {
            useAppToast(TYPE.INFO, toastMsg)
          }
        })

        ktaToken.on(ktaToken.filters.Approval, (owner, spender, value) => {
          if (spender === ktaAddress && owner === userWalletStore.address) {
            userWalletStore.setKtaAllowance(value)
          }
        })

        ktaToken.on(
          ktaToken.filters.Transfer,
          async (from, to, value, event) => {
            if (
              from === userWalletStore.address ||
              to === userWalletStore.address
            ) {
              userWalletStore.setKtaBalance(
                await ktaToken.balanceOf(userWalletStore.address),
              )

              const valueFormat = ethers.formatUnits(
                value,
                await ktaToken.decimals(),
              )

              let toastMsg = ''
              if (from === userWalletStore.address) {
                toastMsg += `You sent ${valueFormat} Game Token!\n`
              }

              if (to === userWalletStore.address) {
                toastMsg += `You received ${valueFormat} Game Token!\n`
              }

              toastMsg += `Event: ${event.eventName}\n`

              const argsEntries = Object.entries(event.args.toObject())
              argsEntries.forEach(([key, value], index) => {
                toastMsg += `${toCapitalizedWords(key)}: ${value}`
                if (index !== argsEntries.length - 1) {
                  toastMsg += '\n'
                }
              })

              useAppToast(TYPE.INFO, toastMsg)
            }
          },
        )
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
