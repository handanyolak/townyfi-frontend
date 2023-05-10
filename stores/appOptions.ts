import { useToggle, useStorage } from '@vueuse/core'
import { IKillThemAll, Coordinates } from '~/types/typechain/KillThemAll'
import {
  KillThemAll__factory,
  KtaToken__factory,
  MultiCall__factory,
} from '~/types/typechain'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  //--------[ Nuxt Imports ]--------//
  const { ktaAddress, ktaTokenAddress, multiCallAddress } =
    useRuntimeConfig().public

  //--------[ Stores ]--------//
  const userWalletStore = useUserWalletStore()
  const userGameStore = useUserGameStore()
  const connectionStore = useConnectionStore()

  const { setCurrentBlockNumber, connect, setKtaAllowance } = userWalletStore
  const { hasMetamask, setKtaToken, setKta, setMultiCall } = connectionStore
  const {
    setUser,
    setSetting,
    setUserProperty,
    setIsRegistered,
    setUserCoordinate,
    setTown,
  } = userGameStore

  const { onValidNetwork, getKta, getProvider } = storeToRefs(connectionStore)
  const { address, getSigner } = storeToRefs(userWalletStore)
  const { userCountByCoordinate } = storeToRefs(userGameStore)

  //--------[ States ]--------//
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

  //--------[ Actions ]--------//
  const setModalInfo = (
    newModalComponentName: string,
    newModalComponentProps?: any
  ) => {
    modalComponentName.value = newModalComponentName
    modalComponentProps.value = newModalComponentProps
  }
  const clearModalInfo = () => {
    modalComponentName.value = ''
    modalComponentProps.value = {}
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
    newOriginCoordinate: Coordinates.CoordinateStruct
  ) => {
    originCoordinate.value = newOriginCoordinate
  }

  const initializeApp = async () => {
    if (hasMetamask) {
      await connect()

      if (onValidNetwork.value && !initialized.value) {
        initialized.value = true

        const ktaToken = KtaToken__factory.connect(
          ktaTokenAddress,
          getSigner.value
        )

        const kta = KillThemAll__factory.connect(ktaAddress, getSigner.value)

        const multiCall = MultiCall__factory.connect(
          multiCallAddress,
          getSigner.value
        )

        setKtaToken(ktaToken)
        setKta(kta)
        setMultiCall(multiCall)

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
        } = await kta.userByAddr(address.value)

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

        setKtaAllowance(await ktaToken.allowance(address.value, ktaAddress))

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

        setSetting(setting)

        setCurrentBlockNumber(await getProvider.value.getBlockNumber())

        getProvider.value.on('block', (blockNumber: number) => {
          setCurrentBlockNumber(blockNumber)
        })

        // TODO: Ethers v6 events not working yet
        // TODO: startGameEvents fonksiyonunda eklenecek
        kta.on(
          kta.filters.UserMoved,
          async (
            user,
            oldCoordinate, // oldCoordinate: Coordinates.CoordinateStruct,
            newCoordinate
          ) => {
            const oldCoordinateMapKey = `${oldCoordinate._x.toString()},${oldCoordinate._y.toString()}`
            if (userCountByCoordinate.value.has(oldCoordinateMapKey)) {
              const oldCoordinateUserLength = userCountByCoordinate.value.get(
                oldCoordinateMapKey
              ) as number

              userCountByCoordinate.value.set(
                oldCoordinateMapKey,
                oldCoordinateUserLength - 1
              )
            }

            const newCoordinateMapKey = `${newCoordinate._x.toString()},${newCoordinate._y.toString()}`
            if (userCountByCoordinate.value.has(newCoordinateMapKey)) {
              const newCoordinateUserLength = userCountByCoordinate.value.get(
                newCoordinateMapKey
              ) as number

              userCountByCoordinate.value.set(
                newCoordinateMapKey,
                newCoordinateUserLength + 1
              )
            }

            if (user === address.value) {
              useAppToast('info', `New Coordinate: ${newCoordinate}`)
              setUserProperty('coordinate', newCoordinate)
              userGameStore.setUserCoordinate(userInfo.coordinate)
            }
          }
        )

        // TODO: bu bilgiyi transaction'dan almak yerine parametre olarak alacagiz cunku frontend'e yuk biniyor.
        kta.on(kta.filters.UserRegistered, async (event) => {
          const tx = await event.getTransaction()
          const registeredAddress = tx.from

          if (registeredAddress === address.value) {
            const userInfo = await kta.userByAddr(address.value)
            await setUserInfo(userInfo)
          }
        })

        await ktaToken.on(
          ktaToken.filters.Approval,
          (owner, spender, value) => {
            if (spender === ktaAddress && owner === address.value) {
              setKtaAllowance(value)
            }
          }
        )
      }
    }
  }

  const setUserInfo = async (userInfo: IKillThemAll.UserStruct) => {
    setIsRegistered(await getKta.value.isRegistered(address.value))
    setUser(userInfo)
    setUserCoordinate(userInfo.coordinate)
    setTown((await getKta.value.townById(userInfo.townInfo.townId)) as any)
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
        (await import('~/assets/sound/in-dreams.mp3')).default
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
    sideLeave,
    toggleMusic,
    setUserInfo,
    toggleAudio,
    initializeApp,
    setOriginCoordinate,
    setModalInfo,
    clearModalInfo,
  }
})
