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
      <slot name="title" />
    </ListTitle>
    <div
      :class="[
        ' overflow-y-auto overflow-x-hidden transition-all duration-1000 ease-in-out',
        isOpen ? 'max-h-96' : 'max-h-0',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'

//--------[ Data ]--------//
const isOpen = ref(false)
const accordion = ref(null)

//--------[ Methods ]--------//
const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

onClickOutside(accordion, () => (isOpen.value = false))
</script>
