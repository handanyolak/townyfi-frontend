import { defineStore } from 'pinia'

export const useContractStore = defineStore('contractStore', {
  state: () => ({
    user: {},
  }),
  actions: {
    /*     setArmor(newArmor: string) {
      this.armor = newArmor
    },
    setHealth(newHealth: string) {
      this.health = newHealth
    }, */
    setUserInfo(newUserInfo: any) {
      this.user = newUserInfo
    },
  },
})
