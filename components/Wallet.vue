<template>
  <div v-if="isConnected">
    <ListTitle>General</ListTitle>
    <ListItem copiable :copy-value="address">
      <template #title> Address: </template>
      <span>{{ middleCropping(address) }}</span>
    </ListItem>
    <ListItem>
      <template #title> Balance: </template>
      <span>{{ balance }} {{ onValidNetwork ? networkSymbol : '' }}</span>
    </ListItem>
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem>
      <template #title> Game Token Balance: </template>
      <span>11109491</span>
    </ListItem>
  </div>
  <div v-else>
    Connect your wallet to see this section.
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'


//--------[ Nuxt ]--------//
const { networkSymbol } = useRuntimeConfig().public

//--------[ Nuxt ]--------//
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { address, balance } = storeToRefs(userWalletStore)
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
</script>
