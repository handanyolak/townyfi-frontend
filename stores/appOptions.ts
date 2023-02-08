export const useAppOptionsStore = defineStore('appOptionsStore', () => {
  const connectionStore = useConnectionStore()
  const userGameStore = useUserGameStore()
  const userWalletStore = useUserWalletStore()
  const { hasMetamask, provider } = connectionStore
  const { onValidNetwork } = storeToRefs(connectionStore)
  const { setUserInfo, setUserCoordinate, setUserProperty } = userGameStore
  const { setCurrentBlockNumber, connect } = userWalletStore
  const { address } = storeToRefs(userWalletStore)
  const kta = useKta()

  const initialized = ref(false)
  const showSidebar = ref(false)
  const isGameInfo = ref(false)
  const isWeb3Info = ref(false)
  const isUserOptions = ref(false)
  const isInteractions = ref(false)

  const sideLeave = () => {
    showSidebar.value = false

    requestAnimationFrame(() => {
      isGameInfo.value = false
      isWeb3Info.value = false
      isUserOptions.value = false
      isInteractions.value = false
    })
  }

  const initializeApp = async () => {
    console.log('hasMetamask')
    console.log(hasMetamask)
    console.log('onValidNetwork')
    console.log(onValidNetwork.value)
    console.log('initialized')
    console.log(initialized.value)
    if (hasMetamask && onValidNetwork.value && !initialized.value) {
      initialized.value = true

      // TODO: Bu fonskiyon normalde header'da calisiyor fakat zaman uyumsuzlugu yonetilemedigi icin gecici olarak cp yapildi.
      // ileride event yontemiyle haberlesilebilir ya da daha iyi bir yol bulunabilir.
      await connect()
      const userInfo = { ...(await kta.userByAddr(address.value)) }
      setUserInfo(userInfo)
      await setUserCoordinate()

      // bir kereye mahsus calisacak fonksiyonlar
      setCurrentBlockNumber(await provider!!.getBlockNumber())

      provider!!.on('block', (blockNumber: number) => {
        setCurrentBlockNumber(blockNumber)
      })

      // TODO: userGameStore'a startGameEvents fonksiyonunda eklenecek
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
    }
  }

  return {
    showSidebar,
    isGameInfo,
    isWeb3Info,
    isUserOptions,
    isInteractions,
    sideLeave,
    initializeApp,
  }
})
