<template>
  <div>
    <div
      class="towny-menu-image absolute left-0 top-40 rounded-r-lg pl-7 shadow-2xl transition ease-in-out"
      :class="
        appOptionStore.isGameInfo
          ? 'translate-x-0'
          : '-translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isGameInfo')"
    >
      <span class="w-full text-xs text-towni-brown-200">Game</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute left-0 bottom-40 rounded-r-lg pl-7 shadow-2xl transition ease-in-out"
      :class="
        appOptionStore.isWeb3Info
          ? 'translate-x-0'
          : '-translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isWeb3Info')"
    >
      <span class="w-full text-xs text-towni-brown-200">Wallet</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute right-0 top-40 rounded-l-lg pr-7 shadow-2xl transition ease-in-out"
      :class="
        appOptionStore.isUserOptions
          ? 'translate-x-0'
          : 'translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isUserOptions')"
    >
      <span class="w-full pl-[7px] text-xs text-towni-brown-200">Actions</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute right-0 bottom-40 rounded-l-lg pr-7 shadow-2xl transition ease-in-out"
      :class="
        appOptionStore.isInteractions
          ? 'translate-x-0 '
          : 'translate-x-6  duration-1000'
      "
      @mouseover="sideOver('isInteractions')"
    >
      <span class="w-full pl-[7px] text-xs text-towni-brown-200">Options</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
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

<style scoped>
.towny-menu-image {
  background-image: linear-gradient(0deg, #c69666 70%, #e8d5b2 70%);
}
</style>
