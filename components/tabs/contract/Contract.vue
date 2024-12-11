<template>
  <div>
    <ListTitle class="my-8">General</ListTitle>
    <ListItem title="Name:">
      <span>{{ data.contractName }}</span>
    </ListItem>
    <ListItem copiable :copy-value="data.contractAddress" title="Address:">
      <span>{{ middleCropping(data.contractAddress) }}</span>
    </ListItem>
    <ListItem>
      <span>{{ data.contractDesc }}</span>
    </ListItem>
    <a
      v-if="chainClient.chain.blockExplorers?.default.url"
      :href="`${chainClient.chain.blockExplorers.default.url}/address/${data.contractAddress}`"
      target="_blank"
    >
      <AppButton class="my-2 flex w-full justify-center">
        <div class="flex items-center">
          View on Explorer
          <img src="@/assets/img/link-external.svg" class="ml-1 h-3 w-3" />
        </div>
      </AppButton>
    </a>
    <AppButton
      v-if="data.contractName === 'TownyFi Token'"
      class="my-2 w-full"
      @click="addKtaTokenToWallet()"
    >
      <span>Add Token to Metamask</span>
    </AppButton>
    <AppButton
      v-if="data.contractName === 'TownyFi Token'"
      class="my-2 w-full"
      @click="approveKtaToken()"
    >
      <span>Approve Token</span>
    </AppButton>
    <AppButton
      v-if="data.contractName === 'TownyFi Token'"
      class="my-2 w-full"
      @click="mintKtaToken()"
    >
      <span>Mint Token</span>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import AppButton from '~/components/common/AppButton.vue'

const userWalletStore = useUserWalletStore()

const { chainClient } = storeToRefs(userWalletStore)

interface ContractProps {
  data: {
    contractName: string
    contractDesc: string
    contractAddress: string
  }
}
defineProps<ContractProps>()

const addKtaTokenToWallet = async () => {}

const mintKtaToken = async () => {}

const approveKtaToken = async () => {}
</script>
