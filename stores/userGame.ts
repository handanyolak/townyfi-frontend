import { defineStore } from 'pinia'
import { useUserWalletStore } from './userWallet'
import { CoordinateItem } from '~/types/coordinate-item'

export const useUserGameStore = defineStore('userGameStore', {
  state: () => ({
    user: {},
    isRegistered: false,
    addressesByCoordinate: [] as CoordinateItem[],
  }),
  getters: {
    kta(): any {
      return useUserWalletStore().kta
    },
  },
  actions: {
    setUserInfo(newUserInfo: any) {
      this.user = newUserInfo
    },
    setIsRegistered(newIsRegistered: boolean) {
      this.isRegistered = newIsRegistered
    },
    // TODO: change function name
    async userCoordinate(nearLevel: number) {
      console.log('userCoordinate')
      this.addressesByCoordinate = []
      const minScanX = this.user.coordinate._x.sub(nearLevel)
      const maxScanX = this.user.coordinate._x.add(nearLevel)
      const minScanY = this.user.coordinate._y.sub(nearLevel)
      const maxScanY = this.user.coordinate._y.add(nearLevel)

      for (let j = maxScanY; j >= minScanY; j--) {
        for (let i = minScanX; i <= maxScanX; i++) {
          const coordinateItem: CoordinateItem = {
            x: i,
            y: j,
            addresses: await this.kta.getAddressesByCoordinate([i, j]),
          }

          this.addressesByCoordinate.push(coordinateItem)
        }
      }
    },
  },
})
