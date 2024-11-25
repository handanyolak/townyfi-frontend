<template>
  <div
    ref="scrollContainerRef"
    class="mx-4 h-screen overflow-y-auto px-4 pb-32"
  >
    <ul
      :class="[
        'sticky top-0 z-50 my-3 grid gap-y-1',
        `gap-x-${Math.round(6 / tabs.length)} grid-cols-${
          tabs.length > 4 ? 3 : tabs.length
        }`,
        {
          'bg-towny-brown-dark-300 bg-opacity-20  backdrop-blur': hasScrolled,
        },
      ]"
    >
      <li v-for="tab in tabs" :key="tab.id" class="text-center text-xs">
        <a
          :class="[
            'block rounded p-2 text-lg font-bold uppercase leading-normal shadow-lg shadow-towny-brown-dark-200 text-shadow md:text-xl',
            currentTabName === tab.name
              ? 'bg-towny-brown-dark-300 text-towny-brown-light-400'
              : 'cursor-pointer bg-towny-brown-light-400 text-towny-brown-dark-300 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-towny-brown-dark-300',
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

// --------[ Prop & Emit ]-------- //
interface SidebarTabProps {
  tabs: Tab[]
}

const props = defineProps<SidebarTabProps>()

// --------[ Data ]-------- //
const currentTabName = ref(props.tabs[0].name)
const currentTabComponent = ref(props.tabs[0].component)
const currentTabData = ref(props.tabs[0].data)
const currentTabFolder = ref(props.tabs[0].folder)
const scrollContainerRef = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainerRef)

// --------[ Computed ]-------- //
const currentComponent = computed(() => {
  const _currentTabComponent = currentTabComponent.value

  return defineAsyncComponent(
    () =>
      import(
        `../components/tabs/${currentTabFolder.value}/${_currentTabComponent}.vue`
      ),
  )
})

const hasScrolled = computed(() => y.value > 0)

// --------[ Method ]-------- //
const changeTab = (tab: Tab) => {
  useSound('demo_public_sounds_button', 'wav')
  currentTabName.value = tab.name
  currentTabComponent.value = tab.component
  currentTabData.value = tab.data
  currentTabFolder.value = tab.folder
}
</script>
