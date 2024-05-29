<template>
  <div>
    <ListTitle>General</ListTitle>
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
    <ListTitle v-if="onValidNetwork">Explorer URLs</ListTitle>
    <ScrollableList
      :items="
        Object.values(chainClient.chain.blockExplorers ?? []).map(
          (explorer) => explorer.url,
        )
      "
      linkable
    />
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem v-if="currentBlockNumber > 0" title="Current Block Number:">
      <span>{{ currentBlockNumber }}</span>
    </ListItem>
    <ListItem v-if="chainClient.chain.testnet" title="Testnet:">
      <span>{{ chainClient.chain.testnet }}</span>
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

// --------[ Stores ]-------- //
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { onValidNetwork } = storeToRefs(connectionStore)
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
