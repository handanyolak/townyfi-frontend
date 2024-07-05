<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    :target="target"
    :class="componentClasses"
    @click="handleClick"
  >
    <div :class="divClasses">
      <slot />
      <Icon v-if="isLoading" class="ml-1" name="svg-spinners:ring-resize" />
    </div>
  </component>
</template>

<script setup lang="ts">
// --------[ Props & Emits ]-------- //
interface ButtonThemeProps {
  fillHover?: boolean
  borderHover?: boolean
  basicHover?: boolean
  inlineClass?: string
  isLoading?: boolean
  href?: string
  target?: string
}

const props = defineProps<ButtonThemeProps>()

// --------[ Computed ]-------- //
const tag = computed(() => (props.href ? 'a' : 'button'))

const componentClasses = computed(() => [
  'mx-auto rounded-full bg-gradient-to-tr from-towny-brown-dark-300 via-towny-brown-dark-200 to-towny-brown-light-400 p-[2px] text-sm transition duration-500 ease-in-out disabled:opacity-50',
  props.fillHover || props.borderHover ? 'group' : '',
  props.basicHover
    ? 'shadow-lg shadow-towny-brown-dark-200 hover:from-towny-brown-dark-300 hover:via-towny-brown-dark-300 hover:to-towny-brown-light-500 hover:shadow-towny-brown-dark-500'
    : '',
])

const divClasses = computed(() => [
  'rounded-full px-4 py-2 duration-500 ease-in-out',
  props.inlineClass,
  props.fillHover
    ? 'bg-towny-brown-light-100 text-towny-brown-dark-200 group-hover:bg-transparent group-hover:text-white dark:bg-night-blue'
    : 'bg-transparent text-white dark:group-hover:bg-night-blue',
])

// --------[ Method ]-------- //
const handleClick = () => {
  if (tag.value === 'button' && props.href) {
    window.location.href = props.href
  }
}
</script>
