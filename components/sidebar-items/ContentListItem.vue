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
        <div v-if="editable">
          <img
            class="h-4 w-4 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            :src="isEdit ? '/assets/img/check.svg' : '/assets/img/edit.svg'"
            @click="isEdit ? saveName() : editName()"
          />
        </div>
        <div v-if="copiable">
          <img
            class="h-4 w-4 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            :src="isCopy ? '/assets/img/check.svg' : '/assets/img/copy.svg'"
            @click="isCopy || copy()"
          />
        </div>
        <img
          v-if="convertable"
          class="h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          src="@/assets/img/convert.svg"
          @click="convert()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/Tooltip.vue'
const isEdit = ref(false)
const isCopy = ref(false)

interface ContentListItemProps {
  editable?: boolean
  copiable?: boolean
  convertable?: boolean
  copyValue?: string
}

const props = defineProps<ContentListItemProps>()
const emit = defineEmits(['convert'])

const editName = () => {
  isEdit.value = true
}

const saveName = () => {
  isEdit.value = false
}

const copy = () => {
  navigator.clipboard.writeText(props.copyValue)
  isCopy.value = true
  setTimeout(() => (isCopy.value = false), 1000)
}

const convert = () => {
  emit('convert')
}
</script>

<style scoped="slotted">
input {
  @apply w-full rounded-sm bg-towni-brown-200 bg-opacity-20 px-1 text-sm text-towni-brown-500 outline-none backdrop-blur;
}
</style>
