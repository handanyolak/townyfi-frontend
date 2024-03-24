<template>
  <div class="flex flex-col items-center space-y-4 p-12">
    <ListTitle class="w-full">Register</ListTitle>
    <ListItem title="Name:" class="w-full" input>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
      </template>
    </ListItem>
    <ListItem title="Referrer:" class="w-full" input>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField
            v-model="referrer"
            name="referrer"
            :rules="referrer && referrerRules"
          />
          <VErrorMessage class="text-red-800" name="referrer" />
        </VForm>
      </template>
    </ListItem>
    <AppButton
      v-if="ktaAllowance <= BigInt(setting?.price.register ?? 0)"
      class="my-3"
      @click="userApprove()"
      >Approve
    </AppButton>
    <AppButton v-else class="my-3" @click="userRegister()">Register</AppButton>
    <AppButton class="my-3" @click="addKtaTokenToWallet()"
      >Add Token to Metamask</AppButton
    >
  </div>
</template>

<script setup lang="ts">
import { encodeBytes32String, ZeroAddress } from 'ethers'
import { TYPE } from 'vue-toastification'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import { stringToHex } from '~/utils'
import { getAddressRule, getBytes32Rule } from '~/composables/useYupRules'

// --------[ Props & Emits ]-------- //
defineEmits(['registerClosed'])

// --------[ Nuxt Imports ]-------- //
const {
  public: { ktaAddress },
} = useRuntimeConfig()

// --------[ Stores ]-------- //
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const appOptionsStore = useAppOptionsStore()
const contractStore = useContractStore()

const { clearModalInfo } = appOptionsStore
const { getKtaToken, getKtaTokenCaller, getKtaCaller } =
  storeToRefs(contractStore)
const { ktaAllowance, address } = storeToRefs(userWalletStore)
const { setting } = storeToRefs(userGameStore)

// --------[ Data ]-------- //
const name = ref('')
const referrer = ref('')
const nameRules = getBytes32Rule({
  required: true,
})
const referrerRules = getAddressRule()

// --------[ Methods ]-------- //
const userRegister = async () => {
  const result = await getKtaCaller.value.callFunction(
    'write',
    'register',
    [
      encodeBytes32String(name.value),
      referrer.value === '' ? ZeroAddress : stringToHex(referrer.value),
    ],
    false,
  )

  if (result) {
    clearModalInfo()
  }
}

const userApprove = async () => {
  const ktaTokenBalance = await getKtaToken.value.read.balanceOf([
    address.value,
  ])

  if (ktaTokenBalance < BigInt(setting.value?.price.register ?? 0)) {
    useAppToast(
      TYPE.ERROR,
      `You don't have enough tokens (${setting.value?.price.register}) to register for the game`,
    )

    return
  }

  await getKtaTokenCaller.value.callFunction(
    'write',
    'approve',
    [ktaAddress, ktaTokenBalance],
    false,
  )
}

const addKtaTokenToWallet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: getKtaToken.value.address,
          symbol: await getKtaToken.value.read.symbol(),
          decimals: (await getKtaToken.value.read.decimals()).toString(),
        },
      },
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}
</script>
