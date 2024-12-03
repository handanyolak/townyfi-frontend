<template>
  <div
    :style="size"
    class="zoom flex flex-col items-center justify-center bg-towny-brown-dark-600 px-4 py-1"
  >
    <ListTitle class="w-full text-sm shadow-md shadow-towny-brown-dark-400"
      >Zoom in / out</ListTitle
    >
    <div class="flex justify-around">
      <button @click="setNearLevelByCalculatingCoordinates(nearLevel - 1)">
        <img class="h-12 w-12" src="@/assets/img/zoom-in.svg" alt="zoom-in" />
      </button>
      <button @click="setNearLevelByCalculatingCoordinates(nearLevel + 1)">
        <img class="h-12 w-12" src="@/assets/img/zoom-out.svg" alt="zoom-out" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/common/ListTitle.vue'

// --------[ Prop & Emit ]-------- //
defineProps({
  size: {
    type: Object,
    required: true,
  },
})

// --------[ Store ]-------- //

const userGameStore = useUserGameStore()
const { setNearLevelByCalculatingCoordinates } = userGameStore
const { nearLevel } = storeToRefs(userGameStore)
</script>
