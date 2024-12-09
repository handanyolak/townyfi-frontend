<template>
  <div
    class="flex flex-col items-center space-y-4 rounded-sm bg-towny-brown-light-100 p-12"
  >
    <ListTitle class="my-8 w-full">Register</ListTitle>
    <ListItem title="Name:" class="w-full">
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField
            v-model="name"
            name="name"
            :rules="nameRules"
            validate-on-input
          />
          <VeeErrorMessage class="text-error-red font-semibold" name="name" />
        </VeeForm>
      </template>
    </ListItem>
    <ListItem title="Referrer:" class="w-full">
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField
            v-model="referrer"
            name="referrer"
            :rules="referrer && referrerRules"
            validate-on-input
          />
          <VeeErrorMessage
            class="text-error-red font-semibold"
            name="referrer"
          />
        </VeeForm>
      </template>
    </ListItem>
    <AppButton
      v-if="
        ktaAllowance <= BigInt(settings.price.register ?? 0) &&
        ktaBalance > BigInt(settings.price.register ?? 0)
      "
      :is-loading="currentLoadingState === LoadingState.Approving"
      class="my-3"
      @click="userApprove()"
      >Approve
    </AppButton>
    <AppButton
      v-if="ktaAllowance > BigInt(settings.price.register ?? 0)"
      :is-loading="currentLoadingState === LoadingState.Registering"
      class="my-3"
      @click="userRegister()"
      >Register
    </AppButton>

    <AppButton
      :is-loading="currentLoadingState === LoadingState.RelayerWebhookRequest"
      class="absolute bottom-24"
      @click="claimStarterPack()"
      >Claim Starter Pack</AppButton
    >
    <AppButton
      v-if="!isKtaTokenAdded"
      :is-loading="currentLoadingState === LoadingState.AddingToken"
      class="absolute bottom-12"
      @click="addKtaTokenToWallet()"
      >Add Token to Metamask</AppButton
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

// --------[ Store ]-------- //
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

const {
  public: { relayerWebhookUrl },
} = useRuntimeConfig()

// --------[ Data ]-------- //
const name = ref('')
const referrer = ref('')
const isKtaTokenAdded = ref(false)
const currentLoadingState = ref(LoadingState.Idle)
const referrerRules = getAddressRule()
const nameRules = getBytes32Rule({
  required: true,
})

// --------[ Method ]-------- //
const userRegister = async () => {
  currentLoadingState.value = LoadingState.Registering
  try {
    const result = await getKtaCaller.value.callFunction({
      type: 'write',
      name: 'register',
      args: [
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
      type: 'write',
      name: 'approve',
      args: [[ktaAddress as Address, ktaBalance.value]], // FIXME: type casting
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
    isKtaTokenAdded.value = true
  } catch (error) {
    useAppToast(TYPE.ERROR, 'Something went wrong')
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}

const claimStarterPack = async () => {
  try {
    currentLoadingState.value = LoadingState.RelayerWebhookRequest
    const response = await fetch(relayerWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address.value,
        contractAddress: getKtaToken.value.address,
      }),
    })
    const resData = await response.json()
    const result = JSON.parse(resData.result)
    if (!result.success) {
      useAppToast(TYPE.ERROR, `Failed to claim: ${result.message}`)
      return
    }

    useAppToast(
      TYPE.SUCCESS,
      `Starter Pack claimed successfully!\n${formatEventArgs(result)}`,
    )
  } catch (error: any) {
    useAppToast(TYPE.ERROR, `Something went wrong: ${error?.message}`)
  } finally {
    currentLoadingState.value = LoadingState.Idle
  }
}
</script>
