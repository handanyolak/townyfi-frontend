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
          <div v-if="isSupported && copiable" class="ml-2">
            <Tooltip
              :icon-name="copied ? 'uil:check-circle' : 'uil:copy'"
              auto-close
              @action="copied || copy(copyValue)"
            >
              <span> Copied! </span>
            </Tooltip>
          </div>
        </span>
      </div>
      <div v-if="editable">
        <Icon
          :name="isEdit ? 'uil:check-circle' : 'uil:edit'"
          class="h-4 w-4 cursor-pointer text-towni-brown-dark-300 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          @click="isEdit ? save() : edit()"
        />
      </div>
      <div>
        <slot name="action" />
      </div>
      <div
        v-if="convertable"
        class="mr-2 h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        @click="convert()"
      >
        <client-only>
          <Vue3Lottie
            :animation-data="Convert"
            :auto-play="isConvert"
            :pause-animation="!isConvert"
            height="20px"
            width="20px"
            :scale="1.3"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import { useClipboard } from '@vueuse/core'
import Tooltip from '~/components/common/Tooltip.vue'
import Convert from '~/assets/lotties/convert.json'

const { copy, copied, isSupported } = useClipboard({
  legacy: true,
})

// --------[ Props & Emits ]-------- //
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

withDefaults(defineProps<ContentListItemProps>(), {
  item: '',
  title: '',
  copyValue: '',
})

const emit = defineEmits<{
  (event: 'convert', isConvert: boolean): void
  (event: 'saved'): void
}>()

// --------[ Data ]-------- //
const isEdit = ref(false)
const isConvert = ref(false)

// --------[ Methods ]-------- //
const edit = () => {
  isEdit.value = true
}

const save = () => {
  isEdit.value = false
  emit('saved')
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
