<template>
  <div
    class="towny-menu-image grid cursor-pointer md:grid-cols-3 md:shadow-2xl"
    @click="handleClick"
  >
    <div :class="positionClass">
      <p
        class="w-full px-2 py-1 text-center text-[10px] font-bold text-towny-brown-dark-300 md:text-xs"
      >
        <slot />
      </p>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DrawerName } from '~/enums'

// --------[ Prop ]-------- //
const props = defineProps<{
  drawerName: DrawerName
  left?: boolean
  right?: boolean
}>()

const emit = defineEmits(['toggle'])

// --------[ Method ]-------- //
const handleClick = () => {
  emit('toggle', props.drawerName)
}

// --------[ Computed ]-------- //
const positionClass = computed(() => {
  if (props.left) {
    return 'col-start-2 col-end-4'
  } else if (props.right) {
    return 'col-start-1 col-end-3'
  }
  return ''
})
</script>

<style scoped>
.towny-menu-image {
  background-image: linear-gradient(0deg, #c69666 70%, #e8d5b2 70%);
}
</style>
