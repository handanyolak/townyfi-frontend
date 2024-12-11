<template>
  <div
    :style="size"
    class="return-back flex flex-col items-center justify-center bg-towny-brown-dark-600 px-4 py-1"
  >
    <AppButton
      class="my-2 w-full rounded-md bg-towny-brown-dark-400 text-towny-brown-light-400"
      @click="goBackToInitialPosition()"
    >
      Recenter!
    </AppButton>
    <AppButton
      v-if="hasUserTown && !isUserInTown"
      class="my-2 w-full rounded-md bg-towny-brown-dark-400 text-towny-brown-light-400"
      @click="teleportToTown()"
    >
      Teleport to Town!
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from '~/components/common/AppButton.vue'

// --------[ Store ]-------- //
const appOptionsStore = useAppOptionsStore()
const { clearModalInfo, setModalInfo } = appOptionsStore

const userGameStore = useUserGameStore()
const { setUserCoordinate } = userGameStore
const { user, town } = storeToRefs(userGameStore)

// --------[ Prop & Emit ]-------- //
defineProps({
  size: {
    type: Object,
    required: true,
  },
})

// --------[ Method ]-------- //

const goBackToInitialPosition = () => {
  setUserCoordinate({
    _x: BigInt(user.value.coordinate._x.toString()),
    _y: BigInt(user.value.coordinate._y.toString()),
  })
}

const teleportToTown = async () => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'travel-map',
    message: `Are you sure want to teleport to Town (${town.value.coordinate._x}, ${town.value.coordinate._y})?`,
  })

  if (!confirmed) {
    return
  }

  try {
  } catch (error) {
    console.error('Teleport transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}

// --------[ Computed ]-------- //
const hasUserTown = computed(() => user.value?.townInfo?.joinBlock !== 0n)

const isUserInTown = computed(() => {
  const userX = user.value?.coordinate?._x.toString()
  const userY = user.value?.coordinate?._y.toString()
  const townX = town.value?.coordinate?._x.toString()
  const townY = town.value?.coordinate?._y.toString()

  return userX === townX && userY === townY
})
</script>
