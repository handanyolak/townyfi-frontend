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
import * as yup from 'yup'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import { stringToHex } from '~/utils'

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
const nameRules = yup.string().bytes32().required()
const referrerRules = yup.string().ethereumAddress().optional()

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

onMounted(async () => {
  const settings_ = {
    max: {
      health: 100,
      mana: 125,
      energy: 150,
      armor: 200,
      teleportDistance: 50,
      killArmorRewardLimit: 3,
      safeTownDistance: 0,
      safeTownDifference: 0,
      safeZoneDistance: 4,
      safeZoneDifference: 10000,
      attackDistance: 1,
      levelDifference: 2,
    },
    price: {
      health: 5,
      mana: 50,
      energy: 3,
      armor: 15,
      revive: 50,
      register: 500,
      teleport: 1,
      createTown: 1000,
      settleTown: 2500,
      teleportToTown: 250,
      prepareAttack: 100,
      prepareDefend: 50,
    },
    rate: {
      getHealth: 90,
      getMana: 60,
      getEnergy: 30,
      registerReferralReward: 10,
      armorAbsorption: 2,
      attack: 5,
      movement: 1,
    },
    time: {
      revive: 17280,
      teleport: 60,
      teleportToTown: 720,
      attackableAt: 720,
      warExpiredAt: 360,
      protectionAt: 720,
      prepareToAttack: 30,
    },
    min: {
      levelToCreateTown: 3,
      townAreaRadius: 1,
    },
    exp: {
      kill: 50,
      referrerKill: 1,
    },
    multiplier: {
      attack: 5,
      resistance: 2,
    },
    numberDigits: 1,
  }

  // setTimeout(async () => {
  //   await getKta.value.updateSettings(settings_ as any)
  // }, 10000)
})

// watch(referrer, async (newUsername) => {
//   const hadaRules = yup.string().townyIsRegistered()
//   console.log(await hadaRules.isValid(newUsername))
// })
</script>
