<template>
  <div>
    <Transition
      :name="isGameInfo || isWeb3Info ? 'slide-left-fade' : 'slide-right-fade'"
    >
      <div
        v-if="showSidebar"
        :class="[
          'fixed -top-3 z-50 min-h-screen w-96',
          isGameInfo || isWeb3Info ? '-left-4' : '-right-4',
        ]"
        @mouseleave="sideLeave()"
      >
        <div>
          <div
            :class="[
              'parchment absolute -top-3 w-full bg-white [filter:url(#wavy)]',
              isUserOptions || isInteractions ? 'rotate-180 transform' : '',
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
  </div>
</template>

<script setup lang="ts">
import SidebarTabVue from '@/components/SidebarTab.vue'

const appOptionStore = useAppOptions()
const { isGameInfo, isWeb3Info, isUserOptions, isInteractions, showSidebar } =
  storeToRefs(appOptionStore)

const tabs = ['User', 'Town']

const sideLeave = () => {
  showSidebar.value = false

  requestAnimationFrame(() => {
    isGameInfo.value = false
    isWeb3Info.value = false
    isUserOptions.value = false
    isInteractions.value = false
  })
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
