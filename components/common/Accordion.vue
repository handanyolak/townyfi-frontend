<template>
  <div ref="accordion">
    <ListTitle
      class="cursor-pointer text-lg italic shadow-towny-200"
      @click="toggleAccordion()"
    >
      <img
        class="float-right h-5 w-5 transform transition-transform duration-700 ease-in-out"
        src="@/assets/img/arrow-down.svg"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
      />
      <div class="group flex">
        <Tooltip v-if="tooltip" class="self-center">
          <slot name="tooltip" />
        </Tooltip>
        <slot name="title" />
      </div>
    </ListTitle>
    <div
      :style="dropdown ? 'height: 100vh;' : ''"
      :class="[
        ' scrollbar-gutter-stable overflow-y-auto overflow-x-hidden transition-all duration-100 ease-in-out',
        isOpen ? 'max-h-96' : 'max-h-0',
      ]"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import ListTitle from '~/components/common/ListTitle.vue'
import Tooltip from '~/components/common/Tooltip.vue'

// --------[ Props & Emits ]-------- //
interface AccordionProps {
  dropdown?: boolean
  tooltip?: boolean
}

defineProps<AccordionProps>()

// --------[ Data ]-------- //
const isOpen = ref(false)
const accordion = ref(null)

// --------[ Methods ]-------- //
const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

onClickOutside(accordion, () => (isOpen.value = false))
</script>
