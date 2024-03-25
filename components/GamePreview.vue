<template>
  <div>
    <div
      class="border-l-4 border-orange-500 bg-orange-100 p-4 text-orange-700"
      role="alert"
    >
      <div v-if="hasMetamask && !onValidNetwork">
        <p class="font-bold">Wrong Network</p>
        <p>
          You are on the wrong network. Press the 'Change Network' button to go
          to the correct network and enjoy the game.
        </p>
      </div>
      <div v-if="!hasMetamask">
        <p class="font-bold">MetaMask Not Found</p>
        <p>
          You need to install MetaMask to play the game. Press the 'Install
          MetaMask' button to get MetaMask.
        </p>
      </div>
    </div>
    <div class="mx-auto max-w-xl">
      <div class="border-8 !border-black p-2">
        <img src="@/assets/img/game-preview.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const connectionStore = useConnectionStore()

const { hasMetamask } = connectionStore
const { onValidNetwork } = storeToRefs(connectionStore)
</script>
