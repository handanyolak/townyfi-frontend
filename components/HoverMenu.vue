<template>
  <div>
    <div
      class="absolute left-0 p-2 transition ease-in-out rounded-r-lg top-40 pl-7 bg-amber-900"
      :class="
        appOptionStore.isGameInfo
          ? 'translate-x-0'
          : 'duration-1000 -translate-x-6'
      "
      @mouseover="sideOver('isGameInfo')"
    >
      <img src="@/assets/img/sword-sidebar.svg" class="w-10 h-10" />
    </div>
    <div
      class="absolute left-0 p-2 transition ease-in-out rounded-r-lg top-80 pl-7 bg-amber-900"
      :class="
        appOptionStore.isWeb3Info
          ? 'translate-x-0'
          : 'duration-1000 -translate-x-6'
      "
      @mouseover="sideOver('isWeb3Info')"
    >
      <img src="@/assets/img/sword-sidebar.svg" class="w-10 h-10" />
    </div>
    <div
      class="absolute right-0 p-2 transition ease-in-out rounded-l-lg top-40 pr-7 bg-amber-900"
      :class="
        appOptionStore.isUserOptions
          ? 'translate-x-0'
          : 'duration-1000 translate-x-6'
      "
      @mouseover="sideOver('isUserOptions')"
    >
      <img src="@/assets/img/sword-sidebar.svg" class="w-10 h-10" />
    </div>
    <div
      class="absolute right-0 p-2 transition ease-in-out rounded-l-lg top-80 pr-7 bg-amber-900"
      :class="
        appOptionStore.isInteractions
          ? 'translate-x-0'
          : 'duration-1000 translate-x-6'
      "
      @mouseover="sideOver('isInteractions')"
    >
      <img src="@/assets/img/sword-sidebar.svg" class="w-10 h-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
const appOptionStore = useAppOptions()

// TODO: typescript named string type yapilacak drawerName: 'rawen' | 'sushi"
const sideOver = (drawerName: string) => {
  appOptionStore[drawerName] = true
  appOptionStore.showSidebar = true
}
</script>
