<template>
  <div class="relative" style="width: 55% !important">
    <div
      ref="mapElement"
      @wheel="onWheel($event)"
      v-if="hasMetamask && onValidNetwork"
      class="relative z-50"
      tabindex="0"
      @keyup.up="navigateByArrowKeys(NavigateDirection.Up)"
      @keyup.right="navigateByArrowKeys(NavigateDirection.Right)"
      @keyup.down="navigateByArrowKeys(NavigateDirection.Down)"
      @keyup.left="navigateByArrowKeys(NavigateDirection.Left)"
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
          @dblclick="setModalInfo('MapboxModal', { coordinate: item })"
        />
      </div>
    </div>
    <MapNavigation :height="width.toString()" />
  </div>
</template>

<script setup lang="ts">
import { MAX_PIXEL_VALUE } from '~/constants'
import { useDebounceFn } from '@vueuse/core'
import { useDrag } from '@vueuse/gesture'
import MapNavigation from '~/components/MapNavigation.vue'
import { NavigateDirection } from '~~/enums'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()
const appOptionsStore = useAppOptionsStore()

const { hasMetamask } = connectionStore
const { setModalInfo } = appOptionsStore
const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate, nearLevel } = storeToRefs(userGameStore)
const { originCoordinate } = storeToRefs(appOptionsStore)

//--------[ Nuxt ]--------//
const { maxNearLevel } = useRuntimeConfig().public

//--------[ Data ]--------//
const mapElement = ref(null)
const zoomOut = ref(0)
const zoomIn = ref(0)
const { width } = useElementSize(mapElement)

//--------[ Computed ]--------//
const getGridColsByNearLevel = computed(() => nearLevel.value * 2 + 1)

//--------[ Methods ]--------//
const debouncedSetUserCoordinate = useDebounceFn((x: bigint, y: bigint) => {
  setUserCoordinate({
    _x: x,
    _y: y,
  })
}, maxNearLevel - nearLevel.value)

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

const navigateByArrowKeys = (direction: NavigateDirection) => {
  // TODO:Ethers try this
  let { _x, _y } = originCoordinate.value

  const navigateValue = 1n
  if (direction === NavigateDirection.Up) {
    _y += navigateValue
  } else if (direction === NavigateDirection.Right) {
    _x += navigateValue
  } else if (direction === NavigateDirection.Down) {
    _y -= navigateValue
  } else if (direction === NavigateDirection.Left) {
    _x -= navigateValue
  } else {
    // TODO: Throw exception etc.
  }

  setUserCoordinate({
    _x,
    _y,
  })
}

const dragHandler = async ({
  movement: [x, y],
}: {
  movement: [number, number]
}) => {
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
</script>
