<template>
  <div
    class="group relative grid grid-cols-1 p-1 py-4 text-sm shadow-towny-400 md:grid-cols-4 md:text-base"
  >
    <div class="botom-1/2 absolute -left-4 top-1/2 -translate-y-1/2">
      <Tooltip v-if="hasTooltipSlot">
        <slot name="tooltip" />
      </Tooltip>
    </div>
    <div
      :class="[
        'flex items-center',
        hasActionSlot || convertable ? 'col-span-3' : 'col-span-4',
      ]"
    >
      <div class="flex w-full justify-center md:justify-start">
        <span class="font-semibold text-[#8b4513cc]">
          {{ title }}
        </span>
        <div class="flex">
          <div v-if="(!editable || isEdit) && hasItemSlot" class="mx-1 w-full">
            <slot name="item" />
          </div>
          <span
            v-else
            class="mx-1 flex w-full items-center px-1 text-towny-brown-dark-600"
          >
            <span
              v-if="searchable"
              :class="searchable ? 'cursor-pointer text-blue-500' : ''"
              @click="
                clearModalInfo() && setModalInfo('SearchModal', searchOptions)
              "
              ><slot
            /></span>
            <slot v-else />
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
          <div v-if="editable">
            <Icon
              :name="isEdit ? 'uil:check-circle' : 'uil:edit'"
              class="h-4 w-4 cursor-pointer text-towny-brown-dark-300 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              @click="isEdit ? save() : edit()"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="hasActionSlot || convertable"
      class="flex items-center justify-center md:justify-end"
    >
      <div v-if="hasActionSlot" class="mt-2 flex justify-center md:mt-0">
        <slot name="action" />
      </div>
      <div
        v-if="convertable"
        class="mr-2 h-3 w-3 cursor-pointer transition-opacity duration-500 ease-out"
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
import { SearchType, FindOptions } from '~/enums'

const appOptionStore = useAppOptionsStore()
const { setModalInfo, clearModalInfo } = appOptionStore

const { copy, copied, isSupported } = useClipboard({
  legacy: true,
})

// --------[ Prop & Emit ]-------- //
interface ListItemProps {
  item?: string
  title?: string
  editable?: boolean
  convertable?: boolean
  copiable?: boolean
  copyValue?: string
  searchable?: boolean
  searchOptions?: {
    searchType: SearchType
    findBy: FindOptions
    findInputText: string | bigint
  }
}

withDefaults(defineProps<ListItemProps>(), {
  item: '',
  title: '',
  copyValue: '',
})

const emit = defineEmits<{
  (event: 'convert', isConvert: boolean): void
  (event: 'saved'): void
}>()

const slots = useSlots()
const hasActionSlot = !!slots.action
const hasTooltipSlot = !!slots.tooltip
const hasItemSlot = !!slots.item

// --------[ Data ]-------- //
const isEdit = ref(false)
const isConvert = ref(false)

// --------[ Method ]-------- //
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

<style lang="postcss" scoped>
:deep(input) {
  @apply w-full rounded-sm bg-towny-brown-dark-300 bg-opacity-20 px-1 text-towny-brown-dark-600 outline-none backdrop-blur;
}
</style>
