<template>
  <div class="mx-4 p-4">
    <ul class="my-3 grid space-x-2" :class="`grid-cols-${tabs.length}`">
      <li v-for="(tab, index) in tabs" :key="index" class="text-center">
        <a
          style="font-family: Pirata One, sans-serif"
          :class="[
            'block cursor-pointer rounded p-2 font-bold uppercase leading-normal shadow-lg',
            currentTabName === tab.name
              ? 'bg-towni-brown-dark-300 text-towni-brown-light-400 '
              : 'bg-towni-brown-light-400 text-towni-brown-dark-300 hover:shadow-towni-brown-dark-500',
          ]"
          @click="changeTab(tab)"
        >
          {{ tab.name }}
        </a>
      </li>
    </ul>
    <div class="w-full">
      <Component :is="currentComponent" class="tab"></Component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab } from '~/types'

interface ContentListItemProps {
  tabs: Tab[]
}

const props = defineProps<ContentListItemProps>()
const currentTabName = ref(props.tabs[0].name)
const currentTabComponent = ref(props.tabs[0].component)

const currentComponent = computed(() => {
  const _currentTabComponent = currentTabComponent.value

  return defineAsyncComponent(
    () => import(`../components/${_currentTabComponent}.vue`)
  )
})

const changeTab = (tab: Tab) => {
  currentTabName.value = tab.name
  currentTabComponent.value = tab.component
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
