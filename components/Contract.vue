<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Name: </template>
      <span>{{ data.contractName }}</span>
    </ListItem>
    <ListItem copiable :copy-value="data.contractAddress">
      <template #title> Address: </template>
      <span>{{ middleCropping(data.contractAddress) }}</span>
    </ListItem>
    <ListItem>
      <span>{{ data.contractDesc }}</span>
    </ListItem>
    <a :href="`${chainExplorers[0]}/address/${data.contractAddress}`" target="_blank">
      <AppButton class="w-full my-2 flex justify-center">
        <div class="flex items-center">
          View on Explorer
          <img src="@/assets/img/link-external.svg" class="h-3 w-3 ml-1">
        </div>
      </AppButton>
    </a>
    <AppButton v-if="data.contractName === 'TownyFi Token'" class="w-full my-2" @click="addKtaTokenToWallet()">
      <span>Add Token to Metamask</span>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { TYPE } from 'vue-toastification'

const { chainExplorers } = useRuntimeConfig().public
const connectionStore = useConnectionStore()

const { getKtaToken } = storeToRefs(connectionStore)

interface ContractProps {
  data: {
    contractName: string
    contractDesc: string
    contractAddress: string
  }
}
defineProps<ContractProps>()

const addKtaTokenToWallet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: await getKtaToken.value.getAddress(),
          symbol: await getKtaToken.value.symbol(),
          decimals: (await getKtaToken.value.decimals()).toString(),
        },
      },
    });
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}
</script>
