export const useConnectionStore = defineStore('connectionStore', () => {
  // --------[ States ]-------- //
  const ethereum = window.ethereum
  const hasMetamask = Boolean(ethereum)

  // --------[ Getters ]-------- //

  return {
    hasMetamask,
  }
})
