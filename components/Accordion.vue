<template>
  <div ref="accordion">
    <ListTitle
      class="cursor-pointer text-lg italic shadow-towni-200"
      @click="toggleAccordion()"
    >
      <img
        class="float-right h-5 w-5 transform transition-transform duration-700 ease-in-out"
        src="@/assets/img/arrow-down.svg"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
      />
      <slot name="address" />
    </ListTitle>
    <div
      :class="[
        ' overflow-auto transition-all duration-1000 ease-in-out',
        isOpen ? 'max-h-96' : 'max-h-0',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import ListTitle from './sidebar-items/ListTitle.vue'

const isOpen = ref(false)
const accordion = ref(null)

const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

onClickOutside(accordion, () => (isOpen.value = false))
</script>

<style scoped>
div::-webkit-scrollbar-thumb {
  background-color: #c57b34;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

div::-webkit-scrollbar {
  width: 12px;
  background: #e6c3a2;
  border-radius: 5px;
}
</style>
