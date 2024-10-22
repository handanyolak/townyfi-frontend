<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem title="Name:" editable tooltip @saved="() => onSaved()">
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField v-model="name" name="name" :rules="nameRules" />
          <VeeErrorMessage class="text-red-800" name="name" />
        </VeeForm>
      </template>
      <span>{{ hexToString(user.name, { size: 32 }) }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Coordinate:" tooltip>
      <span>({{ user.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ user.coordinate._y.toString() }})</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Level:" tooltip>
      <span>{{ user.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Exp:" tooltip>
      <span>{{ user.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Referrer:" copiable tooltip :copy-value="referrerAddress">
      <span>{{ referrer }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem title="Health:" tooltip>
      <span>{{ user.health }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Mana:" tooltip>
      <span>{{ user.mana }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Energy:" tooltip>
      <span>{{ user.energy }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Armor:" tooltip>
      <span>{{ user.armor }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem title="Attack:" tooltip>
      <span>{{ user.charPoint.attack }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Defend:" tooltip>
      <span>{{ user.charPoint.defend }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem
      v-for="(item, index) in timers"
      :key="index"
      :title="`${toCapitalizedWords(item)}:`"
      :item="item"
      convertable
      tooltip
      @convert="(isConvert) => convert(isConvert, item as any)"
    >
      <span>{{
        timer[item].toString() === '0' ? 'Available!' : timer[item].toString()
      }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
      <template #action>
        <client-only>
          <Vue3Lottie
            v-if="getPointIcon(item)"
            :class="getPointIcon(item) === undefined ? '' : 'cursor-pointer'"
            :animation-link="getPointIcon(item)"
            :scale="1.5"
            :height="40"
            :width="40"
            @click="handleClick(item)"
          />
        </client-only>
      </template>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { Vue3Lottie } from 'vue3-lottie'
import { hexToString, stringToHex } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import { toCapitalizedWords, middleCropping } from '~/utils'
import { getBytes32Rule } from '~/composables/useYupRules'
import { Get } from '~/enums'
import type { UserTimer } from '~/types'

const {
  public: { chainBlockTime },
} = useRuntimeConfig()

// --------[ Stores ]-------- //
const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()
const contractStore = useContractStore()

const { getKtaCaller } = storeToRefs(contractStore)
const { user } = storeToRefs(userGameStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

// --------[ Data ]-------- //
const timer = reactive<any>(user.value.timer)
const timers = Object.keys(timer).filter((item: any) => isNaN(item))
const name = ref(hexToString(user.value.name, { size: 32 }))
const referrerAddress = user.value.referrer as string
const nameRules = getBytes32Rule()

// --------[ Computed ]-------- //
// TODO: Backend'de get datalar ayrildiktan sonra duzenlenecek
const getPointIcon = computed(() => (_getPoint: string) => {
  const iconName = useLottie(_getPoint)

  return iconName.includes('undefined') ? undefined : useLottie(_getPoint)
})

const referrer = computed(() => middleCropping(referrerAddress))

// --------[ Methods ]-------- //
const convert = (isConvert: boolean, propertyName: keyof UserTimer) => {
  if (isConvert) {
    timer[propertyName] =
      timer[propertyName] - currentBlockNumber.value > 0
        ? moment // eslint-disable-line import/no-named-as-default-member
            .duration(
              (timer[propertyName] - Number(currentBlockNumber.value)) *
                chainBlockTime *
                1000,
            )
            .humanize()
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

  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'get',
    args: [[getItem]],
  })
}

const revive = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'revive',
  })
}
const teleportToTown = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'teleportToTown',
  })
}

const handleClick = async (item: string) => {
  switch (item) {
    case 'getHealth':
    case 'getMana':
    case 'getEnergy':
    case 'getArmor':
      await getSomething(item)
      break
    case 'revive':
      await revive()
      break
    case 'teleportToTown':
      await teleportToTown()
      break
    default:
      break
  }
}

const onSaved = async () => {
  const tempName = name.value
  if (tempName === hexToString(user.value.name, { size: 32 })) {
    return
  }
  const encodedName = stringToHex(tempName, { size: 32 })
  const result = await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'changeName',
    args: [[encodedName]],
  })

  if (result) {
    user.value.name = encodedName
  }
}
</script>
