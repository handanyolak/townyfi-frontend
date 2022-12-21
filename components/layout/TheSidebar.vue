<template>
  <Transition name="slide-fade">
    <div
      v-if="appOptionStore.showSidebar"
      class="fixed top-0 z-50 min-h-screen bg-gray-400 w-[500px] p-3"
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
}
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition-delay: 1s;
  transition: transform 0.8s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-100%);
  transition: all 0.3s ease-out;
}
</style>
