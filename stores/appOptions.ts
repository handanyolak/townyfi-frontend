import { Event, BigNumber } from 'ethers'
import { useToggle, useStorage } from '@vueuse/core'

export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  const connectionStore = useConnectionStore()
  const userGameStore = useUserGameStore()
  const userWalletStore = useUserWalletStore()
  const { hasMetamask, provider } = connectionStore
  const { onValidNetwork } = storeToRefs(connectionStore)
  const {
    setUser,
    setUserCoordinate,
    setUserProperty,
    setIsRegistered,
    setSetting,
  } = userGameStore
  const { setCurrentBlockNumber, connect, setKtaAllowance } = userWalletStore
  const { address } = storeToRefs(userWalletStore)
  const kta = useKta()
  const ktaToken = useKtaToken()

  const initialized = ref(false)
  const showSidebar = ref(false)
  const isGameInfo = ref(false)
  const isContractInfo = ref(false)
  const isBlockchainInfo = ref(false)
  const isOptions = ref(false)

  const audio = useStorage('audio', false)
  const music = ref(false)
  const mainThemeAudio = ref<HTMLAudioElement | null>(null)
  const _toggleAudio = useToggle(audio)
  const _toggleMusic = useToggle(music)

  const sideLeave = () => {
    showSidebar.value = false

    requestAnimationFrame(() => {
      isGameInfo.value = false
      isContractInfo.value = false
      isBlockchainInfo.value = false
      isOptions.value = false
    })
  }

  const initializeApp = async () => {
    if (hasMetamask) {
      await connect()

      if (onValidNetwork.value && !initialized.value) {
        initialized.value = true

        await setUserInfo()

        setKtaAllowance(await ktaToken.allowance(address.value, kta.address))

        setSetting(await kta.settings())

        setCurrentBlockNumber(await provider!!.getBlockNumber())

        provider!!.on('block', (blockNumber: number) => {
          setCurrentBlockNumber(blockNumber)
        })

        // TODO: startGameEvents fonksiyonunda eklenecek
        kta.on(
          kta.interface.getEvent('UserMoved').name,
          (
            user: string,
            _, // oldCoordinate: Coordinates.CoordinateStruct,
            newCoordinate: Coordinates.CoordinateStruct
          ) => {
            useTownyToast('info', `New Coordinate: ${newCoordinate}`)

            if (user === address.value) {
              setUserProperty('coordinate', newCoordinate)
            }
          }
        )

        // TODO: bu bilgiyi transaction'dan almak yerine parametre olarak alacagiz cunku frontend'e yuk biniyor.
        kta.on(
          kta.interface.getEvent('UserRegistered').name,
          async (event: Event) => {
            const tx = await event.getTransaction()
            const registeredAddress = tx.from

            if (registeredAddress === address.value) {
              await setUserInfo()
            }
          }
        )

        ktaToken.on(
          ktaToken.interface.getEvent('Approval').name,
          (owner: string, spender: string, value: BigNumber) => {
            if (owner === address.value && spender === kta.address) {
              setKtaAllowance(value)
            }
          }
        )
      }
    }
  }

  // TODO: anlam karisikligini gidermek icin setPlayerInfo olarak her yeri guncellemek ve contract tarafini da guncellemek istiyoruz
  const setUserInfo = async () => {
    setIsRegistered(await kta.isRegistered(address.value))
    const userInfo = { ...(await kta.userByAddr(address.value)) }
    setUser(userInfo)
    await setUserCoordinate()
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
    showSidebar,
    isGameInfo,
    isContractInfo,
    isBlockchainInfo,
    isOptions,
    audio,
    music,
    sideLeave,
    initializeApp,
    setUserInfo,
    toggleAudio,
    toggleMusic,
  }
})
