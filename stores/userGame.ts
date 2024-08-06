import { useStorage } from '@vueuse/core'
import townWar from '../townWar.json'
import type {
  CoordinateItem,
  MultiCallData,
  CoordinateStruct,
  Settings,
  Town,
  User,
  WarLogInfo,
} from '~/types'
import { middleElement } from '~/utils'
import { useMultiCall } from '~/composables/useMultiCall'

export const useUserGameStore = defineStore('userGameStore', () => {
  // --------[ Nuxt Imports ]-------- //
  const {
    public: { minNearLevel, maxNearLevel },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const appOptionsStore = useAppOptionsStore()
  const contractStore = useContractStore()

  // --------[ States ]-------- //
  const isRegistered = ref(false)
  const isLoading = ref(true)
  // TODO: solve this
  const user = ref<User>(null as unknown as User)
  const town = ref<Town>(null as unknown as Town)
  const settings = ref<Settings>(null as unknown as Settings)
  // TODO: change to ref
  const warLogInfo = ref<WarLogInfo>(townWar as unknown as WarLogInfo)

  // TODO: move to app options store
  const nearLevel = useStorage('nearLevel', 3)
  const userCountByCoordinate = ref(new Map<string, number>())
  const hasTownByCoordinate = ref(new Map<string, boolean>())
  // TODO: this is not addresses. rename it
  const addressesByCoordinate = ref<CoordinateItem[]>([])

  // --------[ Getters ]-------- //
  const getUserCountByCoordinate = computed(() => userCountByCoordinate.value)
  const getHasTownByCoordinate = computed(() => hasTownByCoordinate.value)

  // --------[ Actions ]-------- //
  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const setTown = (newTown: Town) => {
    town.value = newTown
  }

  const setSettings = (newSetting: Settings) => {
    settings.value = newSetting
  }

  const setWarLogInfo = (newWarLogInfo: WarLogInfo) => {
    warLogInfo.value = newWarLogInfo
  }

  const setNearLevel = (newNearLevel: number) => {
    if (newNearLevel > maxNearLevel || newNearLevel < minNearLevel) {
      return false
    }

    nearLevel.value = newNearLevel

    return true
  }

  const setNearLevelByCalculatingCoordinates = (newNearLevel: number) => {
    const { originCoordinate } = appOptionsStore

    const res = setNearLevel(newNearLevel)
    if (res) {
      setUserCoordinate(originCoordinate)
    }
  }

  const setUserProperty = <T extends keyof User>(
    property: T,
    newValue: User[T],
  ) => {
    user.value[property] = newValue
  }

  const setIsRegistered = (newIsRegistered: boolean) => {
    isRegistered.value = newIsRegistered
  }

  const setUserCoordinate = (
    coordinates: CoordinateStruct,
    getDataFromChain = true,
  ) => {
    const x = BigInt(coordinates._x)
    const y = BigInt(coordinates._y)
    const nearLevelValue = BigInt(nearLevel.value)
    const minScanX = x - nearLevelValue
    const maxScanX = x + nearLevelValue
    const minScanY = y - nearLevelValue
    const maxScanY = y + nearLevelValue

    const multiCallData: MultiCallData[] = [
      {
        address: contractStore.getKta.address,
        abi: contractStore.getKta.abi,
        functionsData: [],
      },
    ]

    addressesByCoordinate.value = []
    for (let j: bigint = maxScanY; j >= minScanY; j--) {
      for (let i: bigint = minScanX; i <= maxScanX; i++) {
        const coordinateItem: CoordinateItem = {
          _x: i,
          _y: j,
        }

        if (getDataFromChain) {
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
        }

        addressesByCoordinate.value.push(coordinateItem)
      }
    }

    const middleCoordinate = middleElement<CoordinateItem>(
      addressesByCoordinate.value,
    )
    appOptionsStore.setOriginCoordinate(middleCoordinate)

    if (!getDataFromChain) {
      isLoading.value = false

      return
    }

    // TODO: why did not use await here (was it to get performance on Frontend?)
    if (multiCallData.length) {
      useMultiCall(multiCallData).then((results) => {
        const resultInfosByAddrKey = results.get(contractStore.getKta.address)
        if (!resultInfosByAddrKey) {
          return
        }

        for (const resultInfo of resultInfosByAddrKey) {
          if (resultInfo.hasError) {
            console.error(JSON.stringify(resultInfo.error))
            console.error(
              JSON.stringify({
                name: resultInfo.name,
                inputs: resultInfo.inputs,
              }),
            )

            if (resultInfo.name === 'getAddressesByCoordinate') {
              const { _x, _y } = resultInfo.inputs[0]
              const mapKey = `${_x.toString()},${_y.toString()}`
              userCountByCoordinate.value.delete(mapKey)
            } else if (resultInfo.name === 'townIdByCoordinate') {
              const [_x, _y] = resultInfo.inputs
              const mapKey = `${_x.toString()},${_y.toString()}`
              hasTownByCoordinate.value.delete(mapKey)
            }

            continue
          }

          if (resultInfo.name === 'getAddressesByCoordinate') {
            const addressLength = (resultInfo.result as any[]).length
            const { _x, _y } = resultInfo.inputs[0]
            const mapKey = `${_x.toString()},${_y.toString()}`
            userCountByCoordinate.value.set(mapKey, addressLength)
          } else if (resultInfo.name === 'townIdByCoordinate') {
            const [_x, _y] = resultInfo.inputs
            const mapKey = `${_x.toString()},${_y.toString()}`
            hasTownByCoordinate.value.set(mapKey, Boolean(resultInfo.result))
          }
        }
      })
    }

    isLoading.value = false
  }

  return {
    user,
    settings,
    nearLevel,
    isLoading,
    isRegistered,
    hasTownByCoordinate,
    addressesByCoordinate,
    userCountByCoordinate,
    getHasTownByCoordinate,
    getUserCountByCoordinate,
    setUser,
    setTown,
    town,
    warLogInfo,
    setWarLogInfo,
    setSettings,
    setNearLevel,
    setIsRegistered,
    setUserProperty,
    setUserCoordinate,
    setNearLevelByCalculatingCoordinates,
  }
})
