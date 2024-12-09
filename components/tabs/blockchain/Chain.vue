<template>
  <div>
    <ListTitle class="my-8">General</ListTitle>
    <ListItem title="Name:">
      <span>{{ chainClient.chain.name }}</span>
    </ListItem>
    <ListItem title="Chain ID:">
      <span>{{ chainClient.chain.id }}</span>
    </ListItem>
    <ListItem title="Currency:">
      <span>{{ chainClient.chain.nativeCurrency.name }}</span>
    </ListItem>
    <ListItem title="Symbol:">
      <span>{{ chainClient.chain.nativeCurrency.symbol }}</span>
    </ListItem>
    <ListItem title="Decimals:">
      <span>{{ chainClient.chain.nativeCurrency.decimals }}</span>
    </ListItem>
    <ListItem v-if="chainClient.chain.testnet" title="Testnet:">
      <span>{{ chainClient.chain.testnet }}</span>
    </ListItem>
    <ListTitle class="my-8">Explorer URLs</ListTitle>
    <ScrollableList
      :items="
        Object.values(chainClient.chain.blockExplorers ?? {})
          .map(({ url }) => url as string)
          .concat(chainExtendExplorerUrls)
      "
      linkable
      class="max-h-44"
    />
    <ListTitle class="my-8">Miscellaneous</ListTitle>
    <ListItem v-if="currentBlockNumber > 0" title="Current Block Number:">
      <span>{{ currentBlockNumber }}</span>
    </ListItem>
    <AppButton
      class="my-2 flex w-full justify-center"
      @click="switchOrAddNetwork()"
    >
      Switch or Add {{ chainClient.chain.name }} Chain to Metamask
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import ScrollableList from '~/components/common/ScrollableList.vue'
import AppButton from '~/components/common/AppButton.vue'

const {
  public: { chainExtendExplorerUrls },
} = useRuntimeConfig()

// --------[ Stores ]-------- //
const userWalletStore = useUserWalletStore()
const { currentBlockNumber, walletClient, chainClient } =
  storeToRefs(userWalletStore)

// --------[ Methods ]-------- //
const switchOrAddNetwork = async () => {
  try {
    await walletClient.value.switchChain({
      id: walletClient.value.chain.id,
    })
  } catch (error) {
    await walletClient.value.addChain({
      chain: walletClient.value.chain,
    })
  }
}
</script>
