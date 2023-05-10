<template>
  <div class="relative" style="width: 40% !important">
    <div
      ref="mapElement"
      @wheel="onWheel($event)"
      v-if="hasMetamask && onValidNetwork"
      class="relative z-50"
    >
      <div
        class="relative grid overflow-hidden border-[10px] border-[#391f05]"
        :style="`grid-template-columns: repeat(${getGridColsByNearLevel}, minmax(0, 1fr));`"
      >
        <div
          class="absolute top-0 h-full w-full bg-map bg-cover"
          :style="`transform: scale(${
            100 + (maxNearLevel - nearLevel) * 10
          }%); background-position: ${
            (-originCoordinate._x *
              BigInt(Math.round(width / (nearLevel * 2 + 1)))) %
            BigInt(MAX_PIXEL_VALUE)
          }px ${
            (originCoordinate._y *
              BigInt(Math.round(width / (nearLevel * 2 + 1)))) %
            BigInt(MAX_PIXEL_VALUE)
          }px`"
        />
        <Mapbox
          v-for="(item, index) in addressesByCoordinate"
          :key="index"
          :item="item"
          :emit-ready-event="index === 0"
          class="select-none"
          @modalOpened="openModal(item)"
        />
        <InformationModal
          v-if="showModal"
          :content-classes="'min-h-[50%] w-1/3 bg-transparent'"
          @modalClosed="closeModal()"
        >
          <Parchment>
            <template #parchment-header> Addresses </template>
            <div class="flex flex-col">
              <SearchBar v-model="search" :rules="searchRules" />
              <div>
                <Accordion
                  v-for="(_address, index) in filteredList"
                  :key="index"
                >
                  <template #title>
                    <div class="flex items-center">
                      <div
                        class="mr-1 rounded-md bg-towni-brown-dark-300 p-1 text-xs text-white"
                        @click.stop="attack(_address)"
                      >
                        TODO:Attack
                      </div>

                      <div class="text-xs" @click="clickedAddress = _address">
                        {{ _address }}
                      </div>
                    </div>
                  </template>
                  <OtherUser
                    v-if="clickedAddress === _address"
                    :address="_address"
                  />
                </Accordion>
              </div>
            </div>
            <template #parchment-footer>
              <div>
                <TownyButton
                  class="px-4 text-xl"
                  v-if="
                    !(
                      user.coordinate._x === currentItem._x &&
                      user.coordinate._y === currentItem._y
                    )
                  "
                  @click="isMoveable() ? move() : teleport()"
                  >{{ isMoveable() ? 'Move' : 'Teleport' }}</TownyButton
                >
              </div>
            </template>
          </Parchment>
        </InformationModal>
      </div>
    </div>
    <MapNavigation :height="width.toString()" />
  </div>
</template>

<script setup lang="ts">
import { MAX_PIXEL_VALUE } from '~/constants'
import { useDebounce, useDebounceFn } from '@vueuse/core'
import { useDrag } from '@vueuse/gesture'
import { CoordinateItem } from '~/types'
import MapNavigation from '~/components/MapNavigation.vue'
import OtherUser from '~/components/OtherUser.vue'
import Accordion from '~/components/Accordion.vue'
import SearchBar from '~/components/SearchBar.vue'
import { Direction } from '~/enums'
import { abs } from 'extra-bigint.web'
import * as yup from 'yup'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()
const appOptionsStore = useAppOptionsStore()

const { hasMetamask } = connectionStore
const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { onValidNetwork, getKta } = storeToRefs(connectionStore)
const { addressesByCoordinate, nearLevel, user } = storeToRefs(userGameStore)
const { originCoordinate } = storeToRefs(appOptionsStore)

//--------[ Nuxt ]--------//
const { maxNearLevel } = useRuntimeConfig().public

//--------[ Data ]--------//
const clickedAddress = ref('')
const mapElement = ref(null)
const showModal = ref(false)
const zoomOut = ref(0)
const zoomIn = ref(0)
const search = ref('')
const addresses = ref<string[]>([])
const { width } = useElementSize(mapElement)
const searchRules = yup.string().ethereumAddress()
const currentItem = ref<CoordinateItem>({
  _x: BigInt(0),
  _y: BigInt(0),
})

//--------[ Computed ]--------//
const getGridColsByNearLevel = computed(() => nearLevel.value * 2 + 1)

const filteredList = computed(() => {
  return addresses.value.filter((address: string) =>
    address.toLowerCase().includes(searchDebounced.value.toLowerCase())
  )
})

//--------[ Methods ]--------//
const debouncedSetUserCoordinate = useDebounceFn((x: bigint, y: bigint) => {
  setUserCoordinate({
    _x: x,
    _y: y,
  })
}, maxNearLevel - nearLevel.value)

const openModal = async (item: CoordinateItem) => {
  currentItem.value = item
  showModal.value = true
  addresses.value = await getKta.value.getAddressesByCoordinate(
    currentItem.value
  )
}

const move = async () => {
  const deltaX = currentItem.value._x - user.value.coordinate._x
  const deltaY = currentItem.value._y - user.value.coordinate._y

  let direction: Direction
  if (deltaX < 0) {
    direction = Direction.Left
  } else if (deltaX > 0) {
    direction = Direction.Right
  } else if (deltaY < 0) {
    direction = Direction.Down
  } else {
    direction = Direction.Up
  }

  await getKta.value.move(BigInt(direction))
}

const isMoveable = () => {
  const deltaX = abs(currentItem.value._x - user.value.coordinate._x)
  const deltaY = abs(currentItem.value._y - user.value.coordinate._y)

  return abs(deltaX + deltaY) <= 1
}

const teleport = async () => {
  await getKta.value.teleport({
    _x: currentItem.value._x,
    _y: currentItem.value._y,
  })
}

const attack = async (address: string) => {
  try {
    await getKta.value.attack(address)
  } catch (error: any) {
    console.log(
      getKta.value.interface.getError(error.info.error.data.data.result)
    )
  }
}

const onWheel = (event: WheelEvent) => {
  let newNearLevel: number

  if (event.deltaY < 0) {
    if (zoomIn.value < 5) {
      zoomIn.value++

      return
    }

    zoomIn.value = 0
    newNearLevel = nearLevel.value - 1
  } else {
    if (zoomOut.value < 5) {
      zoomOut.value++

      return
    }

    zoomOut.value = 0
    newNearLevel = nearLevel.value + 1
  }

  setNearLevelByCalculatingCoordinates(newNearLevel)
}

const dragHandler = async ({ movement: [x, y], swipe, tap }) => {
  console.log('swipe')
  console.log(swipe)
  console.log('tap')
  console.log(tap)
  const { _x, _y } = originCoordinate.value

  const newX =
    _x +
    BigInt(Math.trunc(-x / Math.round(width.value / (nearLevel.value * 2 + 1))))
  const newY =
    _y +
    BigInt(Math.trunc(y / Math.round(width.value / (nearLevel.value * 2 + 1))))

  await debouncedSetUserCoordinate(newX, newY)
}

useDrag(dragHandler, {
  domTarget: mapElement,
  filterTaps: true,
})

const closeModal = () => {
  showModal.value = false
  search.value = ''
}

const searchDebounced = useDebounce(search, 1000)
</script>

<style></style>
