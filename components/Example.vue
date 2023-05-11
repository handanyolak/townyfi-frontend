<template>
  <div></div>
</template>

<script setup lang="ts">
//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { getKtaToken, getKta } = storeToRefs(connectionStore)
const { setting } = storeToRefs(userGameStore)

// onMounted(async () => {
//   const settings_ = {
//     max: {
//       health: 100,
//       mana: 125,
//       energy: 150,
//       armor: 200,
//       teleportDistance: 50,
//       killArmorRewardLimit: 3,
//       safeTownDistance: 100,
//       safeTownDifference: 100,
//       safeZoneDistance: 4,
//       safeZoneDifference: 10000,
//       attackDistance: 1,
//       levelDifference: 2,
//     },
//     price: {
//       health: 5,
//       mana: 50,
//       energy: 3,
//       armor: 15,
//       revive: 50,
//       register: 500,
//       teleport: 1,
//       createTown: 1000,
//       settleTown: 2500,
//       teleportToTown: 250,
//       prepareAttack: 100,
//       prepareDefend: 50,
//     },
//     rate: {
//       getHealth: 90,
//       getMana: 60,
//       getEnergy: 30,
//       registerReferralReward: 10,
//       armorAbsorption: 2,
//       attack: 5,
//       movement: 1,
//     },
//     time: {
//       revive: 17280,
//       teleport: 60,
//       teleportToTown: 720,
//       attackableAt: 720,
//       warExpiredAt: 360,
//       protectionAt: 720,
//       prepareToAttack: 30,
//     },
//     min: {
//       levelToCreateTown: 0,
//       townAreaRadius: 1,
//     },
//     exp: {
//       kill: 50,
//       referrerKill: 1,
//     },
//     multiplier: {
//       attack: 5,
//       resistance: 2,
//     },
//     numberDigits: 1,
//   }

//   setTimeout(async () => {
//     await getKta.value.updateSettings(settings_ as any)
//   }, 10000)
// })

// watch(referrer, async (newUsername) => {
//   console.log('single watch')
// })

// watch([() => form.image, () => form.body],
// ([newImage, newBody], [prevImage, prevBody]) => {
//   console.log('multiple watch')
// })
</script>
