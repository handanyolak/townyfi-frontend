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
          <VeeErrorMessage class="font-semibold text-error-red" name="name" />
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
            class="font-semibold text-error-red"
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
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/common/ListTitle.vue'
import AppButton from '~/components/common/AppButton.vue'
import { LoadingState } from '~/enums'
import { getAddressRule, getBytes32Rule } from '~/composables/useYupRules'

// --------[ Props & Emits ]-------- //
defineEmits(['registerClosed'])

// --------[ Store ]-------- //
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()

const { ktaBalance, ktaAllowance } = storeToRefs(userWalletStore)
const { settings } = storeToRefs(userGameStore)

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
const userRegister = async () => {}

const userApprove = async () => {}

const addKtaTokenToWallet = async () => {}

const claimStarterPack = async () => {}
</script>
