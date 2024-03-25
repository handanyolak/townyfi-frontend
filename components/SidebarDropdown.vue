<template>
  <div class="flex items-center justify-center">
    <div class="relative z-10 w-full">
      <button
        class="flex w-full items-center justify-between bg-towni-brown-dark-300 bg-opacity-20 px-3 py-1 text-towni-brown-dark-300 outline-none backdrop-blur"
        :class="isRounded"
        @click="toggleDropdown()"
        @blur="showDropdown = false"
      >
        <img v-if="iconNames" class="mr-2 h-4 w-4" :src="dropdownIcon()" />
        <span class="capitalize">{{
          selectedItem || select || dropdownItems[0]
        }}</span>
        <img
          class="ml-2 block h-4 w-4 transform transition-transform duration-200 ease-in-out"
          :class="showDropdown ? 'rotate-180' : 'rotate-0'"
          src="@/assets/img/arrow-down.svg"
        />
      </button>
      <Transition name="dropdown">
        <div
          v-show="showDropdown"
          class="scrollbar-gutter-stable absolute left-0 right-0 mb-4 h-20 overflow-auto bg-towni-brown-dark-300 bg-opacity-20 backdrop-blur"
          :class="!showDropdown ? 'rounded-md' : 'rounded-b-2xl'"
        >
          <span
            v-for="(item, index) in props.dropdownItems"
            :key="index"
            class="flex h-10 cursor-pointer items-center px-4 py-2 duration-300 hover:brightness-200"
            @mousedown.prevent="selectItem(item)"
          >
            <img
              v-if="iconNames"
              class="mr-2 h-5 w-5"
              :src="dropdownIcon(iconNames[index])"
            />
            <p class="capitalize text-towni-brown-dark-300">
              {{ item }}
            </p>
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// --------[ Props & Emits ]-------- //
interface DropdownProps {
  dropdownItems: string[]
  iconNames?: string[]
  select?: string
  rounded?: boolean
}

interface DropdownExpose {
  selectedItem: Ref<string>
}

const props = defineProps<DropdownProps>()
const emit = defineEmits(['selected'])

// --------[ Data ]-------- //
const showDropdown = ref(false)
const selectedItem = ref(props.dropdownItems[0])

// --------[ Computed ]-------- //
const dropdownIcon = computed(
  () =>
    (icon = props.select) =>
      // @ts-ignore
      useSvg(icon),
)

const isRounded = computed(() => {
  if (!props.rounded) return ''
  return showDropdown.value ? 'rounded-t-2xl' : 'rounded-full'
})

// --------[ Methods ]-------- //
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectItem = (item: string) => {
  selectedItem.value = item

  emit('selected', selectedItem.value)

  toggleDropdown()
}

defineExpose<DropdownExpose>({
  selectedItem,
})
</script>

<style scoped>
.dropdown-enter-active {
  @apply ease-custom transform transition duration-500;
}

.dropdown-enter,
.dropdown-leave-to {
  @apply -translate-y-1/2 scale-y-0 opacity-0;
}

.dropdown-enter-to,
.dropdown-leave {
  @apply translate-y-0 scale-y-100 opacity-100;
}

.dropdown-leave-active {
  @apply ease-custom transform transition duration-300;
}

.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
