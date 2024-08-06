<template>
  <div class="modal-background rounded-md">
    <div
      class="h-full w-full bg-towny-brown-dark-600 bg-opacity-20 px-4 py-6 backdrop-blur-sm"
    >
      <div v-if="!isBattleOver">
        <!-- Main Battle Section -->
        <section class="grid grid-cols-5">
          <!-- Attacker Section -->
          <section class="col-span-2 col-start-1">
            <WarAnimation
              class="mb-24"
              :is-animating="isLottieRunning"
              :town-name="
                townInfoById[userInfoByAddress[attackerWarrior.address]?.townId]
                  ?.name
              "
              :clan-animation="warriorr1"
            />
            <div class="mb-5 rounded-md bg-[#FFCA6C] p-2">
              <div class="flex items-center">
                <img
                  class="mr-2 h-8 w-8 rounded-full border border-towny-brown-dark-400"
                  :src="makeBlockie(attackerWarrior.address)"
                />
                <p class="text-lg font-semibold text-white">
                  {{ userInfoByAddress[attackerWarrior.address]?.name }}
                </p>
              </div>
              <p class="text-xs font-semibold italic text-white">
                {{ attackerWarrior.address }}
              </p>
            </div>
            <ProgressBar
              :name="'Health'"
              :threshold="20"
              :threshold-color="'bg-[#C22E05]'"
              :color="'bg-[#5cb85c]'"
              :current="attackerWarrior.health"
              :initial="attackerWarrior.firstHealth"
            />
            <ProgressBar
              :threshold="20"
              :threshold-color="'bg-gray-400'"
              :color="'bg-gray-500'"
              :name="'Armor'"
              :current="attackerWarrior.armor"
              :initial="attackerWarrior.firstArmor"
            />
          </section>

          <!-- Damage Display Section -->
          <div class="relative">
            <span
              :class="[
                'absolute top-1/3 z-20 -translate-x-1/2 -translate-y-1/3 transform text-center text-5xl font-bold text-red-600 transition-all duration-700 ease-out',
                isShowDamage
                  ? 'custom-visible custom-animate-up '
                  : 'custom-invisible',
                attack === 1 ? 'right-0' : 'left-0',
              ]"
            >
              <span>{{ isDamage }}</span>
            </span>
            <span
              v-if="currentArmorDamage"
              :class="[
                'absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-bold text-gray-600 transition-all duration-700 ease-out',
                isShowDamage
                  ? 'custom-visible custom-animate-up '
                  : 'custom-invisible',
                attack === 1 ? 'right-0' : 'left-0',
              ]"
            >
              <span>-{{ currentArmorDamage }}</span>
            </span>
            <div
              class="absolute top-0 z-50 w-full scale-x-100"
              :style="`transform: scaleX(${attack})`"
            >
              <client-only>
                <Vue3Lottie
                  ref="lottie"
                  :animation-data="spear"
                  :speed="1.2"
                  :height="400"
                  :width="300"
                  :auto-play="false"
                  :loop="false"
                  @on-complete="onLottieComplete"
                />
              </client-only>
            </div>
          </div>

          <!-- Defender Section -->
          <section class="col-span-2 col-start-4">
            <WarAnimation
              class="mb-24"
              :background-classes="'-scale-x-100 transform'"
              :is-animating="isLottieRunning"
              :town-name="
                townInfoById[userInfoByAddress[defenderWarrior.address]?.townId]
                  ?.name
              "
              :clan-animation="warriorr2"
            />
            <div class="mb-5 rounded-md bg-[#FFCA6C] p-2">
              <div class="flex items-center">
                <img
                  class="mr-2 h-8 w-8 rounded-full border border-towny-brown-dark-400"
                  :src="makeBlockie(defenderWarrior.address)"
                />
                <p class="text-lg font-semibold text-white">
                  {{ userInfoByAddress[defenderWarrior.address]?.name }}
                </p>
              </div>
              <p class="text-xs font-semibold italic text-white">
                {{ defenderWarrior.address }}
              </p>
            </div>
            <ProgressBar
              :name="'Health'"
              :current="defenderWarrior.health"
              :initial="defenderWarrior.firstHealth"
              :threshold="20"
              :threshold-color="'bg-[#C22E05]'"
              :color="'bg-[#5cb85c]'"
            />
            <ProgressBar
              :threshold="20"
              :threshold-color="'bg-gray-400'"
              :color="'bg-gray-500'"
              :name="'Armor'"
              :current="defenderWarrior.armor"
              :initial="defenderWarrior.firstArmor"
            />
          </section>
        </section>

        <!-- Button Section -->
        <section class="relative my-10 flex justify-center space-x-4">
          <div
            v-if="!isBattleStarted"
            class="flex w-1/6 flex-col justify-center"
          >
            <AppButton @click="startBattle"> Start Battle </AppButton>
            <client-only>
              <Vue3Lottie
                :animation-data="warSword"
                :speed="1.2"
                :height="150"
                :width="150"
              />
            </client-only>
          </div>
          <AppButton v-else class="w-1/6" @click="toggleBattle">
            {{ isLottieRunning ? 'Pause' : 'Play' }}
          </AppButton>
        </section>
      </div>
      <div v-if="isBattleOver" class="flex h-full items-center justify-center">
        <div v-if="isWinnerUser" class="space-y-6 rounded-md text-white">
          <h1 class="text-center text-5xl">Congratulations!</h1>
          <client-only>
            <Vue3Lottie :animation-data="graph" :width="300" />
          </client-only>
          <h2 class="text-center text-4xl">
            Your town has emerged victorious in the battle!
          </h2>
        </div>
        <div
          v-else
          class="space-y-6 rounded-md bg-towny-brown-dark-300 p-4 text-white"
        >
          <h1 class="text-center text-5xl">Better luck next time!</h1>
          <h2 class="text-center text-4xl">
            Unfortunately, your town has lost the battle.
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import { type Address, hexToString } from 'viem'
import makeBlockie from 'ethereum-blockies-base64'
import spear from '~/assets/lotties/spear.json'
import warSword from '~/assets/lotties/warSword.json'
import graph from '~/assets/lotties/graph.json'
import ProgressBar from '~/components/common/ProgressBar.vue'
import AppButton from '~/components/common/AppButton.vue'
import WarAnimation from '~/components/war/WarAnimation.vue'
import { transformTown, transformUser } from '~/transformers'

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const { warLogInfo, user } = userGameStore
const lottie = ref<any>(null)
const currentIndex = ref(0)
const currentDamage = ref(
  BigInt(warLogInfo.warLogs[currentIndex.value].healthDamage),
)
const currentArmorDamage = ref(
  BigInt(warLogInfo.warLogs[currentIndex.value].armorDamage),
)
const attack = ref(1)
const isLottieRunning = ref(false)
const isBattleStarted = ref(false)
const isShowDamage = ref(false)
const contractStore = useContractStore()
const { getKta } = storeToRefs(contractStore)
const userInfoByAddress = ref<any>({})
const townInfoById = ref<any>({})
const ATTACKER = ref(1)
const DEFENDER = ref(0)
const warriorr1 = ref<object | undefined>(undefined)
const warriorr2 = ref<object | undefined>(undefined)
const isWinnerUser = BigInt(warLogInfo.winnerTownId) === user.townInfo.townId
const isBattleOver = ref(false)

