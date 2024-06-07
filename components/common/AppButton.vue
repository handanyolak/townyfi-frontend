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
  'mx-auto rounded-full bg-gradient-to-tr from-towni-brown-dark-300 via-towni-brown-dark-200 to-towni-brown-light-400 p-[2px] text-sm transition duration-500 ease-in-out disabled:opacity-50',
  props.fillHover || props.borderHover ? 'group' : '',
  props.basicHover
    ? 'shadow-lg shadow-towni-brown-dark-200 hover:from-towni-brown-dark-300 hover:via-towni-brown-dark-300 hover:to-towni-brown-light-500 hover:shadow-towni-brown-dark-500'
    : '',
])

const divClasses = computed(() => [
  'rounded-full px-4 py-2 duration-500 ease-in-out',
  props.inlineClass,
  props.fillHover
    ? 'bg-towni-brown-light-100 text-towni-brown-dark-200 group-hover:bg-transparent group-hover:text-white dark:bg-night-blue'
    : 'bg-transparent text-white dark:group-hover:bg-night-blue',
])

// --------[ Method ]-------- //
const handleClick = () => {
  if (tag.value === 'button' && props.href) {
    window.location.href = props.href
  }
}
</script>
