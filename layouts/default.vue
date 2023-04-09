<template>
  <div
    class="h-screen overflow-hidden transition-colors duration-300 dark:bg-[#040413]"
  >
    <TheHeader />
    <TheSidebar />
    <slot />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'

const connectionStore = useConnectionStore()
const appOptionStore = useAppOptionsStore()

connectionStore.$subscribe(
  (_, state) => {
    if (!state.onValidNetwork) {
      appOptionStore.sideLeave()
    }
  },
  { detached: true }
)
</script>

<style>
/* .deneme1 {
  overflow: auto;
}

.deneme1::before {
  content: '';
  position: fixed;

  background-image: url(~/assets/img/map6.png);
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: 100% 100%;

  filter: blur(3px);
} */
</style>