const warriors = ref([
  {
    address: warLogInfo.warLogs[currentIndex.value].defender,
    health:
      BigInt(warLogInfo.warLogs[currentIndex.value].remainingHealth) +
      BigInt(warLogInfo.warLogs[currentIndex.value].healthDamage),
    firstHealth:
      BigInt(warLogInfo.warLogs[currentIndex.value].remainingHealth) +
      BigInt(warLogInfo.warLogs[currentIndex.value].healthDamage),
    armor:
      BigInt(warLogInfo.warLogs[currentIndex.value].armorDamage) +
      BigInt(warLogInfo.warLogs[currentIndex.value].remainingArmor),
    firstArmor:
      BigInt(warLogInfo.warLogs[currentIndex.value].armorDamage) +
      BigInt(warLogInfo.warLogs[currentIndex.value].remainingArmor),
  },
  {
    address: warLogInfo.warLogs[currentIndex.value].attacker,
    health:
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingHealth) +
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].healthDamage),
    firstHealth:
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingHealth) +
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].healthDamage),
    armor:
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].armorDamage) +
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingArmor),
    firstArmor:
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].armorDamage) +
      BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingArmor),
  },
])

// --------[ Method ]-------- //
const updateBattleLog = () => {
  toggleDamage()
  if (!isLottieRunning.value) {
    isLottieRunning.value = true
    lottie.value.goToAndPlay(1200, false)
  }

  if (warLogInfo.warLogs.length > currentIndex.value) {
    warriors.value[ATTACKER.value].address =
      warLogInfo.warLogs[currentIndex.value].attacker
    warriors.value[DEFENDER.value].address =
      warLogInfo.warLogs[currentIndex.value].defender

    const isAttackerDead = warriors.value[ATTACKER.value].health <= 0n
    if (isAttackerDead) {
      warriors.value[ATTACKER.value].health =
        BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingHealth) +
        BigInt(warLogInfo.warLogs[currentIndex.value + 1].healthDamage)

      warriors.value[ATTACKER.value].armor =
        BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingArmor) +
        BigInt(warLogInfo.warLogs[currentIndex.value + 1].armorDamage)
    }

    warriors.value[DEFENDER.value].health = BigInt(
      warLogInfo.warLogs[currentIndex.value].remainingHealth,
    )

    warriors.value[DEFENDER.value].armor = BigInt(
      warLogInfo.warLogs[currentIndex.value].remainingArmor,
    )

    currentDamage.value = BigInt(
      warLogInfo.warLogs[currentIndex.value].healthDamage,
    )
    currentArmorDamage.value = BigInt(
      warLogInfo.warLogs[currentIndex.value].armorDamage,
    )

    ATTACKER.value = 1 - ATTACKER.value
    DEFENDER.value = 1 - DEFENDER.value
    currentIndex.value++
    toggleAttack()
  } else {
    isBattleOver.value = true
    console.log('End of the battle')
  }
}

