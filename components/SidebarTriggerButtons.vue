<template>
  <div class="overflow-hidden">
    <div class="hidden md:block">
      <SidebarButton
        v-for="menu in desktopMenus"
        :key="menu.drawerName"
        :drawer-name="menu.drawerName"
        :left="menu.left"
        :right="menu.right"
        :class="[
          getTranslateClass(menu, 'x'),
          menu.class,
          'transition-transform duration-500 ease-in-out',
        ]"
        @toggle="handleToggle"
      >
        {{ menu.label }}
      </SidebarButton>
    </div>

    <div class="absolute left-0 top-[62px] block w-full md:hidden">
      <div class="mx-2 grid grid-cols-4 gap-x-2">
        <SidebarButton
          v-for="menu in desktopMenus"
          :key="menu.drawerName"
          :drawer-name="menu.drawerName"
          :class="[
            getTranslateClass(menu, 'y'),
            'w-full rounded-b-lg transition-transform duration-500 ease-in-out',
          ]"
          @toggle="handleToggle"
        >
          {{ menu.label }}
        </SidebarButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarButton from '@/components/SidebarButton.vue'
import { DrawerName } from '~/enums'

// --------[ Store ]-------- //
const appOptionStore = useAppOptionsStore()
const { isGameInfo, isContractInfo, isBlockchainInfo, isOptions } =
  storeToRefs(appOptionStore)

// --------[ Data ]-------- //
const desktopMenus: Array<{
  label: string
  drawerName: DrawerName
  state: any
  class: string
  left?: boolean
  right?: boolean
}> = [
  {
    label: 'Game',
    drawerName: DrawerName.GameInfo,
    state: isGameInfo,
    class: 'absolute left-0 top-40 w-[130px] rounded-r-lg',
    left: true,
  },
  {
    label: 'Options',
    drawerName: DrawerName.Options,
    state: isOptions,
    class: 'absolute bottom-40 left-0 w-[130px] rounded-r-lg',
    left: true,
  },
  {
    label: 'Blockchain',
    drawerName: DrawerName.BlockchainInfo,
    state: isBlockchainInfo,
    class: 'absolute right-0 top-40 w-[130px] rounded-l-lg',
    right: true,
  },
  {
    label: 'Contract',
    drawerName: DrawerName.ContractInfo,
    state: isContractInfo,
    class: 'absolute bottom-40 right-0 w-[130px] rounded-l-lg',
    right: true,
  },
]

// --------[ Method ]-------- //
const getTranslateClass = (menu: any, axis: 'x' | 'y') => {
  if (axis === 'x') {
    if (['isGameInfo', 'isOptions'].includes(menu.drawerName)) {
      return menu.state.value ? `translate-${axis}-0` : `-translate-${axis}-10`
    } else if (
      ['isContractInfo', 'isBlockchainInfo'].includes(menu.drawerName)
    ) {
      return menu.state.value ? `translate-${axis}-0` : `translate-${axis}-10`
    }
  } else if (axis === 'y') {
    return menu.state.value ? `translate-y-2` : `translate-y-0`
  }
  return `translate-${axis}-0`
}

const handleToggle = async (drawerName: DrawerName) => {
  await sleep(0.1 * 1000)
  appOptionStore[drawerName] = true
  appOptionStore.showSidebar = true
}
</script>
