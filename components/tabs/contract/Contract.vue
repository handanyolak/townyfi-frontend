<template>
  <div>
    <ListTitle>General</ListTitle>
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
      :href="`${walletClient.chain.blockExplorers?.default.url}/address/${data.contractAddress}`"
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
import type { Address } from 'viem'
import { TYPE } from 'vue-toastification'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import AppButton from '~/components/common/AppButton.vue'

const contractStore = useContractStore()
const userWalletStore = useUserWalletStore()

const { getKtaToken, getKtaTokenCaller } = storeToRefs(contractStore)
const { walletClient, ktaSymbol, ktaDecimals, ktaBalance, address } =
  storeToRefs(userWalletStore)

interface ContractProps {
  data: {
    contractName: string
    contractDesc: string
    contractAddress: string
  }
}
defineProps<ContractProps>()

const {
  public: { ktaAddress },
} = useRuntimeConfig()

const addKtaTokenToWallet = async () => {
  try {
    await walletClient.value.watchAsset({
      type: 'ERC20',
      options: {
        address: getKtaToken.value.address,
        symbol: ktaSymbol.value,
        decimals: ktaDecimals.value,
      },
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}

const mintKtaToken = async () => {
  try {
    await getKtaTokenCaller.value.callFunction({
      type: 'write',
      name: 'mint',
      args: [[address.value, 1000n]],
      needRegister: false,
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}

const approveKtaToken = async () => {
  try {
    await getKtaTokenCaller.value.callFunction({
      type: 'write',
      name: 'approve',
      args: [[ktaAddress as Address, ktaBalance.value]], // FIXME: type casting
      needRegister: false,
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}
</script>
