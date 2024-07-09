<template>
  <div class="grid grid-cols-3 bg-towny-brown-light-200">
    <div>
      <div class="border border-towny-brown-dark-500">
        <h1 class="text-xs">{{ currentClan1Warrior.address }}</h1>
        <img src="@/assets/img/cavalry.svg" class="" />
        <ProgressBar
          name="Clan 1"
          :current-health="currentClan1Warrior.health"
          :max-health="100"
        />
      </div>
    </div>
    <div></div>
    <div>
      <div class="border border-towny-brown-dark-500">
        <h1 class="text-xs">{{ currentClan2Warrior.address }}</h1>
        <img src="@/assets/img/cavalry-night.svg" class="" />
        <ProgressBar
          name="Clan 2"
          :current-health="currentClan2Warrior.health"
          :max-health="100"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { WarLog } from '~/types'
import ProgressBar from '~/components/common/ProgressBar.vue'

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const { warLog } = userGameStore

// --------[ Data Types ]-------- //
interface Warrior {
  address: string
  health: number
}

// --------[ Data ]-------- //
const clan1Warriors = ref<Warrior[]>([])
const clan2Warriors = ref<Warrior[]>([])
const currentLogIndex = ref(0)
const intervalId = ref<number | undefined>(undefined)

const currentClan1Warrior = ref<Warrior>({ address: '', health: 100 })
const currentClan2Warrior = ref<Warrior>({ address: '', health: 100 })
const isClan1Attacking = ref(true) // Saldırı sırasının kimde olduğunu belirler

// --------[ Initialize Warriors ]-------- //
const initializeWarriors = () => {
  const uniqueAttackers = [
    ...new Set(warLog.map((log: WarLog) => log.attacker)),
  ]
  const uniqueDefenders = [
    ...new Set(warLog.map((log: WarLog) => log.defender)),
  ]

  // Attackers'lar ve defenders'lar arasındaki farkı kullanarak savaşçıları ayırıyoruz
  clan1Warriors.value = uniqueAttackers.map((address) => ({
    address,
    health: 100,
  }))
  clan2Warriors.value = uniqueDefenders.map((address) => ({
    address,
    health: 100,
  }))

  currentClan1Warrior.value = clan1Warriors.value[0]
  currentClan2Warrior.value = clan2Warriors.value[0]
}

// --------[ Handle Damage ]-------- //
const handleDamage = (
  currentWarrior: Ref<Warrior>,
  damage: number,
  clanWarriors: Ref<Warrior[]>,
) => {
  currentWarrior.value.health = Math.max(
    0,
    currentWarrior.value.health - damage,
  )
  if (currentWarrior.value.health === 0 && clanWarriors.value.length > 1) {
    const index = clanWarriors.value.findIndex(
      (warrior) => warrior.address === currentWarrior.value.address,
    )
    if (index !== -1) {
      clanWarriors.value.splice(index, 1)
      currentWarrior.value = clanWarriors.value[0]
    }
  }
}

// --------[ Apply Damage ]-------- //
const applyDamage = () => {
  if (currentLogIndex.value < warLog.length) {
    const currentLog = warLog[currentLogIndex.value]
    const damage = Number(currentLog.healthDamage)

    if (isClan1Attacking.value) {
      handleDamage(currentClan2Warrior, damage, clan2Warriors)
      if (
        currentClan2Warrior.value.health === 0 &&
        clan2Warriors.value.length > 1
      ) {
        currentClan2Warrior.value = clan2Warriors.value[0]
      }
    } else {
      handleDamage(currentClan1Warrior, damage, clan1Warriors)
      if (
        currentClan1Warrior.value.health === 0 &&
        clan1Warriors.value.length > 1
      ) {
        currentClan1Warrior.value = clan1Warriors.value[0]
      }
    }

    isClan1Attacking.value = !isClan1Attacking.value // Saldırı sırasını değiştir
    currentLogIndex.value++
  } else {
    stopWar()
  }
}

// --------[ War Control ]-------- //
const stopWar = () => {
  if (intervalId.value !== undefined) {
    clearInterval(Number(intervalId.value))
    intervalId.value = undefined
  }
}

// Watch for changes in currentClan1Warrior
watch(
  () => currentClan1Warrior.value,
  (newWarrior, oldWarrior) => {
    console.log('Clan 1 Warrior changed:', newWarrior)
  },
  { deep: true },
)

// Watch for changes in currentClan2Warrior
watch(
  () => currentClan2Warrior.value,
  (newWarrior, oldWarrior) => {
    console.log('Clan 2 Warrior changed:', newWarrior)
  },
  { deep: true },
)

// Initialize warriors on mount
onMounted(() => {
  initializeWarriors()
  intervalId.value = window.setInterval(() => {
    if (!isWarOver.value) {
      applyDamage()
    } else {
      stopWar()
    }
  }, 200) as number | undefined
})

// Stop the war on unmount
onUnmounted(() => {
  stopWar()
})

// Computed property to check if war is over
const isWarOver = computed(() => {
  return (
    currentLogIndex.value >= warLog.length ||
    (clan1Warriors.value.length === 1 &&
      currentClan1Warrior.value.health === 0) ||
    (clan2Warriors.value.length === 1 && currentClan2Warrior.value.health === 0)
  )
})
</script>
