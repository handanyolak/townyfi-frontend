<template>
  <div>
    <div
      class="absolute left-0 top-40 rounded-r-lg bg-amber-900 p-2 pl-7 transition ease-in-out"
      :class="
        appOptionStore.isGameInfo
          ? 'translate-x-0'
          : '-translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isGameInfo')"
    >
      <img src="@/assets/img/flag.svg" class="h-10 w-10" />
    </div>
    <div
      class="absolute left-0 bottom-40 rounded-r-lg bg-amber-900 p-2 pl-7 transition ease-in-out"
      :class="
        appOptionStore.isWeb3Info
          ? 'translate-x-0'
          : '-translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isWeb3Info')"
    >
      <img src="@/assets/img/flag.svg" class="h-10 w-10" />
    </div>
    <div
      class="absolute right-0 top-40 rounded-l-lg bg-amber-900 p-2 pr-7 transition ease-in-out"
      :class="
        appOptionStore.isUserOptions
          ? 'translate-x-0'
          : 'translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isUserOptions')"
    >
      <img src="@/assets/img/flag.svg" class="h-10 w-10" />
    </div>
    <div
      class="absolute right-0 bottom-40 rounded-l-lg bg-amber-900 p-2 pr-7 transition ease-in-out"
      :class="
        appOptionStore.isInteractions
          ? 'translate-x-0'
          : 'translate-x-6 duration-1000'
      "
      @mouseover="sideOver('isInteractions')"
    >
      <img src="@/assets/img/flag.svg" class="h-10 w-10" />
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
