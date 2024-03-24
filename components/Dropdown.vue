<template>
  <div class="flex items-center justify-center">
    <div class="relative z-40 w-16">
      <button
        class="flex items-center justify-between p-2 text-towni-brown-dark-600 outline-none dark:text-towni-brown-light-200"
        :class="!showDropdown ? 'rounded-md' : 'rounded-t-md'"
        @click="toggleDropdown()"
        @blur="showDropdown = false"
      >
        <img class="mr-1 h-4 w-4" :src="dropdownIcon()" />
        <span class="text-sm capitalize">{{ select }}</span>
        <img
          class="block h-4 w-4 transform transition-transform duration-200 ease-in-out"
          :class="showDropdown ? 'rotate-180' : 'rotate-0'"
          src="@/assets/img/arrow-down.svg"
        />
      </button>
      <Transition name="dropdown">
        <div
          v-show="showDropdown"
          class="scrollbar-gutter-stable absolute left-0 right-0 mb-4 h-20 overflow-auto bg-towni-brown-light-100 dark:bg-night-blue"
          :class="!showDropdown ? 'rounded-md' : 'rounded-b-md'"
        >
          <span
            v-for="(item, index) in props.dropdownItems"
            :key="index"
            class="flex h-10 cursor-pointer items-center border-t border-gray-300 p-2 duration-300 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            @mousedown.prevent="selectItem(item)"
          >
            <img
              v-if="iconNames"
              class="mr-1 h-4 w-4"
              :src="dropdownIcon(iconNames[index])"
            />

            <p
              class="text-sm capitalize text-towni-brown-dark-600 dark:text-towni-brown-light-200"
            >
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
}

const props = withDefaults(defineProps<DropdownProps>(), {
  select: 'en',
})
const emit = defineEmits(['selected'])

// --------[ Data ]-------- //
const showDropdown = ref(false)

// --------[ Computed ]-------- //
const dropdownIcon = computed(
  () =>
    (icon = props.select) =>
      useSvg(icon),
)

// --------[ Methods ]-------- //
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectItem = (item: string) => {
  emit('selected', item)

  toggleDropdown()
}
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
