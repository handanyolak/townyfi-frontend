<template>
  <div
    :style="size"
    class="move flex flex-col items-center justify-center bg-towny-brown-dark-600 px-4 py-1"
  >
    <ListTitle class="w-full shadow-md shadow-towny-brown-dark-400"
      ><span class="text-sm">Move</span></ListTitle
    >
    <div class="relative mt-6 flex items-center justify-center p-10">
      <MoveArrow
        class="rotate-90"
        @click="navigateByArrow(NavigateDirection.Down)"
      />
      <MoveArrow
        class="-rotate-90"
        @click="navigateByArrow(NavigateDirection.Up)"
      />
      <MoveArrow
        class="rotate-0"
        @click="navigateByArrow(NavigateDirection.Right)"
      />
      <MoveArrow
        class="rotate-180"
        @click="navigateByArrow(NavigateDirection.Left)"
      />
      <MoveArrow
        class="rotate-45"
        @click="navigateByArrow(NavigateDirection.RightDown)"
      />
      <MoveArrow
        class="-rotate-45"
        @click="navigateByArrow(NavigateDirection.UpRight)"
      />
      <MoveArrow
        class="rotate-[135deg]"
        @click="navigateByArrow(NavigateDirection.DownLeft)"
      />
      <MoveArrow
        class="-rotate-[135deg]"
        @click="navigateByArrow(NavigateDirection.LeftUp)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavigateDirection } from '~/enums'
import ListTitle from '~/components/common/ListTitle.vue'
import MoveArrow from '~/components/map/MoveArrow.vue'

// --------[ Store ]-------- //
const appOptionsStore = useAppOptionsStore()
const { originCoordinate } = storeToRefs(appOptionsStore)

const userGameStore = useUserGameStore()
const { setUserCoordinate } = userGameStore

// --------[ Prop & Emit ]-------- //
defineProps({
  size: {
    type: Object,
    required: true,
  },
})

// --------[ Method ]-------- //

const navigateByArrow = (direction: NavigateDirection) => {
  let { _x, _y } = originCoordinate.value
  const navigateValue = 1n

  switch (direction) {
    case NavigateDirection.Up:
      _y += navigateValue
      break
    case NavigateDirection.UpRight:
      _x += navigateValue
      _y += navigateValue
      break
    case NavigateDirection.Right:
      _x += navigateValue
      break
    case NavigateDirection.RightDown:
      _x += navigateValue
      _y -= navigateValue
      break
    case NavigateDirection.Down:
      _y -= navigateValue
      break
    case NavigateDirection.DownLeft:
      _x -= navigateValue
      _y -= navigateValue
      break
    case NavigateDirection.Left:
      _x -= navigateValue
      break
    case NavigateDirection.LeftUp:
      _x -= navigateValue
      _y += navigateValue
      break
    default:
      console.error('Invalid navigation direction')
  }

  setUserCoordinate({ _x, _y })
}
</script>
