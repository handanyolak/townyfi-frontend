export const useAppOptionsStore = defineStore('appOptionsStore', () => {
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

  return {
    showSidebar,
    isGameInfo,
    isWeb3Info,
    isUserOptions,
    isInteractions,
    sideLeave,
  }
})
