<template>
  <div>
    <div class="group my-2 flex items-center shadow-towni-300">
      <div class="flex items-center">
        <Tooltip>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore,
            alias?
          </span>
        </Tooltip>
        <span class="flex items-center text-towni-brown-400">
          <slot name="list-title" />:
        </span>
      </div>
      <div class="flex flex-1 items-center justify-between">
        <div>
          <div v-if="isEdit" class="mx-1">
            <slot name="list-input" />
          </div>
          <span v-else class="mx-1 px-1 text-sm text-towni-brown-500">
            <slot />
          </span>
        </div>
        <div v-if="props.editable">
          <img
            v-if="isEdit"
            class="h-5 w-5 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            src="@/assets/img/check.svg"
            @click="saveName()"
          />
          <img
            v-else
            class="h-4 w-4 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            src="@/assets/img/edit.svg"
            @click="editName()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/Tooltip.vue'
const isEdit = ref(false)

const props = defineProps({
  editable: {
    type: Boolean,
    default: false,
    required: false,
  },
})

const editName = () => {
  isEdit.value = true
}
const saveName = () => {
  isEdit.value = false
}
</script>

<style scoped="slotted">
input {
  @apply w-full rounded-sm bg-towni-brown-200 bg-opacity-20 px-1 text-sm text-towni-brown-500 outline-none backdrop-blur;
}
</style>
