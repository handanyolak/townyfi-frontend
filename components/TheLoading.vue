<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 modal-backdrop">
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex px-20 py-10 space-x-3 bg-white rounded-full loader">
        <div class="w-10 h-10 rounded-full animate-bounce">
          <img src="~/assets/img/swords.svg" alt="swords" />
        </div>
        <div class="w-10 h-10 rounded-full animate-bounce">
          <img src="~/assets/img/castle-brown.svg" alt="swords" />
        </div>
        <div class="w-10 h-10 rounded-full animate-bounce">
          <img src="~/assets/img/swords.svg" alt="swords" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {},
})
</script>

<style scoped>
.loader div {
  animation-duration: 0.5s;
}

.loader div:first-child {
  animation-delay: 0.1s;
}

.loader div:nth-child(2) {
  animation-delay: 0.3s;
}

.loader div:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
