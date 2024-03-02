<template>
  <div ref="scrollContainerRef" class="mx-4 max-h-screen overflow-y-auto p-4">
    <ul
      :class="[
        'sticky top-0 z-50 my-3 grid gap-y-1',
        `gap-x-${Math.round(6 / tabs.length)} grid-cols-${
          tabs.length > 4 ? 3 : tabs.length
        }`,
        {
          'bg-towni-brown-dark-300 bg-opacity-20  backdrop-blur': hasScrolled,
        },
      ]"
    >
      <li v-for="tab in tabs" :key="tab.id" class="text-center text-xs">
        <a
          style="font-family: Pirata One, sans-serif"
          :class="[
            'block rounded p-2 text-lg font-bold uppercase leading-normal shadow-lg',
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
      <Component
        :is="currentComponent"
        class="tab"
        :data="currentTabData"
      ></Component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tab } from '~/types'

//--------[ Props & Emits ]--------//
interface SidebarTabProps {
  tabs: Tab[]
}

const props = defineProps<SidebarTabProps>()

//--------[ Data ]--------//
const currentTabName = ref(props.tabs[0].name)
const currentTabComponent = ref(props.tabs[0].component)
const currentTabData = ref(props.tabs[0].data)
const scrollContainerRef = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainerRef)

//--------[ Computed ]--------//
const currentComponent = computed(() => {
  const _currentTabComponent = currentTabComponent.value

  return defineAsyncComponent(
    () => import(`../components/${_currentTabComponent}.vue`)
  )
})

const hasScrolled = computed(() => y.value > 0)

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
