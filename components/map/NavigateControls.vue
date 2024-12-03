<template>
  <div
    :style="size"
    class="navigate flex flex-col items-center justify-center bg-towny-brown-dark-600 px-4 py-1"
  >
    <ListTitle class="w-full text-sm shadow-md shadow-towny-brown-dark-400"
      >Navigate</ListTitle
    >
    <div class="flex items-center rounded-md p-1">
      <div class="flex flex-col">
        <div class="flex">
          <ListItem class="shadow-none" title="X:" input>
            <template #item>
              <input v-model="coordinateX" type="text" />
            </template>
            <span>{{ coordinateX }}</span>
          </ListItem>
          <ListItem class="shadow-none" title="Y:" input>
            <template #item>
              <input v-model="coordinateY" type="text" />
            </template>
            <span>{{ coordinateY }}</span>
          </ListItem>
        </div>
        <AppButton
          class="w-full rounded-md bg-towny-brown-dark-400 text-towny-brown-light-400"
          @click="navigate()"
        >
          Go!
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/common/ListTitle.vue'
import AppButton from '~/components/common/AppButton.vue'

// --------[ Store ]-------- //

const userGameStore = useUserGameStore()
const { setUserCoordinate } = userGameStore

// --------[ Prop & Emit ]-------- //
defineProps({
  size: {
    type: Object,
    required: true,
  },
})

// --------[ Data ]-------- //
const coordinateX = ref('')
const coordinateY = ref('')

// --------[ Method ]-------- //
const navigate = () => {
  setUserCoordinate({
    _x: BigInt(coordinateX.value),
    _y: BigInt(coordinateY.value),
  })
}
</script>
