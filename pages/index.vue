<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <div
        v-for="item in 9"
        :key="item"
        class="flex flex-col items-center text-2xl font-bold border-8 shadow-2xl bg-gradient-to-r from-brown-light via-brown to-brown-dark rounded-xl border-brown"
      >
        <span class="px-4 my-2 bg-brown-light">
          <span
            class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-600"
            >DESTINY</span
          >
        </span>
        <span class="my-1 text-xs text-white">{{
          informationStore.address
        }}</span>
        <span class="my-1 text-xs text-white">{{
          informationStore.balance
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '~/stores/index'

export default defineComponent({
  setup() {
    const informationStore = useStore()

    return {
      informationStore,
    }
  },
})
</script>
