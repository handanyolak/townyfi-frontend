<template>
  <div
    class="group relative shadow-towni-400"
    :class="isCoordinateOfUser ? 'bg-gray-200 dark:bg-gray-900' : ''"
  >
    <div class="relative flex flex-col items-center justify-center">
      <img
        v-if="getHasTownByCoordinate.get(getMapKey)"
        src="@/assets/img/town.png"
      />
      <img v-else src="@/assets/img/skeleton-castle.png" class="invisible" />
    </div>
    <div>
      <div
        class="duration-400 absolute top-0 left-0 z-50 flex w-16 items-center justify-between bg-towni-brown-dark-600 bg-opacity-60 px-1 py-1 opacity-0 transition-opacity delay-1000 group-hover:opacity-100"
      >
        <div @dblclick="toggleModal()" class="inline cursor-pointer">
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
      <div class="absolute top-1 right-1">
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
            class=""
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CoordinateItem } from '~/types'
import { useUserGameStore } from '~/stores/userGame'

//--------[ Props & Emits ]--------//
interface MapboxProps {
  item: CoordinateItem
}

const props = defineProps<MapboxProps>()
const emit = defineEmits(['modalOpened'])

//--------[ Stores ]--------//
const userGameStore = useUserGameStore()
const { user, getUserCountByCoordinate, getHasTownByCoordinate, nearLevel } =
  storeToRefs(userGameStore)

//--------[ Computeds ]--------//
const isCoordinateOfUser = computed(
  () =>
    props.item._x.toString() === user.value.coordinate._x.toString() &&
    props.item._y.toString() === user.value.coordinate._y.toString()
)

const getMapKey = computed(
  () => `${props.item._x.toString()},${props.item._y.toString()}`
)

const pulseColor = computed(() => {
  const userByCountByCoordinate = getUserCountByCoordinate.value.get(
    getMapKey.value
  )

  if (userByCountByCoordinate === undefined) {
    return 'bg-gray-500'
  } else if (userByCountByCoordinate === 0) {
    return 'bg-zinc-50'
  } else if (userByCountByCoordinate === 1) {
    return 'bg-green-500'
  } else if (userByCountByCoordinate!! >= 2 && userByCountByCoordinate!! <= 3) {
    return 'bg-yellow-600'
  } else if (userByCountByCoordinate!! >= 4) {
    return 'bg-red-500'
  }
})

//--------[ Methods ]--------//
/**
 * Bu fonksiyon Parent'a model acildi bilgisini verecek event'i yayinlayan fonksiyondur.
 * @Component Mapbox
 */
const toggleModal = () => {
  emit('modalOpened', props.item)
}
</script>
