<template>
  <div
    style="box-shadow: 0px 1px 0px 1px rgba(255, 205, 116, 0.4)"
    class="group relative border-towni-brown-light-500 dark:border-[#02024c]"
    :class="isCoordinateOfUser ? 'bg-gray-200 dark:bg-gray-900' : ''"
  >
    <div class="absolute -top-7 flex w-full justify-between">
      <div
        class="invisible z-50 flex items-center justify-center group-hover:visible"
      >
        <div class="bg-towni-brown-light-100 font-bold dark:bg-[#040413]">
          <div
            class="bg-gradient-to-b from-[#bf841a] via-[#bf841a] to-[#ffcd74] bg-clip-text text-sm text-transparent"
          >
            <span>({{ item._x.toString() }}</span>
            <span>,</span>
            <span>{{ item._y.toString() }})</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-shadow flex h-20 w-20 items-center justify-center rounded-full"
      >
        <svg class="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <span
          :class="{
            
            'animate-ping bg-gray-500': getUserCountByCoordinate.get(getMapKey) === undefined,
            'bg-zinc-50': getUserCountByCoordinate.get(getMapKey) === 0, // TODO: remove this
            'bg-green-500': getUserCountByCoordinate.get(getMapKey) === 1, // TODO: use <= instead of ===
            'bg-yellow-500':
            getUserCountByCoordinate.get(getMapKey)!! > 2 && getUserCountByCoordinate.get(getMapKey)!! < 3,
            'animate-ping bg-red-500': getUserCountByCoordinate.get(getMapKey)!! >= 4,
          }"
          class="inline-block h-1 w-1 rounded-full"
        >
        </span>
      </div>
    </div>
    <div
      class="relative flex cursor-pointer flex-col items-center justify-center"
      @click="toggleModal()"
    >
      <img
        v-if="getHasTownByCoordinate.get(getMapKey)"
        src="@/assets/img/town.png"
      />
      <img v-else src="@/assets/img/skeleton-castle.png" class="invisible" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CoordinateItem } from '~/types'
import { useUserGameStore } from '~/stores/userGame'

const userGameStore = useUserGameStore()
const { user, getUserCountByCoordinate, getHasTownByCoordinate } =
  storeToRefs(userGameStore)
interface CastleBoxProps {
  item: CoordinateItem
}
const props = defineProps<CastleBoxProps>()

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}

const isCoordinateOfUser = computed(
  () =>
    props.item._x.toString() === user.value.coordinate._x.toString() &&
    props.item._y.toString() === user.value.coordinate._y.toString()
)

const getMapKey = computed(
  () => `${props.item._x.toString()},${props.item._y.toString()}`
)
</script>

<style>
/* .deneme3 {
  background-image: url('@/assets/img/map.png');
  background-position: 100% 89%;
  background-size: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  border: 1px solid;
}
.deneme4 {
  background-image: url('@/assets/img/map.png');

  background-size: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 100% 89%;
  border: 1px solid;
} */
</style>
