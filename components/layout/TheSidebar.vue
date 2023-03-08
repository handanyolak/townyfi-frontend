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
          'absolute top-3  z-10 h-8 w-8 cursor-pointer',
          isGameInfo || isOptions ? '-right-1' : '-left-2',
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
          <SidebarTab v-if="isGameInfo" :tabs="gameInfotabs" />
          <SidebarTab v-if="isOptions" :tabs="userOptionstabs" />
          <SidebarTab v-if="isBlockchainInfo" :tabs="BlockchainInfotabs" />
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
import { Tab } from '~/types'

const appOptionStore = useAppOptionsStore()
const { isGameInfo, isContractInfo, isBlockchainInfo, isOptions, showSidebar } =
  storeToRefs(appOptionStore)
const { sideLeave } = appOptionStore

const sideBar = ref(null)

const gameInfotabs: Tab[] = [
  {
    name: 'User',
    component: 'User',
  },
  {
    name: 'Town',
    component: 'Town',
  },
  {
    name: 'Interactions',
    component: 'Interactions',
  },
]

const userOptionstabs: Tab[] = [
  {
    name: 'Options',
    component: 'Options',
  },
]

const BlockchainInfotabs: Tab[] = [
  {
    name: 'Chain',
    component: 'Chain',
  },
]

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
  box-shadow: 2px 3px 20px #411c06, 30px 65px 200px #91510ffc inset;
}
</style>
