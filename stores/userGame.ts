import { StorageSerializers, useStorage } from '@vueuse/core'
import { CoordinateItem, MultiCallData } from '~/types'
import { middleElement } from '~/utils'
import { useMultiCall } from '~/composables/useMultiCall'
import { IKillThemAll, Coordinates } from '~/types/typechain/KillThemAll'

export const useUserGameStore = defineStore('userGameStore', () => {
  //--------[ Nuxt Imports ]--------//
  const { minNearLevel, maxNearLevel } = useRuntimeConfig().public

  //--------[ Stores ]--------//
  const appOptionsStore = useAppOptionsStore()
  const connectionStore = useConnectionStore()
  const { getKta } = storeToRefs(connectionStore)

  //--------[ States ]--------//
  const isRegistered = ref(false)
  const isLoading = ref(false)
  // TODO: solve this
  const user = ref<IKillThemAll.UserStruct>(
    null as unknown as IKillThemAll.UserStruct
  )
  // TODO: move to app options store
  const nearLevel = useStorage<number>('nearLevel', 2, undefined, {
    serializer: StorageSerializers.number,
  })
  const setting = ref<IKillThemAll.SettingStruct | null>(null)
  const userCountByCoordinate = ref(new Map<string, number>())
  const hasTownByCoordinate = ref(new Map<string, boolean>())
  const addressesByCoordinate = ref<CoordinateItem[]>([])

  //--------[ Getters ]--------//
  const getUserCountByCoordinate = computed(() => userCountByCoordinate.value)
  const getHasTownByCoordinate = computed(() => hasTownByCoordinate.value)

  //--------[ Actions ]--------//
  const setUser = (newUser: IKillThemAll.UserStruct) => {
    user.value = newUser
  }

  const setSetting = (newSetting: IKillThemAll.SettingStruct) => {
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
    isLoading.value = true

    const x = BigInt(coordinates._x)
    const y = BigInt(coordinates._y)
    const minScanX = x - BigInt(nearLevel.value)
    const maxScanX = x + BigInt(nearLevel.value)
    const minScanY = y - BigInt(nearLevel.value)
    const maxScanY = y + BigInt(nearLevel.value)

    const multiCallData: MultiCallData[] = [
      {
        contract: getKta.value,
        functionsData: [],
      },
    ]

    addressesByCoordinate.value = []
    for (let j: bigint = maxScanY; j >= minScanY; ) {
      for (let i: bigint = minScanX; i <= maxScanX; ) {
        const coordinateItem: CoordinateItem = {
          _x: i,
          _y: j,
        }

        const mapKey = `${coordinateItem._x.toString()},${coordinateItem._y.toString()}`
        if (!userCountByCoordinate.value.has(mapKey)) {
          userCountByCoordinate.value.set(mapKey, 0)

          multiCallData[0].functionsData.push({
            name: 'getAddressesByCoordinate',
            inputs: [coordinateItem],
          })
        }

        if (!hasTownByCoordinate.value.has(mapKey)) {
          hasTownByCoordinate.value.set(mapKey, false)

          multiCallData[0].functionsData.push({
            name: 'townIdByCoordinate',
            inputs: [coordinateItem._x, coordinateItem._y],
          })
        }

        addressesByCoordinate.value.push(coordinateItem)
        // TODO:Ethers try ++
        i += BigInt(1)
      }
      j -= BigInt(1)
    }

    useMultiCall(multiCallData).then((results) => {
      const resultInfosByAddrKey = results.values()
      for (const values of resultInfosByAddrKey) {
        const resultInfos = values.values()
        for (const resultInfo of resultInfos) {
          if (resultInfo.hasError) {
            continue
          }

          if (resultInfo.name === 'getAddressesByCoordinate') {
            const addressLength = resultInfo.result[0].length
            const { _x, _y } = resultInfo.inputs[0]
            const mapKey = `${_x.toString()},${_y.toString()}`
            userCountByCoordinate.value.set(mapKey, addressLength)
          } else if (resultInfo.name === 'townIdByCoordinate') {
            const [_x, _y] = resultInfo.inputs
            const mapKey = `${_x.toString()},${_y.toString()}`
            hasTownByCoordinate.value.set(mapKey, Boolean(resultInfo.result[0]))
          }
        }
      }
    })

    const middleCoordinate = middleElement<CoordinateItem>(
      addressesByCoordinate.value
    )
    appOptionsStore.setOriginCoordinate(middleCoordinate)

    isLoading.value = false
  }

  return {
    user,
    setting,
    nearLevel,
    isLoading,
    isRegistered,
    hasTownByCoordinate,
    addressesByCoordinate,
    userCountByCoordinate,
    getHasTownByCoordinate,
    getUserCountByCoordinate,
    setUser,
    setSetting,
    setNearLevel,
    setIsRegistered,
    setUserProperty,
    setUserCoordinate,
    setNearLevelByCalculatingCoordinates,
  }
})
