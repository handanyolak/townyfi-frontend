<template>
  <div class="flex flex-col items-center space-y-4 p-12">
    <ListTitle class="w-full">Register</ListTitle>

    <ListItem class="w-full" input>
      <template #title> Name: </template>
      <template #item>
        <input v-model="register.name" type="text" />
      </template>
      <span>{{ register.name }}</span>
    </ListItem>
    <ListItem class="w-full" input>
      <template #title> Referrer: </template>
      <template #item>
        <input v-model="register.referrer" type="text" />
      </template>
      <span>{{ register.referrer }}</span>
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
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'

const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const { setting } = storeToRefs(userGameStore)
const { ktaAllowance } = storeToRefs(userWalletStore)
const ktaToken = userWalletStore.ktaToken
const kta = userWalletStore.kta

const emit = defineEmits(['registerClosed'])

const register = reactive({
  name: '',
  referrer: '',
})

const userRegister = async () => {
  const tx = await kta.register(
    ethers.utils.formatBytes32String(register.name),
    register.referrer === '' ? ethers.constants.AddressZero : register.referrer
  )

  await tx.wait()

  emit('registerClosed')
}

const userApprove = async () => {
  await ktaToken.approve(kta.address, ethers.constants.MaxUint256)
}
</script>
