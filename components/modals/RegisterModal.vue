<template>
  <div class="flex flex-col items-center space-y-4 p-12">
    <ListTitle class="w-full">Register</ListTitle>
    <ListItem title="Name:" class="w-full" input>
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField v-model="name" name="name" :rules="nameRules" />
          <VeeErrorMessage class="text-red-800" name="name" />
        </VeeForm>
      </template>
    </ListItem>
    <ListItem title="Referrer:" class="w-full" input>
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField
            v-model="referrer"
            name="referrer"
            :rules="referrer && referrerRules"
          />
          <VeeErrorMessage class="text-red-800" name="referrer" />
        </VeeForm>
      </template>
    </ListItem>
    <AppButton
      v-if="ktaAllowance <= BigInt(settings.price.register ?? 0)"
      class="my-3"
      @click="userApprove()"
      >Approve
    </AppButton>
    <AppButton v-else class="my-3" @click="userRegister()">Register</AppButton>
    <AppButton class="my-3" @click="addKtaTokenToWallet()"
      >Add Token to Metamask</AppButton
    >
    <AppButton class="my-3" @click="mintKtaToken()">Mint Token</AppButton>
  </div>
</template>

<script setup lang="ts">
import { stringToHex, zeroAddress } from 'viem'
import { TYPE } from 'vue-toastification'
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import { addHexPrefix } from '~/utils'
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
const { walletClient, ktaSymbol, ktaDecimals, ktaAllowance, address } =
  storeToRefs(userWalletStore)
const { settings } = storeToRefs(userGameStore)

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
      stringToHex(name.value, { size: 32 }),
      referrer.value === '' ? zeroAddress : addHexPrefix(referrer.value),
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

  if (ktaTokenBalance < BigInt(settings.value.price.register ?? 0)) {
    useAppToast(
      TYPE.ERROR,
      `You don't have enough tokens (${settings.value.price.register}) to register for the game`,
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
    await getKtaTokenCaller.value.callFunction(
      'write',
      'mint',
      [address.value, 1000n],
      false,
    )
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  }
}
</script>
