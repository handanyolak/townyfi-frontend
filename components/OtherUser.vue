<template>
  <div class="p-5">
    <ListTitle>General</ListTitle>
    <ListItem title="Name:" tooltip>
      <span>{{ userName }}</span>
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
      :title="`${toCapitalizedWords(item)}:`"
      v-for="(item, index) in timers"
      :key="index"
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
    </ListItem>
    <OtherTown v-if="user.townInfo.townId" :id="user.townInfo.townId" />
  </div>
</template>

<script setup lang="ts">
import { duration } from 'moment'
import { decodeBytes32String } from 'ethers'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'
import { toCapitalizedWords, middleCropping } from '~/utils'

const { chainBlockTime } = useRuntimeConfig().public

//--------[ Props & Emits ]--------//
interface UserProps {
  address: string
}
const props = defineProps<UserProps>()

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()

const { getKta } = storeToRefs(connectionStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

//--------[ Data ]--------//
// TODO: Buraya bos deger koyunca template'de hata ciktigi icin burayi onmounted'ta eziyoruz.
const user = ref(userGameStore.user)
const timer = ref<any>(user.value.timer.toObject())
const timers = ref(
  Object.keys(user.value.timer).filter((item: any) => isNaN(item))
)
const referrerAddress = user.value.referrer as string

//--------[ Computed ]--------//
const userName = computed(() => decodeBytes32String(user.value.name))
const referrer = computed(() => middleCropping(referrerAddress))

//--------[ Hooks ]--------//
onMounted(async () => {
  user.value = await getKta.value.userByAddr(props.address)
  timer.value = user.value.timer.toObject()
  timers.value = Object.keys(timer.value).filter((item: any) => isNaN(item))
})

//--------[ Methods ]--------//
const convert = (
  isConvert: boolean,
  propertyName: keyof IKillThemAll.UserTimerStruct
) => {
  if (isConvert) {
    timer.value[propertyName] =
      timer.value[propertyName] - currentBlockNumber.value > 0
        ? duration(
            (timer.value[propertyName] - currentBlockNumber.value) *
              chainBlockTime *
              1000
          ).humanize()
        : 0
  } else {
    timer.value[propertyName] = user.value.timer[propertyName].toString()
  }
}
</script>
