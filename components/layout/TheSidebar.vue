<template>
  <Transition
    :name="isGameInfo || isOptions ? 'slide-left-fade' : 'slide-right-fade'"
  >
    <div
      v-if="showSidebar"
      ref="sideBar"
      :class="[
        'fixed -top-3 z-50 min-h-screen w-96',
        isGameInfo || isOptions ? '-left-4' : '-right-4',
      ]"
    >
      <img
        :class="[
          'absolute top-2  z-10 h-10 w-10 cursor-pointer',
          isGameInfo || isOptions ? '-right-8' : '-left-8',
        ]"
        src="@/assets/img/exit.svg"
        @click="sideLeave()"
      />
      <div>
        <div
          :class="[
            'parchment absolute -top-3 w-full bg-white [filter:url(#wavy)]',
            isBlockchainInfo || isContractInfo ? 'rotate-180 transform' : '',
          ]"
        ></div>
        <div class="relative">
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

//--------[ Stores ]--------//
const appOptionStore = useAppOptionsStore()
const userGameStore = useUserGameStore()

const { sideLeave } = appOptionStore

const { isGameInfo, isContractInfo, isBlockchainInfo, isOptions, showSidebar } =
  storeToRefs(appOptionStore)
const { isRegistered } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const sideBar = ref(null)

//--------[ Methods ]--------//
onClickOutside(sideBar, () => sideLeave())
</script>

<style>
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

.parchment {
  height: 110vh;
  box-shadow: 2px 3px 20px #854819, 30px 65px 200px #91510ffc inset;
}
</style>
