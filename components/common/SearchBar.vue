<template>
  <div>
    <div class="relative flex items-center">
      <div class="relative w-full">
        <VeeForm class="flex flex-col items-center">
          <VeeField
            name="name"
            type="text"
            class="block w-full rounded-lg border border-towny-brown-dark-100 bg-towny-brown-dark-300 bg-opacity-20 p-2.5 px-1 pl-3 text-sm text-towny-brown-dark-600 outline-none backdrop-blur focus:border-towny-brown-dark-300"
            placeholder="Search"
            :rules="inputValue ? rules : undefined"
            @input="updateValue($event)"
            @keydown.enter.prevent="searched()"
          />
          <VeeErrorMessage class="text-red-800" name="name" />
        </VeeForm>
      </div>
      <button
        :disabled="!isDisable"
        class="absolute right-0 top-1 cursor-pointer p-1"
        @click="searched()"
      >
        <img class="h-6 w-6" src="@/assets/img/search-icon.svg" />
        <span class="sr-only">Search</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StringSchema } from 'yup'

// --------[ Props & Emits ]-------- //
const emit = defineEmits(['update:modelValue', 'searched'])

interface SearchBarProps {
  rules?: StringSchema
  isDisable?: Boolean
}

defineProps<SearchBarProps>()

// --------[ Data ]-------- //
const inputValue = ref('')

// --------[ Methods ]-------- //
const updateValue = ({ target }: InputEvent) => {
  inputValue.value = (target as HTMLInputElement).value
  emit('update:modelValue', inputValue.value)
}

const searched = () => {
  emit('searched')
}
</script>
