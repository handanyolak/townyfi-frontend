<template>
  <div class="mx-4 p-4">
    <ul class="my-3 grid gap-y-1" :class="`gap-x-${Math.round(6 / tabs.length)} grid-cols-${tabs.length > 4 ? 3 : tabs.length}`">
      <li v-for="(tab, index) in tabs" :key="index" class="text-center text-xs">
        <a
          style="font-family: Pirata One, sans-serif"
          :class="[
            'block rounded p-2 font-bold uppercase leading-normal shadow-lg text-lg',
            currentTabName === tab.name
              ? 'bg-towni-brown-dark-300 text-towni-brown-light-400 '
              : 'cursor-pointer bg-towni-brown-light-400 text-towni-brown-dark-300 hover:shadow-towni-brown-dark-500',
          ]"
          @click="changeTab(tab)"
        >
          {{ tab.name }}
        </a>
      </li>
    </ul>
    <div class="w-full">
      <Component :is="currentComponent" class="tab" :data="currentTabData"></Component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab } from '~/types'

//--------[ Props & Emits ]--------//
// TODO: change name to file name (SidebarTabItemProps)
interface ContentListItemProps {
  tabs: Tab[]
}

const props = defineProps<ContentListItemProps>()

//--------[ Data ]--------//
const currentTabName = ref(props.tabs[0].name)
const currentTabComponent = ref(props.tabs[0].component)
const currentTabData = ref(props.tabs[0].data)

//--------[ Computed ]--------//
const currentComponent = computed(() => {
  const _currentTabComponent = currentTabComponent.value

  return defineAsyncComponent(
    () => import(`../components/${_currentTabComponent}.vue`)
  )
})

//--------[ Methods ]--------//
const changeTab = (tab: Tab) => {
  useSound('demo_public_sounds_button', 'wav')
  currentTabName.value = tab.name
  currentTabComponent.value = tab.component
  currentTabData.value = tab.data
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
