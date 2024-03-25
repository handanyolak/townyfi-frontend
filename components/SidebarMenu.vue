<template>
  <div>
    <div
      class="towny-menu-image left-menu top-40 transition"
      :class="isGameInfo ? 'translate-x-0' : '-translate-x-10 duration-1000'"
      @click="sideOver('isGameInfo')"
    >
      <div class="col-start-2 col-end-4">
        <p class="w-full p-1 text-center text-xs text-towni-brown-dark-300">
          Game
        </p>
        <img src="@/assets/img/cardboard.svg" class="h-14 w-full" />
      </div>
    </div>
    <div
      class="towny-menu-image left-menu bottom-40"
      :class="isOptions ? 'translate-x-0' : '-translate-x-10 duration-1000'"
      @click="sideOver('isOptions')"
    >
      <div class="col-start-2 col-end-4">
        <p class="w-full p-1 text-center text-xs text-towni-brown-dark-300">
          Options
        </p>
        <img src="@/assets/img/cardboard.svg" class="h-14 w-full" />
      </div>
    </div>
    <div
      class="towny-menu-image right-menu top-40 transition"
      :class="
        isBlockchainInfo ? 'translate-x-0' : 'translate-x-10 duration-1000'
      "
      @click="sideOver('isBlockchainInfo')"
    >
      <div class="col-start-1 col-end-3">
        <p class="w-full p-1 text-center text-xs text-towni-brown-dark-300">
          Blockchain
        </p>
        <img src="@/assets/img/cardboard.svg" class="h-14 w-full" />
      </div>
    </div>
    <div
      class="towny-menu-image right-menu bottom-40 transition"
      :class="
        isContractInfo ? 'translate-x-0 ' : 'translate-x-10  duration-1000'
      "
      @click="sideOver('isContractInfo')"
    >
      <div class="col-start-1 col-end-3">
        <p class="w-full p-1 text-center text-xs text-towni-brown-dark-300">
          Contract
        </p>
        <img src="@/assets/img/cardboard.svg" class="h-14 w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// --------[ Stores ]-------- //
const appOptionStore = useAppOptionsStore()
const { isGameInfo, isContractInfo, isBlockchainInfo, isOptions } =
  storeToRefs(appOptionStore)

// --------[ Methods ]-------- //
const sideOver = (
  drawerName:
    | 'isGameInfo'
    | 'isContractInfo'
    | 'isBlockchainInfo'
    | 'isOptions',
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

.left-menu {
  @apply absolute left-0 grid w-[120px] cursor-pointer grid-cols-3 rounded-r-lg shadow-2xl ease-in-out;
}

.right-menu {
  @apply absolute right-0  grid w-[120px] cursor-pointer grid-cols-3 rounded-l-lg shadow-2xl  ease-in-out;
}
</style>
