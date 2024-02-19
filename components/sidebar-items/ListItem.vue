<template>
  <div class="group my-2 flex p-1 shadow-towni-300">
    <div class="flex items-center">
      <Tooltip v-if="tooltip">
        <slot name="tooltip" />
      </Tooltip>
      <span class="text-towni-brown-dark-400">
        {{ title }}
      </span>
    </div>
    <div class="flex flex-1 items-center justify-between">
      <div class="flex w-full">
        <div v-if="isEdit || input" class="mx-1 w-full">
          <slot name="item" />
        </div>
        <span
          v-else
          class="mx-1 flex w-full items-center px-1 text-towni-brown-dark-600"
        >
          <slot />
          <div v-if="copiable" class="ml-2">
            <Tooltip
              :icon-name="isCopy ? 'uil:check-circle' : 'uil:copy'"
              auto-close
              @action="isCopy || copy()"
            >
              <span> Copied! </span>
            </Tooltip>
          </div>
        </span>
      </div>
      <div v-if="editable">
        <Icon
          @click="isEdit ? save() : edit()"
          :name="isEdit ? 'uil:check-circle' : 'uil:edit'"
          class="h-4 w-4 cursor-pointer text-towni-brown-dark-300 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
      </div>
      <div>
        <slot name="action" />
      </div>
      <div
        @click="convert()"
        v-if="convertable"
        class="mr-2 h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
      >
        <client-only>
          <Vue3Lottie
            :animation-data="Convert"
            :auto-play="isConvert"
            :pause-animation="!isConvert"
            height="20px"
            width="20px"
            scale="1.3"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/Tooltip.vue'
import { Vue3Lottie } from 'vue3-lottie'
import Convert from '~/assets/lotties/convert.json'

//--------[ Props & Emits ]--------//
// TODO: change name to file name (ListItemProps)
interface ContentListItemProps {
  item?: string
  input?: boolean
  title?: string
  tooltip?: boolean
  editable?: boolean
  copiable?: boolean
  copyValue?: string
  convertable?: boolean
}

const props = withDefaults(defineProps<ContentListItemProps>(), {
  copyValue: '',
})

const emit = defineEmits<{
  (event: 'convert', isConvert: boolean): void
  (event: 'saved'): void
}>()

//--------[ Data ]--------//
const isEdit = ref(false)
const isCopy = ref(false)
const isConvert = ref(false)

//--------[ Methods ]--------//
const edit = () => {
  isEdit.value = true
}

const save = () => {
  isEdit.value = false
  emit('saved')
}

const copy = () => {
  navigator.clipboard.writeText(props.copyValue)
  isCopy.value = true
  setTimeout(() => (isCopy.value = false), 1000)
}

const convert = () => {
  emit('convert', (isConvert.value = !isConvert.value))
}
</script>

<style scoped>
:deep(input) {
  @apply w-full rounded-sm bg-towni-brown-dark-300 bg-opacity-20 px-1 text-towni-brown-dark-600 outline-none backdrop-blur;
}
</style>
