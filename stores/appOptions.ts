export const useAppOptions = defineStore('appOptionsStore', () => {
  const showSidebar = ref(false)
  const isGameInfo = ref(false)
  const isWeb3Info = ref(false)
  const isUserOptions = ref(false)
  const isInteractions = ref(false)

  return { showSidebar, isGameInfo, isWeb3Info, isUserOptions, isInteractions }
})
