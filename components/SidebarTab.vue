<template>
  <div class="mx-4 p-4">
    <ul class="my-3 grid grid-cols-2 space-x-2">
      <li v-for="(tab, index) in tabs" :key="index" class="text-center">
        <a
          style="font-family: Pirata One, sans-serif"
          :class="[
            'block cursor-pointer rounded p-2 font-bold uppercase leading-normal shadow-lg',
            currentTab === tab
              ? 'bg-towni-brown-200 text-towni-brown-100 '
              : 'bg-towni-brown-100 text-towni-brown-200 hover:shadow-towni-brown-300',
          ]"
          @click="changeTab(tab)"
        >
          {{ tab }}
        </a>
      </li>
    </ul>
    <div class="w-full">
      <Component :is="currentComponent" class="tab"></Component>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContentListItemProps {
  tabs: string[]
}
const props = defineProps<ContentListItemProps>()
const currentTab = ref(props.tabs[0])

const currentComponent = computed(() => {
  const _currentTab = currentTab.value

  return defineAsyncComponent(() => import(`/components/${_currentTab}.vue`))
})

const changeTab = (tab: string) => {
  currentTab.value = tab
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
