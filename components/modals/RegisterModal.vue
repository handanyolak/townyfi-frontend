<template>
  <div class="flex flex-col items-center space-y-4 p-12">
    <ListTitle class="w-full">Register</ListTitle>
    <ListItem class="w-full" input>
      <template #title> Name: </template>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
      </template>
    </ListItem>
    <ListItem class="w-full" input>
      <template #title> Referrer: </template>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="referrer" name="referrer" :rules="referrerRules" />
          <VErrorMessage class="text-red-800" name="referrer" />
        </VForm>
      </template>
    </ListItem>
    <TownyButton
      v-if="ktaAllowance <= setting?.price.register!!"
      class="my-3"
      @click="userApprove()"
      >Approve</TownyButton
    >
    <TownyButton v-else class="my-3" @click="userRegister()"
      >Register</TownyButton
    >
  </div>
</template>

<script setup lang="ts">
import { encodeBytes32String, ZeroAddress, MaxUint256 } from 'ethers'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import { stringToHex } from '~/utils'
import { getAddressRule, getBytes32Rule } from '~/composables/useYupRules'

//--------[ Props & Emits ]--------//
const emit = defineEmits(['registerClosed'])

//--------[ Nuxt Imports ]--------//
const { ktaAddress } = useRuntimeConfig().public

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()

const { getKtaToken, getKta } = storeToRefs(connectionStore)
const { ktaAllowance } = storeToRefs(userWalletStore)
const { setting } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const name = ref('')
const referrer = ref('')
const nameRules = getBytes32Rule({
  required: true,
})
const referrerRules = getAddressRule()

//--------[ Methods ]--------//
const userRegister = async () => {
  const tx = await getKta.value.register(
    encodeBytes32String(name.value),
    referrer.value === '' ? ZeroAddress : stringToHex(referrer.value)
  )

  await tx.wait()

  emit('registerClosed')
}

const userApprove = async () => {
  await getKtaToken.value.approve(ktaAddress, MaxUint256)
}
</script>
