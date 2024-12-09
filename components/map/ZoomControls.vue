<template>
  <div
    :style="size"
    class="zoom flex flex-col items-center justify-center bg-towny-brown-dark-600 px-4 py-1"
  >
    <div class="flex justify-around space-x-4">
      <button
        class="select-none transition-transform duration-75 active:scale-95"
        @click="setNearLevelByCalculatingCoordinates(nearLevel - 1)"
      >
        <img class="h-16 w-16" src="@/assets/img/zoom-in.svg" alt="zoom-in" />
      </button>
      <button
        class="select-none transition-transform duration-75 active:scale-95"
        @click="setNearLevelByCalculatingCoordinates(nearLevel + 1)"
      >
        <img
          class="h-16 w-16 -rotate-90 transform"
          src="@/assets/img/zoom-out.svg"
          alt="zoom-out"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
