import { BigNumber } from 'ethers'
import { useStorage } from '@vueuse/core'
import { CoordinateItem } from '~/types'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

export const useUserGameStore = defineStore('userGameStore', () => {
  const user = ref<IKillThemAll.UserStruct>(null)
  const isRegistered = ref(true)
  const addressesByCoordinate = ref([]) as CoordinateItem[]
  const isLoading = ref(false)
  const kta = useKta()
  const nearLevel = useStorage('nearLevel', '1')
  const setting = ref<IKillThemAll.SettingStructOutput>(null)

  const setUser = (newUser: IKillThemAll.UserStruct) => {
    user.value = newUser
  }

  const setSetting = (newSetting: IKillThemAll.SettingStructOutput) => {
    setting.value = newSetting
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

  const setUserCoordinate = async () => {
    isLoading.value = true
    addressesByCoordinate.value = []
    const minScanX = user.value.coordinate._x.sub(nearLevel.value)
    const maxScanX = user.value.coordinate._x.add(nearLevel.value)
    const minScanY = user.value.coordinate._y.sub(nearLevel.value)
    const maxScanY = user.value.coordinate._y.add(nearLevel.value)

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
    isLoading.value = false
  }

  return {
    addressesByCoordinate,
    isRegistered,
    setting,
    user,
    kta,
    isLoading,
    nearLevel,
    setIsRegistered,
    setUserCoordinate,
    setUser,
    setUserProperty,
    setSetting,
  }
})
