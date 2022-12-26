<template>
  <Transition
    :name="
      appOptionStore.isWeb3Info || appOptionStore.isGameInfo
        ? 'slide-left-fade'
        : 'slide-right-fade'
    "
  >
    <div
      v-if="appOptionStore.showSidebar"
      :class="
        appOptionStore.isGameInfo || appOptionStore.isWeb3Info
          ? 'left-0'
          : 'right-0'
      "
      class="fixed top-0 z-50 min-h-screen w-[500px] bg-gray-400 p-3"
      @mouseleave="sideLeave()"
    >
      <div>Sidebar</div>
      <SidebarTabVue />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import SidebarTabVue from '~/components/SidebarTab.vue'
const appOptionStore = useAppOptions()

const sideLeave = () => {
  appOptionStore.showSidebar = false
  appOptionStore.isGameInfo = false
  appOptionStore.isWeb3Info = false
  appOptionStore.isUserOptions = false
  appOptionStore.isInteractions = false
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
</style>
