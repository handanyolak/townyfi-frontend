<template>
  <div class="modal-background rounded-md">
    <div
      class="h-full w-full bg-towny-brown-dark-600 bg-opacity-20 px-1 py-1 backdrop-blur-sm md:px-4 md:py-6"
    >
      <div v-if="!isBattleOver">
        <!-- Main Battle Section -->
        <section class="grid grid-cols-1 gap-4 md:grid-cols-5">
          <!-- Attacker Section -->
          <section class="md:col-span-2 md:col-start-1">
            <WarAnimation
              class="mb-4 md:mb-24"
              :is-animating="isLottieRunning"
              :town-name="
                townInfoById[userInfoByAddress[attackerWarrior.address]?.townId]
                  ?.name
              "
              :clan-animation="warriorr1"
            />
            <div class="mb-2 rounded-md bg-[#FFCA6C] p-2 md:mb-5">
              <div class="flex items-center">
                <img
                  class="mr-2 h-5 w-5 rounded-full border border-towny-brown-dark-400 md:h-8 md:w-8"
                  :src="makeBlockie(attackerWarrior.address)"
                />
                <p class="text-sm font-semibold text-white md:text-lg">
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
                  ? 'custom-visible custom-animate-up'
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
                  ? 'custom-visible custom-animate-up'
                  : 'custom-invisible',
                attack === 1 ? 'right-0' : 'left-0',
              ]"
            >
              <span>-{{ currentArmorDamage }}</span>
            </span>
            <div
              class="absolute top-0 z-50 hidden w-full scale-x-100 md:block"
              :style="`transform: scaleX(${attack});`"
            >
              <client-only>
                <Vue3Lottie
                  ref="lottieInstance"
                  :animation-data="spear"
                  :speed="1.0"
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
          <section class="md:col-span-2 md:col-start-4">
            <WarAnimation
              class="mb-2 md:mb-24"
              :background-classes="'-scale-x-100 transform'"
              :is-animating="isLottieRunning"
              :town-name="
                townInfoById[userInfoByAddress[defenderWarrior.address]?.townId]
                  ?.name
              "
              :clan-animation="warriorr2"
            />

            <div class="mb-2 rounded-md bg-[#FFCA6C] p-2 md:mb-5">
              <div class="flex items-center">
                <img
                  class="mr-2 h-5 w-5 rounded-full border border-towny-brown-dark-400 md:h-8 md:w-8"
                  :src="makeBlockie(defenderWarrior.address)"
                />
                <p class="text-sm font-semibold text-white md:text-lg">
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
            class="flex w-5/6 flex-col justify-center md:w-1/6"
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
          <div v-else class="w-3/5 space-y-3 md:w-1/5">
            <div
              class="flex w-full cursor-pointer items-center justify-between text-lg text-white"
            >
              <AppButton
                class="app-button h-10 w-10 cursor-pointer font-bold transition-transform duration-75 active:scale-110"
                @click="decreaseSpeed"
                >-</AppButton
              >
              <span>Speed</span>
              <AppButton
                class="app-button h-10 w-10 cursor-pointer font-bold transition-transform duration-75 active:scale-110"
                @click="increaseSpeed"
                >+</AppButton
              >
            </div>
            <AppButton class="w-full" @click="toggleBattle">
              {{ isLottieRunning ? 'Pause' : 'Play' }}
            </AppButton>
          </div>
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

const props = defineProps<{
  watchUserWar?: boolean
  sizeMultiplier: number
}>()

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const {
  warLogInfo: userWarLogInfo,
  lastFetchedWar: gameWarLogInfo,
  user,
} = userGameStore
const warLogInfo = props.watchUserWar ? userWarLogInfo : gameWarLogInfo
const lottieInstance = ref<any>(null)
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
const userInfoByAddress = ref<any>({})
const townInfoById = ref<any>({})
const ATTACKER = ref(1)
const DEFENDER = ref(0)
const warriorr1 = ref<object | undefined>(undefined)
const warriorr2 = ref<object | undefined>(undefined)
const isWinnerUser = BigInt(warLogInfo.winnerTownId) === user.townInfo.townId
const isBattleOver = ref(false)
const animationSpeed = ref(1.0)

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
    lottieInstance.value.goToAndPlay(1200, false)
  }

  if (warLogInfo.warLogs.length > currentIndex.value) {
    warriors.value[ATTACKER.value].address =
      warLogInfo.warLogs[currentIndex.value].attacker
    warriors.value[DEFENDER.value].address =
      warLogInfo.warLogs[currentIndex.value].defender

    const isAttackerDead = warriors.value[ATTACKER.value].health <= 0n
    if (isAttackerDead) {
      const isThereNextLog = warLogInfo.warLogs.length > currentIndex.value + 1
      warriors.value[ATTACKER.value].health = isThereNextLog
        ? BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingHealth) +
          BigInt(warLogInfo.warLogs[currentIndex.value + 1].healthDamage)
        : 0n

      warriors.value[ATTACKER.value].armor = isThereNextLog
        ? BigInt(warLogInfo.warLogs[currentIndex.value + 1].remainingArmor) +
          BigInt(warLogInfo.warLogs[currentIndex.value + 1].armorDamage)
        : 0n
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
  lottieInstance.value.pause()
}

const playBattle = () => {
  isLottieRunning.value = true
  lottieInstance.value.play()
}

const toggleAttack = () => {
  attack.value = attack.value === 1 ? -1 : 1
}

const onLottieComplete = () => {
  lottieInstance.value.goToAndPlay(1200, false)
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

const decreaseSpeed = () => {
  if (animationSpeed.value > 0.25) {
    animationSpeed.value -= 0.25
    lottieInstance.value.setSpeed(animationSpeed.value)
  }
}

const increaseSpeed = () => {
  if (animationSpeed.value < 4) {
    animationSpeed.value += 0.25
    lottieInstance.value.setSpeed(animationSpeed.value)
  }
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

  const uniqAddresses = Array.from(new Set(addresses))
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

.app-button {
  transition:
    transform 0.1s ease-in-out,
    box-shadow 0.1s ease-in-out;
}

.app-button:active {
  transform: scale(0.95);
}
</style>