const fetchUserInfos = async (uniqAddressess: string[]) => {
  const townIds: bigint[] = []

  for (const address of uniqAddressess) {
    const {
      name,
      townInfo: { townId },
    } = transformUser(await getKta.value.read.userByAddr([address as Address]))

    townIds.push(townId)

    userInfoByAddress.value[address] = {
      name: hexToString(name, { size: 32 }),
      townId: townId.toString(),
    }
  }

  const uniqTownIds = Array.from(new Set(townIds))

  for (const id of uniqTownIds) {
    const { name } = transformTown(await getKta.value.read.townById([id]))

    townInfoById.value[id.toString()] = {
      name: hexToString(name, { size: 32 }),
    }
  }
}

const startBattle = () => {
  attack.value = -1
  updateBattleLog()
  isBattleStarted.value = true
  isLottieRunning.value = true
}

const toggleBattle = () => {
  if (isLottieRunning.value) {
    pauseBattle()
  } else {
    playBattle()
  }
}

const pauseBattle = () => {
  isLottieRunning.value = false
  lottie.value.pause()
}

const playBattle = () => {
  isLottieRunning.value = true
  lottie.value.play()
}

const toggleAttack = () => {
  attack.value = attack.value === 1 ? -1 : 1
}

const onLottieComplete = () => {
  lottie.value.goToAndPlay(1200, false)
  updateBattleLog()
}

const toggleDamage = () => {
  isShowDamage.value = true
  setTimeout(() => (isShowDamage.value = false), 1500)
}

const loadAnimations = async () => {
  const [warrior1Data, warrior2Data] = await Promise.all([
    import('~/assets/lotties/warrior1.json'),
    import('~/assets/lotties/warrior2.json'),
  ])
  warriorr1.value = warrior1Data.default
  warriorr2.value = warrior2Data.default
}

// --------[ Computed ]-------- //
const isDamage = computed(() => {
  return currentDamage.value > 0 ? -currentDamage.value : 'Missing!'
})

const attackerWarrior = computed(() => {
  return warriors.value[ATTACKER.value === 1 ? ATTACKER.value : DEFENDER.value]
})

const defenderWarrior = computed(() => {
  return warriors.value[DEFENDER.value === 0 ? DEFENDER.value : ATTACKER.value]
})

// --------[ Hook ]-------- //

onMounted(() => {
  loadAnimations()
  const addresses: string[] = []
  for (const { attacker, defender } of warLogInfo.warLogs) {
    addresses.push(attacker)
    addresses.push(defender)
  }

  const uniqAddressess = Array.from(new Set(addresses))

  fetchUserInfos(uniqAddressess)
})
</script>

<style>
.custom-visible {
  visibility: visible;
  opacity: 1;
}

.custom-invisible {
  visibility: hidden;
  opacity: 0;
}

.custom-animate-up {
  animation: upAndDisappear 2s forwards;
}

@keyframes upAndDisappear {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-10rem);
    opacity: 0;
  }
}

.modal-background {
  background-image: url('~/assets/img/map3.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
