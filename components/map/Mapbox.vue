<template>
  <div class="group relative shadow-towni-400">
    <div class="relative flex h-full flex-col items-center">
      <div
        :class="[
          ' flex h-full w-full ',
          hasTown ? 'flex-col items-center' : '',
          isRegistered && isCoordinateOfUser ? 'knight' : '',
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
      <div
        class="duration-400 absolute left-0 top-0 z-50 flex w-16 items-center justify-between bg-towni-brown-dark-600 bg-opacity-60 px-1 py-1 opacity-0 transition-opacity delay-1000 group-hover:opacity-100"
      >
        <div class="inline cursor-pointer">
          <img
            class="pointer-events-none h-4 w-4"
            src="@/assets/img/information.svg"
          />
        </div>
        <div class="select-none text-xs text-towni-brown-light-200">
          <span>({{ item._x.toString() }}</span>
          <span>,</span>
          <span>{{ item._y.toString() }})</span>
        </div>
      </div>
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
</script>

<style scoped>
.knight {
  background-image: url('~/assets/img/cavalry.svg');
  background-repeat: no-repeat;
  background-position: 50% 110%;
  background-size: 80%;
}
</style>
