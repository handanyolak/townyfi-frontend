import { BigNumber } from 'ethers'
import { CoordinateItem } from '~/types'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

export const useUserGameStore = defineStore('userGameStore', () => {
  const user = ref<IKillThemAll.UserStruct>(null)
  const isRegistered = ref(false)
  const addressesByCoordinate = ref([]) as CoordinateItem[]

  const kta = useKta()
  const settings = computed(async () => await kta.settings())

  const setUserInfo = (newUserInfo: IKillThemAll.UserStruct) => {
    user.value = newUserInfo
  }

  const setUserProperty = <T extends keyof IKillThemAll.UserStruct>(
    property: T,
    newValue: IKillThemAll.UserStruct[T]
  ) => {
    user.value[property] = newValue
  }

  const setIsRegistered = (newIsRegistered: boolean) => {
    isRegistered.value = newIsRegistered
  }

  // TODO: adi yanlis
  const setUserCoordinate = async (nearLevel = 1) => {
    addressesByCoordinate.value = []
    const minScanX = user.value.coordinate._x.sub(nearLevel)
    const maxScanX = user.value.coordinate._x.add(nearLevel)
    const minScanY = user.value.coordinate._y.sub(nearLevel)
    const maxScanY = user.value.coordinate._y.add(nearLevel)

    for (let j: BigNumber = maxScanY; j.gte(minScanY); ) {
      for (let i: BigNumber = minScanX; i.lte(maxScanX); ) {
        const coordinateItem: CoordinateItem = {
          x: i,
          y: j,
          addresses: await kta.getAddressesByCoordinate([i, j]),
        }

        addressesByCoordinate.value.push(coordinateItem)
        i = i.add(1)
      }
      j = j.sub(1)
    }
  }

  return {
    addressesByCoordinate,
    isRegistered,
    settings,
    user,
    kta,
    setIsRegistered,
    setUserCoordinate,
    setUserInfo,
    setUserProperty,
  }
})
