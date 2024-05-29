<template>
  <div class="relative" style="width: 55% !important">
    <div
      ref="mapElement"
      class="relative z-50 outline-none"
      tabindex="0"
      @keyup.up="navigateByArrowKeys(NavigateDirection.Up)"
      @keyup.right="navigateByArrowKeys(NavigateDirection.Right)"
      @keyup.down="navigateByArrowKeys(NavigateDirection.Down)"
      @keyup.left="navigateByArrowKeys(NavigateDirection.Left)"
      @wheel="onWheel($event)"
    >
      <button
        ref="toggleButton"
        :class="[
          'absolute -right-6 -top-1 cursor-pointer transition-all  ease-in-out',
          isMapNavigationVisible
            ? 'translate-x-48 delay-300 duration-500 '
            : 'duration-300',
        ]"
        @click="handleNavigationToggle"
      >
        <Icon
          :class="[
            ' transform text-3xl text-towni-brown-dark-400 transition-transform duration-200 ease-in-out',
            isMapNavigationVisible ? 'rotate-180' : '',
          ]"
          name="material-symbols-light:double-arrow"
        />
      </button>

      <div
        :class="[
          'relative grid overflow-hidden rounded-lg border-[10px] border-[#5a3006]',
          isMapNavigationVisible ? 'rounded-r-none' : '',
        ]"
        :style="`grid-template-columns: repeat(${getGridColsByNearLevel}, minmax(0, 1fr));`"
      >
        <div
          class="absolute top-0 h-full w-full bg-map bg-cover"
          :style="mapStyle"
        />
        <Mapbox
          v-for="(item, index) in addressesByCoordinate"
          :key="index"
          v-memo="[item]"
          :item="item"
          :emit-ready-event="index === 0"
          class="select-none"
          @dblclick="setModalInfo('MapboxModal', { coordinate: item })"
        />
      </div>
    </div>
    <Transition name="map-navigation">
      <MapNavigation
        v-if="isMapNavigationVisible"
        ref="navigation"
        :is-map-navigation-visible="isMapNavigationVisible"
        :height="width.toString()"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useDrag } from '@vueuse/gesture'
import Mapbox from '~/components/map/Mapbox.vue'
import { MAX_PIXEL_VALUE } from '~/constants'
import MapNavigation from '~/components/map/MapNavigation.vue'
import { NavigateDirection } from '~/enums'

// --------[ Stores ]-------- //
const userGameStore = useUserGameStore()
const appOptionsStore = useAppOptionsStore()

const { setModalInfo } = appOptionsStore
const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { addressesByCoordinate, nearLevel } = storeToRefs(userGameStore)
const { originCoordinate } = storeToRefs(appOptionsStore)

// --------[ Nuxt ]-------- //
const {
  public: { maxNearLevel },
} = useRuntimeConfig()

// --------[ Data ]-------- //
const mapElement = ref(null)
const isMapNavigationVisible = ref(false)
const navigation = ref<HTMLElement | null>(null)
const toggleButton = ref<HTMLElement | null>(null)
const { width } = useElementSize(mapElement)

// --------[ Computed ]-------- //
const getGridColsByNearLevel = computed(() => nearLevel.value * 2 + 1)

const mapStyle = computed(() => {
  return {
    transform: `scale(${100 + (maxNearLevel - nearLevel.value) * 10}%)`,
    backgroundPosition: `${
      (-originCoordinate.value._x *
        BigInt(Math.round(width.value / (nearLevel.value * 2 + 1)))) %
      BigInt(MAX_PIXEL_VALUE)
    }px ${
      (originCoordinate.value._y *
        BigInt(Math.round(width.value / (nearLevel.value * 2 + 1)))) %
      BigInt(MAX_PIXEL_VALUE)
    }px`,
  }
})

// --------[ Methods ]-------- //
const onWheel = (event: WheelEvent) => {
  const newNearLevel =
    event.deltaY < 0 ? nearLevel.value - 1 : nearLevel.value + 1

  setNearLevelByCalculatingCoordinates(newNearLevel)
}

const navigateByArrowKeys = (direction: NavigateDirection) => {
  let { _x, _y } = originCoordinate.value

  const navigateValue = 1n

  switch (direction) {
    case NavigateDirection.Up:
      _y += navigateValue
      break
    case NavigateDirection.Right:
      _x += navigateValue
      break
    case NavigateDirection.Down:
      _y -= navigateValue
      break
    case NavigateDirection.Left:
      _x -= navigateValue
      break
    default:
      console.error('Invalid direction:', direction)
      break
  }

  setUserCoordinate({ _x, _y })
}

const dragHandler = ({
  movement: [x, y],
  last,
}: {
  movement: [number, number]
  last: boolean
}) => {
  const { _x, _y } = originCoordinate.value

  const newX =
    _x +
    BigInt(Math.trunc(-x / Math.round(width.value / (nearLevel.value * 2 + 1))))
  const newY =
    _y +
    BigInt(Math.trunc(y / Math.round(width.value / (nearLevel.value * 2 + 1))))

  setUserCoordinate(
    {
      _x: newX,
      _y: newY,
    },
    last,
  )
}

useDrag(dragHandler, {
  domTarget: mapElement,
  filterTaps: true,
})

const handleNavigationToggle = () => {
  isMapNavigationVisible.value = !isMapNavigationVisible.value
}

onClickOutside(navigation, (event) => {
  if (
    !toggleButton.value ||
    toggleButton.value.contains(event.target as Node)
  ) {
    return
  }
  isMapNavigationVisible.value = false
})
</script>

<style scoped>
.map-navigation-enter-active,
.map-navigation-leave-active {
  transition: transform 0.8s ease;
}

.map-navigation-enter-from,
.map-navigation-leave-to {
  transform: translateX(-100%);
  transition: all 0.3s ease-out;
}
</style>
