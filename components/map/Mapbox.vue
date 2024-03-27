<template>
  <div
    class="relative cursor-pointer shadow-towni-400"
    @mouseover="showCoordinates"
    @mouseleave="hideCoordinates"
  >
    <div class="relative flex h-full flex-col items-center">
      <div
        :class="[
          'flex h-full w-full',
          hasTown ? 'flex-col items-center' : '',
          isRegistered && isCoordinateOfUser
            ? 'bg-knight knight bg-no-repeat'
            : '',
        ]"
      >
        <Banner v-if="hasTown" class="w-full" />
      </div>
      <img
        v-if="!(isRegistered && isCoordinateOfUser)"
        src="@/assets/img/skeleton-castle.png"
        class="invisible"
      />
    </div>
    <div>
      <Transition name="fade">
        <div
          v-if="isHovering"
          class="absolute left-0 top-0 z-50 flex w-16 items-center justify-between bg-towni-brown-dark-600 bg-opacity-70 p-1"
        >
          <Icon
            name="oui:vis-map-coordinate"
            class="pointer-events-none mr-1 h-4 w-4 text-towni-brown-dark-300"
          />
          <div class="select-none text-xs text-towni-brown-light-200">
            <span>({{ item._x.toString() }}</span>
            <span>,</span>
            <span>{{ item._y.toString() }})</span>
          </div>
        </div>
      </Transition>
      <div v-if="pulseColor" class="absolute right-1 top-1">
        <span class="relative flex">
          <span
            :class="[
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              pulseColor,
              nearLevel <= 5 ? 'h-2 w-2' : 'h-1 w-1',
            ]"
          />
          <span
            :class="[
              'relative inline-flex h-1 w-1 rounded-full',
              pulseColor,
              nearLevel <= 5 ? 'h-2 w-2' : 'h-1 w-1',
            ]"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CoordinateItem } from '~/types'
import { useUserGameStore } from '~/stores/userGame'
import Banner from '~/components/map/Banner.vue'

// --------[ Props & Emits ]-------- //
interface MapboxProps {
  item: CoordinateItem
}

const props = defineProps<MapboxProps>()

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()

const {
  user,
  getUserCountByCoordinate,
  getHasTownByCoordinate,
  nearLevel,
  isRegistered,
} = storeToRefs(userGameStore)

// --------[ Data ]-------- //
const isHovering = ref(false)
const coordinateX = ref('')
const coordinateY = ref('')

// --------[ Computed ]-------- //
const isCoordinateOfUser = computed(
  () =>
    props.item._x.toString() === user.value.coordinate._x.toString() &&
    props.item._y.toString() === user.value.coordinate._y.toString(),
)

const hasTown = computed(() =>
  getHasTownByCoordinate.value.get(getMapKey.value),
)

const getMapKey = computed(
  () => `${props.item._x.toString()},${props.item._y.toString()}`,
)

const pulseColor = computed(() => {
  const count = getUserCountByCoordinate.value.get(getMapKey.value)
  return count ? determinePulseColor(count) : ''
})

// --------[ Method ]-------- //
const determinePulseColor = (userCount: number): string => {
  if (userCount <= 1) return 'bg-green-500'
  if (userCount <= 10) return 'bg-yellow-600'
  return 'bg-red-500'
}

const showCoordinates = () => {
  isHovering.value = true
  coordinateX.value = props.item._x.toString()
  coordinateY.value = props.item._y.toString()
}

const hideCoordinates = () => {
  isHovering.value = false
}
</script>

<style scoped>
.knight {
  background-position: 50% 110%;
  background-size: 80%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
