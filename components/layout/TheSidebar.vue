<template>
  <Transition
    :name="isGameInfo || isOptions ? 'slide-left-fade' : 'slide-right-fade'"
  >
    <div
      v-if="showSidebar"
      ref="sideBar"
      :class="[
        'fixed -top-3 z-110 min-h-screen w-[110%] md:w-[45%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]',
        isGameInfo || isOptions ? '-left-4' : '-right-4',
      ]"
    >
      <img
        :class="[
          'absolute top-6 z-10 h-10 w-10 cursor-pointer',
          isGameInfo || isOptions ? 'right-6' : 'left-4',
        ]"
        src="@/assets/img/close.svg"
        @click="sideLeave()"
      />
      <img
        class="absolute left-1/2 top-4 z-50 h-20 -translate-x-1/2 transform select-none"
        src="@/assets/img/townyfi-logo.svg"
        alt="logo"
      />
      <div class="py-[85px]">
        <div
          :class="[
            'shadow-vintage absolute -top-3 h-full w-full bg-white [filter:url(#wavy)]',
            isBlockchainInfo || isContractInfo ? 'rotate-180 transform' : '',
          ]"
        ></div>
        <div class="relative h-full">
          <SidebarTab v-if="isGameInfo && isRegistered" :tabs="TABS.gameInfo" />
          <SidebarTab
            v-else-if="isGameInfo && !isRegistered"
            :tabs="TABS.gameInfoFallback"
          />
          <SidebarTab v-if="isOptions" :tabs="TABS.userOptions" />
          <SidebarTab v-if="isBlockchainInfo" :tabs="TABS.blockchainInfo" />
          <SidebarTab v-if="isContractInfo" :tabs="TABS.contractInfo" />
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
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import SidebarTab from '~/components/SidebarTab.vue'
import { TABS } from '~/constants'

// --------[ Store ]-------- //
const appOptionStore = useAppOptionsStore()
const userGameStore = useUserGameStore()

const { sideLeave } = appOptionStore

const { isGameInfo, isContractInfo, isBlockchainInfo, isOptions, showSidebar } =
  storeToRefs(appOptionStore)
const { isRegistered } = storeToRefs(userGameStore)

// --------[ Data ]-------- //
const sideBar = ref(null)

// --------[ Method ]-------- //
onClickOutside(sideBar, () => sideLeave())
</script>

<style scoped>
.slide-left-fade-enter-active,
.slide-left-fade-leave-active {
  transition: transform 0.8s ease;
}

.slide-left-fade-enter-from,
.slide-left-fade-leave-to {
  transform: translateX(-100%);
  transition: all 0.3s ease-out;
}

.slide-right-fade-enter-active,
.slide-right-fade-leave-active {
  transition: transform 0.8s ease;
}

.slide-right-fade-enter-from,
.slide-right-fade-leave-to {
  transform: translateX(100%);
  transition: all 0.3s ease-out;
}
</style>
