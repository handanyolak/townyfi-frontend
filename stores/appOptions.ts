import { ContractEventPayload } from 'ethers'
import { useToggle, useStorage } from '@vueuse/core'
import { IKillThemAll, Coordinates } from '~/types/typechain/KillThemAll'
import { KillThemAll__factory, KtaToken__factory } from '~/types/typechain'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  /**
   * Nuxt Imports
   */
  const { ktaAddress, ktaTokenAddress } = useRuntimeConfig().public

  /**
   * Stores
   */
  const userWalletStore = useUserWalletStore()
  const { address, getSigner } = storeToRefs(userWalletStore)
  const { setCurrentBlockNumber, connect, setKtaAllowance } = userWalletStore
  const connectionStore = useConnectionStore()
  const { hasMetamask, setKtaToken, setKta } = connectionStore
  const { onValidNetwork, getKta, getProvider } = storeToRefs(connectionStore)
  const userGameStore = useUserGameStore()
  const {
    setUser,
    setSetting,
    setUserProperty,
    setIsRegistered,
    setUserCoordinate,
  } = userGameStore

  /**
   * States
   */
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

  /**
   * Actions
   */
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

        setKtaToken(ktaToken)
        setKta(kta)

        const userInfo = await kta.userByAddr(address.value)
        await setUserInfo(userInfo)

        setOriginCoordinate(userInfo.coordinate)

        setKtaAllowance(await ktaToken.allowance(address.value, ktaAddress))

        setSetting(await kta.settings())

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
            _, // oldCoordinate: Coordinates.CoordinateStruct,
            newCoordinate
          ) => {
            useTownyToast('info', `New Coordinate: ${newCoordinate}`)
            if (user === address.value) {
              setUserProperty('coordinate', newCoordinate)
              userGameStore.setUserCoordinate(userInfo.coordinate)
            }
          }
        )

        // TODO: bu bilgiyi transaction'dan almak yerine parametre olarak alacagiz cunku frontend'e yuk biniyor.
        // kta.on(kta.filters.UserRegistered, async (event) => {
        //   const tx = await event.getTransaction()
        //   const registeredAddress = tx.from

        //   if (registeredAddress === address.value) {
        //     const userInfo = await kta.userByAddr(address.value)
        //     await setUserInfo(userInfo)
        //   }
        // })

        await ktaToken.on(
          ktaToken.filters.Approval,
          (owner, spender, value) => {
            if (owner === address.value && spender === ktaAddress) {
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
    sideLeave,
    toggleMusic,
    setUserInfo,
    toggleAudio,
    initializeApp,
    setOriginCoordinate,
  }
})
