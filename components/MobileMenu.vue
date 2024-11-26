<template>
  <div
    ref="mobileMenu"
    class="shadow-vintage responsive-semi-circle fixed right-0 top-0 z-20 h-[100vw] w-[100vw] bg-white text-3xl text-white"
    :class="menuOpen ? 'menu-open' : 'menu-close'"
  >
    <div
      class="absolute right-10 top-10 flex flex-col items-center justify-center"
    >
      <div v-if="hasMetamask" class="flex justify-between py-5">
        <div v-if="onValidNetwork">
          <div v-if="isConnected" class="space-x-1">
            <AppButton
              v-if="!isRegistered"
              border-hover
              @click="setModalInfo('RegisterModal')"
            >
              Register
            </AppButton>
            <AppButton
              class="step-4"
              border-hover
              inline-class="group-hover:bg-towny-brown-light-100 group-hover:text-towny-brown-dark-200"
              @click="disconnectWeb3()"
            >
              {{ $t('disconnect_wallet') }}
            </AppButton>
          </div>
          <AppButton v-else fill-hover @click="connectWeb3()">
            Connect Wallet
          </AppButton>
        </div>
        <AppButton
          v-else
          target="_blank"
          border
          border-hover
          @click="switchOrAddNetwork()"
        >
          Switch Network
        </AppButton>
      </div>
      <AppDropdown
        :select="language"
        :dropdown-items="languages"
        :icon-names="languages"
        class="dropdown-background step-3"
        @selected="(item) => selected(item)"
      />
      <img
        :src="themeIcon"
        class="h-14 w-14 cursor-pointer"
        @click="toggleTheme()"
      />
      <img
        :src="audioIcon"
        class="step-1 h-16 w-16 cursor-pointer"
        @click="toggleAudio()"
      />
      <client-only>
        <Vue3Lottie
          v-if="audio"
          class="cursor-pointer"
          :animation-data="Harp"
          :height="55"
          :width="55"
          :scale="1.4"
          :auto-play="isAnimating"
          :pause-animation="!isAnimating"
          @click="toggleMusicAndAnimation()"
        />
      </client-only>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from 'vue3-lottie'
import Harp from '~/assets/lotties/harp.json'
import AppDropdown from '~/components/common/AppDropdown.vue'
import AppButton from '~/components/common/AppButton.vue'

// --------[ Prop & Emit ]-------- //
interface MobileMenuProps {
  modelValue: boolean
  menuOpen: boolean
  hasMetamask: boolean
  onValidNetwork: boolean
  isConnected: boolean
  isRegistered: boolean
  language: string
  languages?: string[]
  audio: boolean
  themeIcon: string
  audioIcon: string
  isAnimating: boolean
  selected: (item: string) => void
  switchOrAddNetwork: () => void
  toggleTheme: () => void
  toggleAudio: () => void
  toggleMusicAndAnimation: () => void
}

withDefaults(defineProps<MobileMenuProps>(), {
  menuOpen: false,
  hasMetamask: false,
  onValidNetwork: false,
  isConnected: false,
  isRegistered: false,
  language: 'en',
  audio: false,
  themeIcon: '',
  audioIcon: '',
  isAnimating: false,
  modelValue: false,
  languages: () => ['en'],
  selected: () => {},
  switchOrAddNetwork: () => {},
  toggleTheme: () => {},
  toggleAudio: () => {},
  toggleMusicAndAnimation: () => {},
})

// --------[ Store ]-------- //
const userWalletStore = useUserWalletStore()
const { connectWeb3, disconnectWeb3 } = userWalletStore
const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore
</script>

<style scoped>
.responsive-semi-circle {
  clip-path: circle(100% at 100% 0);
  transform-origin: top right;
  transition:
    clip-path 0.6s ease,
    transform 0.6s ease;
  transform: scale(1);
}

.menu-open {
  clip-path: circle(100% at 100% 0);
}

.menu-close {
  clip-path: circle(0% at 100% 0);
}
</style>
