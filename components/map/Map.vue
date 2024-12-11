<template>
  <div
    class="fire-shadow-box relative min-w-full overflow-hidden md:min-w-min md:max-w-[70%]"
    :style="`width: ${mapSize}%`"
  >
    <section
      ref="mapElement"
      class="relative outline-none"
      tabindex="0"
      @keyup="handleKeyNavigation"
      @wheel="onWheel($event)"
    >
      <div
        class="relative grid overflow-hidden rounded-lg border-[10px] border-towny-brown-dark-600"
        :style="`grid-template-columns: repeat(${getGridColsByNearLevel}, minmax(0, 1fr));`"
      >
        <div
          class="absolute top-0 h-full w-full bg-map bg-cover"
          :style="mapStyle"
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
    </section>
    <section>
      <MapMenuButton
        v-for="menu in menus"
        :key="menu.position"
        :position="menu.position"
        class="map-menu-toggle-button"
        :is-visible="menu.isVisible"
        @toggle="toggleMenuVisibility(menu.position)"
      />
      <MapMenu
        v-for="menu in menus"
        :key="menu.position"
        ref="navigation"
        :position="menu.position"
      >
        <Transition name="menu">
          <component
            :is="menu.component"
            v-if="menu.isVisible"
            :size="menuSizeStyle"
          />
        </Transition>
      </MapMenu>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDrag, type EventTypes, type Handler } from '@vueuse/gesture'
import Mapbox from '~/components/map/Mapbox.vue'
import { MAX_PIXEL_VALUE } from '~/constants'
import MoveControls from '~/components/map/MoveControls.vue'
import ZoomControls from '~/components/map/ZoomControls.vue'
import ReturnBackControls from '~/components/map/ReturnBackControls.vue'
import NavigateControls from '~/components/map/NavigateControls.vue'
import MapMenu from '~/components/map/MapMenu.vue'
import MapMenuButton from '~/components/map/MapMenuButton.vue'
import { Direction } from '~/enums'

// --------[ Store ]-------- //
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
const mapElement = ref<HTMLElement | null>(null)
const navigation = ref<HTMLElement | null>(null)
const { width } = useElementSize(mapElement)
const mapSize = useLocalStorage('mapSize', 50)

interface Menu {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  isVisible: boolean
  component: Component
}

const menus = ref<Menu[]>([
  { position: 'top-left', isVisible: false, component: markRaw(MoveControls) },
  {
    position: 'top-right',
    isVisible: false,
    component: markRaw(ReturnBackControls),
  },
  {
    position: 'bottom-left',
    isVisible: false,
    component: markRaw(ZoomControls),
  },
  {
    position: 'bottom-right',
    isVisible: false,
    component: markRaw(NavigateControls),
  },
])

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

const menuSizeStyle = computed(() => {
  const baseWidthDivisor = 1.75
  const baseHeightDivisor = 1.75
  const step = 0.25

  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    return {
      width: `${width.value / 2.5}px`,
      height: `${width.value / 2}px`,
    }
  }

  const stepsFromBase = (mapSize.value - 30) / 5
  const widthDivisor = baseWidthDivisor + stepsFromBase * step
  const heightDivisor = baseHeightDivisor + stepsFromBase * step

  return {
    width: `${width.value / widthDivisor}px`,
    height: `${width.value / heightDivisor}px`,
  }
})

// --------[ Method ]-------- //
const onWheel = (event: WheelEvent) => {
  const newNearLevel =
    event.deltaY < 0 ? nearLevel.value - 1 : nearLevel.value + 1

  setNearLevelByCalculatingCoordinates(newNearLevel)
}

const handleKeyNavigation = async ({ key, shiftKey }: KeyboardEvent) => {
  let { _x, _y } = originCoordinate.value
  const navigateValue = 1n
  let direction

  switch (key) {
    case 'ArrowUp':
      _y += navigateValue
      direction = Direction.Up
      break
    case 'ArrowRight':
      _x += navigateValue
      direction = Direction.Right
      break
    case 'ArrowDown':
      _y -= navigateValue
      direction = Direction.Down
      break
    case 'ArrowLeft':
      _x -= navigateValue
      direction = Direction.Left
      break
  }

  if (shiftKey && direction !== undefined) {
  }

  setUserCoordinate({ _x, _y })
}

const calculateNewCoordinates = (movement: [number, number]) => {
  const { _x, _y } = originCoordinate.value
  const gridSize = Math.round(width.value / (nearLevel.value * 2 + 1))

  return {
    _x: _x + BigInt(Math.trunc(-movement[0] / gridSize)),
    _y: _y + BigInt(Math.trunc(movement[1] / gridSize)),
  }
}

const dragHandler: Handler<'drag', EventTypes['drag']> = ({
  elapsedTime,
  movement,
  last,
}) => {
  if (elapsedTime < 150) {
    return
  }
  const newCoordinates = calculateNewCoordinates(movement)
  setUserCoordinate(newCoordinates, last)
}

useDrag(dragHandler, {
  domTarget: mapElement,
  filterTaps: true,
})

const toggleMenuVisibility = (position: string) => {
  menus.value = menus.value.map((menu) =>
    menu.position === position
      ? { ...menu, isVisible: !menu.isVisible }
      : { ...menu, isVisible: false },
  )
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.menu-enter-from {
  transform: scale(0.8);
  opacity: 0;
}

.menu-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.fire-shadow-box {
  background-color: #9b4622;
  border-radius: 10px;
  filter: drop-shadow(0 0 30px rgba(155, 70, 34, 0.8));
  animation: fireEffect 5s infinite alternate ease-in-out;
}

@keyframes fireEffect {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(155, 70, 34, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(198, 100, 50, 0.8));
  }
}
</style>
