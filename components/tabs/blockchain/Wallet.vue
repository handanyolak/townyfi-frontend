<template>
  <div v-if="hasMetamask && isConnected">
    <ListTitle>General</ListTitle>
    <ListItem title="Address:" copiable :copy-value="address">
      <span>{{ middleCropping(address) }}</span>
    </ListItem>
    <ListItem title="Balance:">
      <span
        >{{ balance }}
        {{
          onValidNetwork ? chainClient.chain.nativeCurrency.symbol : ''
        }}</span
      >
    </ListItem>
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem title="Game Token Balance:">
      <span>{{ ktaBalance }} {{ ktaSymbol }}</span>
    </ListItem>
    <ListItem title="Game Token Allowance:">
      <span>{{ ktaAllowance }} {{ ktaSymbol }}</span>
    </ListItem>
  </div>
  <div v-else>Connect your wallet to see this section.</div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'

// --------[ Nuxt ]-------- //
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { address, balance, chainClient, ktaBalance, ktaSymbol, ktaAllowance } =
  storeToRefs(userWalletStore)
const { onValidNetwork, isConnected } = storeToRefs(connectionStore)
const { hasMetamask } = connectionStore
</script>
