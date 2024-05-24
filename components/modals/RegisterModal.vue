<template>
  <div
    class="flex flex-col items-center space-y-4 rounded-sm bg-towni-brown-light-100 p-12"
  >
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
      :is-loading="currentLoadingState === LoadingState.Approving"
      class="my-3"
      @click="userApprove()"
      >Approve
    </AppButton>
    <AppButton
      v-else
      :is-loading="currentLoadingState === LoadingState.Registering"
      class="my-3"
      @click="userRegister()"
      >Register
    </AppButton>
    <AppButton
      :is-loading="currentLoadingState === LoadingState.AddingToken"
      class="my-3"
      @click="addKtaTokenToWallet()"
      >Add Token to Metamask</AppButton
    >
    <AppButton
      :is-loading="currentLoadingState === LoadingState.Minting"
      class="my-3"
      @click="mintKtaToken()"
      >Mint Token</AppButton
    >
  </div>
</template>

<script setup lang="ts">
import { stringToHex, zeroAddress, type Address } from 'viem'
import { TYPE } from 'vue-toastification'
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/common/ListTitle.vue'
import AppButton from '~/components/common/AppButton.vue'
import { addHexPrefix } from '~/utils'
import { LoadingState } from '~/enums'
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
const {
  walletClient,
  ktaSymbol,
  ktaDecimals,
  ktaBalance,
  ktaAllowance,
  address,
} = storeToRefs(userWalletStore)
const { settings } = storeToRefs(userGameStore)

// --------[ Data ]-------- //
const name = ref('')
const referrer = ref('')
const currentLoadingState = ref(LoadingState.Idle)
const referrerRules = getAddressRule()
const nameRules = getBytes32Rule({
  required: true,
})

// --------[ Methods ]-------- //
const userRegister = async () => {
  currentLoadingState.value = LoadingState.Registering
  try {
    const result = await getKtaCaller.value.callFunction({
      fnType: 'write',
      fnName: 'register',
      fnArgs: [
        [
          stringToHex(name.value, { size: 32 }),
          referrer.value === '' ? zeroAddress : addHexPrefix(referrer.value),
        ],
      ],
      needRegister: false,
    })

    if (result) {
      clearModalInfo()
    }
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}

const userApprove = async () => {
  currentLoadingState.value = LoadingState.Approving
  try {
    if (ktaBalance.value < BigInt(settings.value.price.register ?? 0)) {
      useAppToast(
        TYPE.ERROR,
        `You don't have enough tokens (${settings.value.price.register}) to register for the game`,
      )
      return
    }

    await getKtaTokenCaller.value.callFunction({
      fnType: 'write',
      fnName: 'approve',
      fnArgs: [[ktaAddress as Address, ktaBalance.value]], // FIXME: type casting
      needRegister: false,
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}

const addKtaTokenToWallet = async () => {
  try {
    currentLoadingState.value = LoadingState.AddingToken
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
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}

const mintKtaToken = async () => {
  currentLoadingState.value = LoadingState.Minting
  try {
    await getKtaTokenCaller.value.callFunction({
      fnType: 'write',
      fnName: 'mint',
      fnArgs: [[address.value, 1000n]],
      needRegister: false,
    })
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}
</script>
