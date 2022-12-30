<template>
  <div class="flex items-center justify-center">
    <div class="relative z-50 w-16">
      <button
        class="flex items-center justify-between p-2 shadow-md shadow-gray-200 outline-none dark:bg-gray-900 dark:text-white"
        :class="!isLanguage ? 'rounded-md' : 'rounded-t-md'"
        @click="toggleLanguage()"
        @blur="isLanguage = false"
      >
        <img class="mr-1 h-4 w-4" :src="`/assets/img/${selectedOption}.svg`" />
        <span class="text-sm capitalize">{{ selectedOption }}</span>
        <img
          class="block h-4 w-4 transform transition-transform duration-200 ease-in-out dark:hidden"
          :class="isLanguage ? 'rotate-180' : 'rotate-0'"
          src="@/assets/img/arrow-down.svg"
        />
        <img
          class="hidden h-4 w-4 transform transition-transform duration-200 ease-in-out dark:block"
          :class="isLanguage ? 'rotate-180' : 'rotate-0'"
          src="@/assets/img/arrow-down-white.svg"
        />
      </button>
      <transition name="dropdown">
        <ul
          v-show="isLanguage"
          class="overflow-aut absolute left-0 right-0 mb-4 h-20 divide-y shadow-md shadow-gray-200 dark:bg-gray-900"
          :class="!isLanguage ? 'rounded-md' : 'rounded-b-md'"
        >
          <li
            v-for="(option, index) in options"
            :key="index"
            class="flex h-10 cursor-pointer items-center border-t border-gray-300 p-2 transition-colors duration-300 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            @mousedown.prevent="setOption(option)"
          >
            <img class="mr-1 h-4 w-4" :src="`/assets/img/${option}.svg`" />
            <p class="text-sm capitalize dark:text-white">{{ option }}</p>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLanguage = ref(false)
const options = ['en', 'tr']
const useUserOptions = useUserOptionsStore()
const { language } = storeToRefs(useUserOptions)
const selectedOption = ref(language)

const setOption = (option: string) => {
  selectedOption.value = option
  localStorage.setItem('lang', option)
  useUserOptions.setLanguage(language.value)
  isLanguage.value = false
}

const toggleLanguage = () => {
  isLanguage.value = !isLanguage.value
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

ul::-webkit-scrollbar-thumb {
  background-color: #999999;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

ul::-webkit-scrollbar {
  width: 12px;
  background: #e6e6e6;
  border-radius: 5px;
}
</style>
