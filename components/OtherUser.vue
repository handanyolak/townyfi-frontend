<template>
  <div class="p-5">
    <ListTitle>General</ListTitle>
    <ListItem tooltip>
      <template #title> Name: </template>
      <span>{{ userName }}</span>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Coordinate: </template>
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
const timers = ref(Object.keys(user.value.timer).filter((item: any) => isNaN(item)))
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
          (timer.value[propertyName] - currentBlockNumber.value) * chainBlockTime * 1000
        ).humanize()
        : 0
  } else {
    timer.value[propertyName] = user.value.timer[propertyName].toString()
  }
}
</script>
