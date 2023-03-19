import { BigNumber } from 'ethers'
import { useStorage } from '@vueuse/core'
import { CoordinateItem } from '~/types'
import { middleElement } from '~/utils'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

export const useUserGameStore = defineStore('userGameStore', () => {
  const appOptionsStore = useAppOptionsStore()

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

  const setUserCoordinate = (x: BigNumber, y: BigNumber) => {
    isLoading.value = true
    addressesByCoordinate.value = []
    const minScanX = x.sub(nearLevel.value)
    const maxScanX = x.add(nearLevel.value)
    const minScanY = y.sub(nearLevel.value)
    const maxScanY = y.add(nearLevel.value)

    for (let j: BigNumber = maxScanY; j.gte(minScanY); ) {
      for (let i: BigNumber = minScanX; i.lte(maxScanX); ) {
        const coordinateItem: CoordinateItem = {
          x: i,
          y: j,
        }

        addressesByCoordinate.value.push(coordinateItem)
        i = i.add(1)
      }
      j = j.sub(1)
    }

    const middleItem = middleElement(addressesByCoordinate.value)
    appOptionsStore.setOriginCoordinate(middleItem)
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
