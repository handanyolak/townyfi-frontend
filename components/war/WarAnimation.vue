<template>
  <div class="relative">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <client-only>
        <Vue3Lottie
          :animation-data="shine"
          :auto-play="isAnimating"
          :pause-animation="!isAnimating"
          :width="600"
          :speed="1"
        />
      </client-only>
    </div>
    <div
      style="box-shadow: 0px 0px 45px 0px #f4c043"
      :class="[backgroundClasses, 'overflow-hidden rounded-full']"
    >
      <client-only>
        <Vue3Lottie
          :animation-data="sunny"
          :speed="3"
          :auto-play="isAnimating"
          :pause-animation="!isAnimating"
        />
      </client-only>
    </div>
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="item.position"
      class="absolute top-0"
    >
      <client-only>
        <Vue3Lottie
          :animation-data="clanAnimation"
          :speed="item.speed"
          :auto-play="isAnimating"
          :pause-animation="!isAnimating"
        />
      </client-only>
    </div>
    <Ribbon
      :name="townName"
      class="absolute bottom-0 left-1/2 z-10 h-1/2 w-full -translate-x-1/2 transform rounded-b-full bg-towny-brown-dark-300 bg-opacity-20 p-1 backdrop-blur"
    />
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import sunny from '~/assets/lotties/sunny.json'
import shine from '~/assets/lotties/shine.json'
import Ribbon from '~/components/war/Ribbon.vue'

// --------[ Prop & Emit ]-------- //
interface WarAnimationProps {
  townName: string
  clanAnimation?: object | null
  backgroundClasses?: string
  isAnimating?: boolean
}
defineProps<WarAnimationProps>()

// --------[ Data ]-------- //
const items = [
  { position: 'left-0', speed: 2 },
  { position: 'right-10', speed: 1.7 },
  { position: 'left-14', speed: 1.9 },
  { position: 'right-16', speed: 1.5 },
  { position: 'left-20', speed: 2.1 },
  { position: 'right-12', speed: 1.8 },
  { position: 'left-24', speed: 1.6 },
  { position: 'right-18', speed: 2.2 },
  { position: 'left-28', speed: 1.4 },
  { position: 'right-20', speed: 2 },
]
</script>
