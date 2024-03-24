<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem v-if="onValidNetwork" title="Name:">
      <span>{{ networkName }}</span>
    </ListItem>
    <ListItem title="Chain ID:">
      <span>{{ chainId }}</span>
    </ListItem>
    <ListItem v-if="onValidNetwork" title="Symbol:">
      <span>{{ networkSymbol }}</span>
    </ListItem>
    <ListTitle v-if="onValidNetwork">Explorer URLs</ListTitle>
    <ScrollableList
      v-if="onValidNetwork"
      :items="chainExplorers"
      :copy-value="chainExplorers"
      linkable
    />
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem title="Current Block Number:">
      <span>{{ currentBlockNumber }}</span>
    </ListItem>
    <AppButton
      class="my-2 flex w-full justify-center"
      @click="switchOrAddNetwork()"
    >
      Add {{ networkName }} Chain to Metamask
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'

// --------[ Nuxt ]-------- //
const {
  public: { networkName, networkSymbol, chainExplorers, chainId, chainRpcs },
} = useRuntimeConfig()

// --------[ Stores ]-------- //
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { onValidNetwork } = storeToRefs(connectionStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

// --------[ Methods ]-------- //
const switchOrAddNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(chainId),
        },
      ],
    })
  } catch (error) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: numberToHex(chainId),
          chainName: networkName,
          nativeCurrency: {
            name: networkSymbol,
            symbol: networkSymbol,
            decimals: 18,
          },
          rpcUrls: Array.from(chainRpcs),
          blockExplorerUrls: Array.from(chainExplorers),
        },
      ],
    })
  }
}
</script>
