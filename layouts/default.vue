<template>
  <div
    class="min-h-screen bg-towni-brown-light-100 transition-colors duration-300 dark:bg-[#040413]"
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
