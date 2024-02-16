<template>
  <div
    class="h-screen overflow-hidden transition-colors duration-300 dark:bg-[#0D1117]"
  >
    <TheHeader />
    <TheSidebar />
    <slot />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const appOptionStore = useAppOptionsStore()

//--------[ Methods ]--------//
connectionStore.$subscribe(
  (_, state) => {
    if (!state.onValidNetwork) {
      appOptionStore.sideLeave()
    }
  },
  { detached: true }
)
</script>
