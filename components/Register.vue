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
      v-if="ktaAllowance.lt(setting.price.register)"
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
import { ethers } from 'ethers'
import * as yup from 'yup'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'

const emit = defineEmits(['registerClosed'])

const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const { setting } = storeToRefs(userGameStore)
const { ktaAllowance } = storeToRefs(userWalletStore)
const ktaToken = userWalletStore.ktaToken
const kta = userWalletStore.kta

const name = ref('')
const nameRules = yup.string().bytes32()

const referrer = ref('')
const referrerRules = yup
  .string()
  .matches(/^0x[a-fA-F0-9]{40}$/, 'string must be wallet address')

const userRegister = async () => {
  const tx = await kta.register(
    ethers.utils.formatBytes32String(name.value),
    referrer.value === '' ? ethers.constants.AddressZero : referrer.value
  )

  await tx.wait()

  emit('registerClosed')
}

const userApprove = async () => {
  await ktaToken.approve(kta.address, ethers.constants.MaxUint256)
}
</script>
