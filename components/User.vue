<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable tooltip @saved="() => onSaved()">
      <template #title> Name: </template>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
      </template>
      <span>{{ decodeBytes32String(user.name) }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Coordinate </template>
      <span>({{ user.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ user.coordinate._y.toString() }})</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Level: </template>
      <span>{{ user.levelId }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Exp: </template>
      <span>{{ user.exp }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem copiable tooltip :copy-value="referrerAddress">
      <template #title> Referrer: </template>
      <span>{{ referrer }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem tooltip>
      <template #title> Health: </template>
      <span>{{ user.health }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Mana: </template>
      <span>{{ user.mana }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Energy: </template>
      <span>{{ user.energy }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Armor: </template>
      <span>{{ user.armor }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem tooltip>
      <template #title> Attack: </template>
      <span>{{ user.charPoint.attack }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Defend: </template>
      <span>{{ user.charPoint.defend }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem v-for="(item, index) in timers" :key="index" :item="item" convertable tooltip
      @convert="(isConvert) => convert(isConvert, item as any)">
      <template #title> {{ toCapitalizedWords(item) }}: </template>
      <span>{{
        timer[item].toString() === '0' ? 'Available!' : timer[item].toString()
      }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
      <template #action-icon>
        <client-only>
          <Vue3Lottie class="cursor-pointer" :animation-link="getPointIcon(item)" :scale="1.5" :height="40" :width="40"
            @click="getSomething(item)" />
        </client-only>
      </template>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { duration } from 'moment'
import { decodeBytes32String } from 'ethers'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'
import { toCapitalizedWords, middleCropping } from '~/utils'
import { getBytes32Rule } from '~/composables/useYupRules'
import { Get } from '~/enums'
import { encodeBytes32String } from 'ethers'
import { Vue3Lottie } from 'vue3-lottie'

const { chainBlockTime } = useRuntimeConfig().public

//--------[ Stores ]--------//
const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()
const connectionStore = useConnectionStore()

const { user } = storeToRefs(userGameStore)
const { getKtaCaller } = storeToRefs(connectionStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

//--------[ Data ]--------//
const timer = reactive<any>(user.value.timer.toObject())
const timers = Object.keys(timer).filter((item: any) => isNaN(item))
const name = ref(decodeBytes32String(user.value.name))
const referrerAddress = user.value.referrer as string
const nameRules = getBytes32Rule()

//--------[ Computed ]--------//
// TODO: Backend'de get datalar ayrildiktan sonra duzenlenecek
const getPointIcon = computed(() => (_getPoint: string) => {
  const iconName = useLottie(_getPoint)

  return iconName.includes('undefined') ? undefined : useLottie(_getPoint)
})

const referrer = computed(() => middleCropping(referrerAddress))

//--------[ Methods ]--------//
const convert = (
  isConvert: boolean,
  propertyName: keyof IKillThemAll.UserTimerStruct
) => {
  if (isConvert) {
    timer[propertyName] =
      timer[propertyName] - currentBlockNumber.value > 0
        ? duration(
          (timer[propertyName] - currentBlockNumber.value) *
          chainBlockTime *
          1000
        ).humanize()
        : 0
  } else {
    timer[propertyName] = user.value.timer[propertyName].toString()
  }
}

const getSomething = async (item: string) => {
  if (!item.startsWith('get')) {
    return
  }

  const getItem = Get[item.slice(3) as keyof typeof Get]

  await getKtaCaller.value.callFunction('get', [getItem])
}

const onSaved = async () => {
  const tempName = name.value;
  if (tempName === decodeBytes32String(user.value.name)) {
    return
  }
  const encodedName = encodeBytes32String(tempName)
  const result = await getKtaCaller.value.callFunction('changeName', [encodedName])
  if (result) {
    user.value.name = encodedName;
  }
}
</script>
