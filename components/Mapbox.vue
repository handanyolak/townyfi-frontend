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
        class="duration-400 absolute top-0 left-0 z-50 flex w-16 items-center justify-between bg-towni-brown-dark-600 bg-opacity-60 px-1 py-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <img
          @click="toggleModal()"
          class="h-4 w-4 cursor-pointer"
          src="@/assets/img/information.svg"
        />
        <div class="text-xs text-towni-brown-light-200">
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
              pulse,
              nearLevel <= 5 ? 'h-2 w-2' : 'h-1 w-1',
            ]"
          />
          <span
            :class="[
              'relative inline-flex h-1 w-1 rounded-full',
              pulse,
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

const pulseColor = ref('')

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

const pulse = computed(() => {
  if (getUserCountByCoordinate.value.get(getMapKey.value) === undefined) {
    pulseColor.value = 'bg-gray-500'
  } else if (getUserCountByCoordinate.value.get(getMapKey.value) === 0) {
    pulseColor.value = 'bg-zinc-50'
  } else if (getUserCountByCoordinate.value.get(getMapKey.value) === 1) {
    pulseColor.value = 'bg-green-500'
  } else if (
    getUserCountByCoordinate.value.get(getMapKey.value)!! >= 2 &&
    getUserCountByCoordinate.value.get(getMapKey.value)!! <= 3
  ) {
    pulseColor.value = 'bg-yellow-600'
  } else if (getUserCountByCoordinate.value.get(getMapKey.value)!! >= 4) {
    pulseColor.value = 'bg-red-500'
  }
  return pulseColor.value
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
