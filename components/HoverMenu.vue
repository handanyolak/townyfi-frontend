<template>
  <div>
    <div
      class="towny-menu-image absolute left-0 top-40 cursor-pointer rounded-r-lg pl-7 shadow-2xl transition ease-in-out"
      :class="isGameInfo ? 'translate-x-0' : '-translate-x-6 duration-1000'"
      @click="sideOver('isGameInfo')"
    >
      <span class="w-full pl-2 text-xs text-towni-brown-dark-300">Game</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute left-0 bottom-40 cursor-pointer rounded-r-lg pl-7 shadow-2xl transition ease-in-out"
      :class="isWeb3Info ? 'translate-x-0' : '-translate-x-6 duration-1000'"
      @click="sideOver('isWeb3Info')"
    >
      <span class="w-full pl-2 text-xs text-towni-brown-dark-300">Wallet</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute right-0 top-40 cursor-pointer rounded-l-lg pr-7 shadow-2xl transition ease-in-out"
      :class="isUserOptions ? 'translate-x-0' : 'translate-x-6 duration-1000'"
      @click="sideOver('isUserOptions')"
    >
      <span class="w-full pl-2 text-xs text-towni-brown-dark-300">Actions</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
    <div
      class="towny-menu-image absolute right-0 bottom-40 cursor-pointer rounded-l-lg pr-7 shadow-2xl transition ease-in-out"
      :class="
        isInteractions ? 'translate-x-0 ' : 'translate-x-6  duration-1000'
      "
      @click="sideOver('isInteractions')"
    >
      <span class="w-full pl-2 text-xs text-towni-brown-dark-300">Options</span>
      <img src="@/assets/img/cardboard.svg" class="h-14 w-14" />
    </div>
  </div>
</template>

<script setup lang="ts">
const appOptionStore = useAppOptionsStore()
const { isGameInfo, isWeb3Info, isUserOptions, isInteractions } =
  storeToRefs(appOptionStore)

const sideOver = (
  drawerName: 'isGameInfo' | 'isWeb3Info' | 'isUserOptions' | 'isInteractions'
) => {
  requestAnimationFrame(() => {
    appOptionStore[drawerName] = true
    appOptionStore.showSidebar = true
  })
}
</script>

<style scoped>
.towny-menu-image {
  background-image: linear-gradient(0deg, #c69666 70%, #e8d5b2 70%);
}
</style>
