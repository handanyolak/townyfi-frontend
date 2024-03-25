<template>
  <div v-if="isConnected">
    <ListTitle>General</ListTitle>
    <ListItem title="Address:" copiable :copy-value="address">
      <span>{{ middleCropping(address) }}</span>
    </ListItem>
    <ListItem title="Balance:">
      <span
        >{{ balance }}
        {{
          onValidNetwork ? walletClient.chain.nativeCurrency.symbol : ''
        }}</span
      >
    </ListItem>
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem title="Game Token Balance:">
      <span>11109491</span>
    </ListItem>
  </div>
  <div v-else>Connect your wallet to see this section.</div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'

// --------[ Nuxt ]-------- //
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { address, balance, walletClient } = storeToRefs(userWalletStore)
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
</script>
