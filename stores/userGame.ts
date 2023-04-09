import { StorageSerializers, useStorage } from '@vueuse/core'
import { Ref } from 'vue'
import { CoordinateItem } from '~/types'
import { middleElement } from '~/utils'
import {
  getAddressesLengthByCoordinateSlot,
  getTownIdByCoordinateSlot,
} from '~/composables/useContractReader'
import { IKillThemAll, Coordinates } from '~/types/typechain/KillThemAll'

export const useUserGameStore = defineStore('userGameStore', () => {
  const { minNearLevel, maxNearLevel, ktaAddress } = useRuntimeConfig().public
  const appOptionsStore = useAppOptionsStore()

  const user = ref<IKillThemAll.UserStruct>(
    null as unknown as IKillThemAll.UserStruct
  )
  const isRegistered = ref(true)
  const addressesByCoordinate = ref([]) as Ref<CoordinateItem[]>
  const isLoading = ref(false)

  const provider = useProvider()
  // TODO: move to app options store
  const nearLevel = useStorage<number>('nearLevel', 2, undefined, {
    serializer: StorageSerializers.number,
  })

  const userCountByCoordinate = ref(new Map<string, number>())
  const hasTownByCoordinate = ref(new Map<string, boolean>())

  const getUserCountByCoordinate = computed(() => userCountByCoordinate.value)
  const getHasTownByCoordinate = computed(() => hasTownByCoordinate.value)

  const setting = ref<IKillThemAll.SettingStructOutput | null>(null)

  const setUser = (newUser: IKillThemAll.UserStruct) => {
    user.value = newUser
  }

  const setSetting = (newSetting: IKillThemAll.SettingStructOutput) => {
    setting.value = newSetting
  }

  const setNearLevel = (newNearLevel: number) => {
    if (newNearLevel > maxNearLevel || newNearLevel < minNearLevel) {
      return
    }

    nearLevel.value = newNearLevel
  }

  const setNearLevelByCalculatingCoordinates = (newNearLevel: number) => {
    const { originCoordinate } = appOptionsStore

    setNearLevel(newNearLevel)
    setUserCoordinate(originCoordinate)
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

  const setUserCoordinate = (coordinates: Coordinates.CoordinateStruct) => {
    const promises = []
    const x = BigInt(coordinates._x)
    const y = BigInt(coordinates._y)

    isLoading.value = true
    addressesByCoordinate.value = []
    const minScanX = x - BigInt(nearLevel.value)
    const maxScanX = x + BigInt(nearLevel.value)
    const minScanY = y - BigInt(nearLevel.value)
    const maxScanY = y + BigInt(nearLevel.value)

    for (let j: bigint = maxScanY; j >= minScanY; ) {
      for (let i: bigint = minScanX; i <= maxScanX; ) {
        const coordinateItem: CoordinateItem = {
          _x: i,
          _y: j,
        }

        // kta.getAddressesByCoordinate(coordinateItem).then((addresses) => {
        //   userCountByCoordinate.value.set(mapKey, addresses.length)
        //   console.log(
        //     `${mapKey} icin getAddressesByCoordinate datasi aliniyor`
        //   )
        // })

        // kta
        //   .townIdByCoordinate(coordinateItem._x, coordinateItem._y)
        //   .then((townId) => {
        //     hasTownByCoordinate.value.set(mapKey, !townId.isZero())
        //   })

        const mapKey = `${coordinateItem._x.toString()},${coordinateItem._y.toString()}`
        if (!userCountByCoordinate.value.has(mapKey)) {
          userCountByCoordinate.value.set(mapKey, 0)

          const slot = getAddressesLengthByCoordinateSlot(
            coordinateItem._x,
            coordinateItem._y
          )

          promises.push(
            provider.getStorage(ktaAddress, slot).then((addressesLength) => {
              // TODO: use bigint for this
              userCountByCoordinate.value.set(mapKey, Number(addressesLength))
            })
          )
        }

        if (!hasTownByCoordinate.value.has(mapKey)) {
          hasTownByCoordinate.value.set(mapKey, false)

          const slot = getTownIdByCoordinateSlot(
            coordinateItem._x,
            coordinateItem._y
          )

          promises.push(
            provider.getStorage(ktaAddress, slot).then((townId) => {
              // TODO: use bigint for this
              hasTownByCoordinate.value.set(mapKey, Boolean(Number(townId)))
            })
          )
        }

        addressesByCoordinate.value.push(coordinateItem)
        // TODO:Ethers try ++
        i += BigInt(1)
      }
      j -= BigInt(1)
    }

    // NOTE: use for execute all async
    // Promise.all(promises).catch(() => {
    //   // do nothing
    // })

    // NOTE: use for execute all sequentially
    promises.forEach((promiseFactory) => {
      promiseFactory.catch(() => {
        // do nothing
      })
    })

    const middleCoordinate = middleElement<CoordinateItem>(
      addressesByCoordinate.value
    )

    appOptionsStore.setOriginCoordinate(middleCoordinate)

    isLoading.value = false
  }

  return {
    addressesByCoordinate,
    isRegistered,
    setting,
    user,
    isLoading,
    nearLevel,
    userCountByCoordinate,
    hasTownByCoordinate,
    getUserCountByCoordinate,
    getHasTownByCoordinate,
    setNearLevel,
    setNearLevelByCalculatingCoordinates,
    setIsRegistered,
    setUserCoordinate,
    setUser,
    setUserProperty,
    setSetting,
  }
})
