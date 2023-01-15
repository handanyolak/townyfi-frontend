<template>
  <Transition
    :name="isGameInfo || isWeb3Info ? 'slide-left-fade' : 'slide-right-fade'"
  >
    <div
      v-if="appOptionStore.showSidebar"
      :class="[
        'fixed top-0 z-50 min-h-screen w-[500px]',
        isGameInfo || isWeb3Info ? '-left-3' : '-right-3',
      ]"
      @mouseleave="sideLeave()"
    >
      <div>
        <div
          :class="[
            'parchment absolute -top-3 w-full bg-white [filter:url(#wavy)]',
            appOptionStore.isUserOptions || appOptionStore.isInteractions
              ? 'rotate-180 transform'
              : '',
          ]"
        ></div>
        <div class="relative">
          <SidebarTabVue :tabs="tabs" />
        </div>

        <svg>
          <filter id="wavy">
            <feTurbulence
              x="0"
              y="0"
              baseFrequency="0.02"
              numOctaves="5"
              seed="1"
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import SidebarTabVue from '@/components/SidebarTab.vue'

const appOptionStore = useAppOptions()
const { isGameInfo, isWeb3Info } = storeToRefs(appOptionStore)
const tabs = ['User', 'Town']

const sideLeave = () => {
  console.log(isWeb3Info.value)
  console.log(isGameInfo.value)
  appOptionStore.showSidebar = false
  isGameInfo.value = false
  isWeb3Info.value = false
  appOptionStore.isUserOptions = false
  appOptionStore.isInteractions = false
  console.log(isWeb3Info.value)
  console.log(isGameInfo.value)
}
</script>

<style>
.slide-left-fade-enter-active,
.slide-left-fade-leave-active {
  transition: transform 0.8s ease;
}

.slide-left-fade-enter,
.slide-left-fade-leave-to {
  transform: translateX(-100%);
  transition: all 0.3s ease-out;
}

.slide-right-fade-enter-active,
.slide-right-fade-leave-active {
  transition: transform 0.8s ease;
}

.slide-right-fade-enter,
.slide-right-fade-leave-to {
  transform: translateX(100%);
  transition: all 0.3s ease-out;
}

.parchment {
  height: 105%;
  box-shadow: 2px 3px 20px #411c06, 30px 65px 200px #91510ffc inset;
}
</style>
