<template>
  <div>
    <div class="group my-2 flex items-start p-1 shadow-towni-300">
      <div class="flex items-center">
        <Tooltip v-if="tooltip">
          <template #tooltip-image>
            <img
              class="mr-1 h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              src="@/assets/img/information.svg"
            />
          </template>
          <slot name="tooltip" />
        </Tooltip>
        <span class="flex items-center text-towni-brown-dark-400">
          <slot name="title" />
        </span>
      </div>
      <div class="flex flex-1 items-start justify-between">
        <div class="w-full">
          <div v-if="isEdit || input" class="mx-1">
            <slot name="item" />
          </div>
          <span v-else class="mx-1 px-1 text-towni-brown-dark-600">
            <slot />
          </span>
        </div>
        <div v-if="editable">
          <img
            class="h-4 w-4 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            :src="isEdit ? languageIcon('check') : languageIcon('edit')"
            @click="isEdit ? save() : edit()"
          />
        </div>
        <div v-if="copiable">
          <Tooltip auto-close>
            <template #tooltip-image>
              <img
                class="h-4 w-4 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                :src="isCopy ? languageIcon('check') : languageIcon('copy')"
                @click="isCopy || copy()"
              />
            </template>
            <span> Copied! </span>
          </Tooltip>
        </div>
        <slot name="action-icon" />
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
const isConvert = ref(false)

interface ContentListItemProps {
  editable?: boolean
  copiable?: boolean
  convertable?: boolean
  input?: boolean
  tooltip?: boolean
  copyValue?: string
  item?: string
}
const props = defineProps<ContentListItemProps>()
const emit = defineEmits(['convert'])

const edit = () => {
  isEdit.value = true
}

const languageIcon = computed(() => (_language: string) => useSvg(_language))

const save = () => {
  isEdit.value = false
}

const copy = () => {
  navigator.clipboard.writeText(props.copyValue)
  isCopy.value = true
  setTimeout(() => (isCopy.value = false), 1000)
}

const convert = () => {
  isConvert.value = !isConvert.value
  emit('convert', isConvert.value)
}
</script>

<style scoped>
:deep(input) {
  @apply w-full rounded-sm bg-towni-brown-dark-300 bg-opacity-20 px-1 text-towni-brown-dark-600 outline-none backdrop-blur;
}
</style>
