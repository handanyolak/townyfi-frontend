<template>
  <div class="flex items-center justify-center">
    <div class="relative z-10">
      <button
        class="flex items-center justify-between bg-towni-brown-dark-300 bg-opacity-20 py-1 px-3 text-towni-brown-dark-300 outline-none backdrop-blur"
        :class="!showDropdown ? 'rounded-full' : 'rounded-t-2xl'"
        @click="toggleDropdown()"
        @blur="showDropdown = false"
      >
        <img class="mr-2 h-4 w-4" :src="dropdownIcon()" />
        <span class="capitalize">{{ select }}</span>
        <img
          class="ml-2 block h-4 w-4 transform transition-transform duration-200 ease-in-out"
          :class="showDropdown ? 'rotate-180' : 'rotate-0'"
          src="@/assets/img/arrow-down.svg"
        />
      </button>
      <Transition name="dropdown">
        <div
          v-show="showDropdown"
          class="absolute left-0 right-0 mb-4 h-20 overflow-auto bg-towni-brown-dark-300 bg-opacity-20 backdrop-blur"
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
/**
 * Props & Emits
 */
interface DropdownProps {
  dropdownItems: string[]
  iconNames?: string[]
  select?: String
}

const props = defineProps<DropdownProps>()
const emit = defineEmits(['selected'])

/**
 * Data
 */
const showDropdown = ref(false)

/**
 * Computations
 */
const dropdownIcon = computed(
  () =>
    (icon = props.select) =>
      // @ts-ignore
      useSvg(icon)
)

/**
 * Methods
 */
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
